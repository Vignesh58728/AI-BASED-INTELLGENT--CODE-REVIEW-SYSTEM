from typing import List, Optional
from beanie import PydanticObjectId
from app.models.submission import Submission
from app.models.user import User
from app.models.problem import Problem
from app.models.sql_models import SQLSubmission, SQLUser, SQLProblem
from app.schemas.submission_schema import SubmissionCreate
from app.db.session import USE_SQL, SessionLocal

async def get(id: str) -> Optional[Submission]:
    if USE_SQL:
        db = SessionLocal()
        try:
            try:
                numeric_id = int(id)
                return db.query(SQLSubmission).filter(SQLSubmission.id == numeric_id).first()
            except ValueError:
                return None
        finally:
            db.close()
    return await Submission.get(id)

async def get_by_user(user_id: str) -> List[Submission]:
    if USE_SQL:
        db = SessionLocal()
        try:
            try:
                numeric_id = int(user_id)
                return db.query(SQLSubmission).filter(SQLSubmission.user_id == numeric_id).all()
            except ValueError:
                return []
        finally:
            db.close()
    return await Submission.find(Submission.user.id == PydanticObjectId(user_id)).to_list()

from app.services.ccm_service import ccm_service

async def create(*, obj_in: SubmissionCreate) -> Submission:
    if USE_SQL:
        db = SessionLocal()
        try:
            user = db.query(SQLUser).filter(SQLUser.id == int(obj_in.user_id)).first()
            problem = db.query(SQLProblem).filter(SQLProblem.id == int(obj_in.problem_id)).first()
            
            if not user or not problem:
                raise ValueError("User or Problem not found")

            db_obj = SQLSubmission(
                user_id=user.id,
                problem_id=problem.id,
                code=obj_in.code,
                language=obj_in.language,
                status="pending",
                result={}
            )
            
            # Simple CCM mock for SQL (or use service)
            eval_result = await ccm_service.evaluate_submission(db_obj, problem)
            db_obj.status = eval_result.get("action", "unknown")
            db_obj.result = eval_result
            
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            
            # Update progress in background
            try:
                from app.crud.progress import recalculate_user_progress
                await recalculate_user_progress(
                    user_id=str(user.id), 
                    module=problem.module, 
                    difficulty=problem.difficulty
                )
            except Exception as e:
                print(f"Failed to update progress (SQL): {e}")
                
            return db_obj
        finally:
            db.close()
            
    # MongoDB Version
    user = await User.get(obj_in.user_id)
    problem = await Problem.get(obj_in.problem_id)
    
    if not user or not problem:
        raise ValueError("User or Problem not found")

    db_obj = Submission(
        user=user,
        problem=problem,
        code=obj_in.code,
        language=obj_in.language,
        score=obj_in.score,
        feedback=obj_in.feedback
    )
    
    eval_result = await ccm_service.evaluate_submission(db_obj, problem)
    
    if eval_result.get("action") == "approve":
        db_obj.score = eval_result.get("score", db_obj.score)
    else:
        db_obj.score = 0.0
        
    db_obj.feedback = eval_result.get("feedback")
    
    await db_obj.insert()
    
    try:
        from app.crud.progress import recalculate_user_progress
        await recalculate_user_progress(
            user_id=str(user.id), 
            module=problem.module, 
            difficulty=problem.difficulty
        )
    except Exception as e:
        print(f"Failed to update progress: {e}")
        
    return db_obj
