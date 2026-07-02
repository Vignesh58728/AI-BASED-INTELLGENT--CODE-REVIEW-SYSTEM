from typing import Any, Dict, Optional, Union, List
from beanie import PydanticObjectId
from app.models.progress import Progress
from app.models.user import User
from app.models.sql_models import SQLProgress, SQLUser, SQLProblem, SQLSubmission
from app.db.session import USE_SQL, SessionLocal

async def get_by_user_id(user_id: str) -> Optional[Progress]:
    if USE_SQL:
        db = SessionLocal()
        try:
            return db.query(SQLProgress).filter(SQLProgress.user_id == int(user_id)).first()
        finally:
            db.close()
    return await Progress.find_one(Progress.user.id == PydanticObjectId(user_id))

async def create(*, obj_in: Dict[str, Any]) -> Progress:
    if USE_SQL:
        db = SessionLocal()
        try:
            db_obj = SQLProgress(
                user_id=int(obj_in["user_id"]),
                scores=obj_in.get("scores", {}),
                current_module=obj_in.get("current_module", "school"),
                current_stage=obj_in.get("current_stage", "beginner"),
                failed_stage=obj_in.get("failed_stage")
            )
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        finally:
            db.close()
            
    user = await User.get(obj_in["user_id"])
    if not user:
        raise ValueError("User not found")
        
    db_obj = Progress(
        user=user,
        scores=obj_in.get("scores", {}),
        current_module=obj_in.get("current_module", "school"),
        current_stage=obj_in.get("current_stage", "beginner"),
        failed_stage=obj_in.get("failed_stage")
    )
    await db_obj.insert()
    return db_obj

async def update(
    *, db_obj: Progress, obj_in: Union[Dict[str, Any], Any]
) -> Progress:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.model_dump(exclude_unset=True)
    
    if USE_SQL:
        db = SessionLocal()
        try:
            # Need to get local object if db_obj is from MongoDB
            local_obj = db.query(SQLProgress).filter(SQLProgress.id == db_obj.id).first()
            if local_obj:
                for field, value in update_data.items():
                    setattr(local_obj, field, value)
                db.commit()
                db.refresh(local_obj)
                return local_obj
            return db_obj
        finally:
            db.close()
            
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    await db_obj.save()
    return db_obj

async def recalculate_user_progress(user_id: str, module: str, difficulty: str) -> Progress:
    """
    Recalculates the percentage completion for a specific module and difficulty.
    """
    if USE_SQL:
        db = SessionLocal()
        try:
            # Get problems in stage
            total_problems = db.query(SQLProblem).filter(
                SQLProblem.module == module,
                SQLProblem.difficulty == difficulty
            ).count()
            
            if total_problems == 0:
                return await get_by_user_id(user_id)
            
            # Get successful submissions
            # For simplicity, we check submissions from this user
            subs = db.query(SQLSubmission).filter(SQLSubmission.user_id == int(user_id)).all()
            
            solved_problem_ids = set()
            for sub in subs:
                # Need to check problem context
                problem = db.query(SQLProblem).filter(SQLProblem.id == sub.problem_id).first()
                if problem and problem.module == module and problem.difficulty == difficulty:
                    # check score in result json
                    score = sub.result.get("score", 0) if isinstance(sub.result, dict) else 0
                    if score >= 80:
                        solved_problem_ids.add(problem.id)
            
            percentage = int((len(solved_problem_ids) / total_problems) * 100)
            
            progress = db.query(SQLProgress).filter(SQLProgress.user_id == int(user_id)).first()
            if not progress:
                progress = SQLProgress(user_id=int(user_id), scores={})
                db.add(progress)
                db.commit()
                db.refresh(progress)
            
            # Update scores (JSON field)
            # SQLAlchemy mutable JSON issues might happen, so we copy
            scores = dict(progress.scores) if progress.scores else {}
            if module not in scores:
                scores[module] = {}
            scores[module][difficulty] = percentage
            progress.scores = scores
            
            # Progress chain logic
            _apply_progression(progress, module, difficulty, percentage)
            
            db.commit()
            db.refresh(progress)
            return progress
        finally:
            db.close()

    # MongoDB Version
    from app.models.problem import Problem
    from app.models.submission import Submission
    
    total_problems = await Problem.find(
        Problem.module == module,
        Problem.difficulty == difficulty
    ).count()
    
    if total_problems == 0:
        return await get_by_user_id(user_id)

    best_submissions = await Submission.find(
        Submission.user.id == PydanticObjectId(user_id)
    ).to_list()
    
    solved_problem_ids = set()
    for sub in best_submissions:
        problem = await sub.problem.fetch()
        if problem and problem.module == module and problem.difficulty == difficulty:
            if sub.score >= 80:
                solved_problem_ids.add(str(problem.id))
                
    percentage = int((len(solved_problem_ids) / total_problems) * 100)
    
    progress = await get_by_user_id(user_id)
    if not progress:
        progress = await create(obj_in={"user_id": user_id})
        
    if module not in progress.scores:
        progress.scores[module] = {}
        
    progress.scores[module][difficulty] = percentage
    
    _apply_progression(progress, module, difficulty, percentage)

    await progress.save()
    return progress

def _apply_progression(progress_obj, module: str, difficulty: str, percentage: int):
    stage_chains = {
        "school": ["beginner", "intermediate", "advanced"],
        "college": ["beginner", "intermediate", "advanced"],
        "it": ["beginner", "intermediate", "advanced"]
    }
    
    if module in stage_chains:
        chain = stage_chains[module]
        if difficulty in chain:
            idx = chain.index(difficulty)
            
            current_stage = getattr(progress_obj, 'current_stage', 'beginner') or 'beginner'
            
            if percentage >= 100 and idx < len(chain) - 1:
                next_stage = chain[idx+1]
                if idx >= chain.index(current_stage):
                    progress_obj.current_stage = next_stage
            
            elif percentage < 100:
                if idx >= chain.index(current_stage):
                    progress_obj.current_stage = difficulty
