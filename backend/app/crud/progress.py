from typing import Any, Dict, Optional, Union
from beanie import PydanticObjectId
from app.models.progress import Progress
from app.models.user import User

async def get_by_user_id(user_id: str) -> Optional[Progress]:
    return await Progress.find_one(Progress.user.id == PydanticObjectId(user_id))

async def create(*, obj_in: Dict[str, Any]) -> Progress:
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
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    await db_obj.save()
    return db_obj

async def recalculate_user_progress(user_id: str, module: str, difficulty: str) -> Progress:
    """
    Recalculates the percentage completion for a specific module and difficulty.
    """
    from app.models.problem import Problem
    from app.models.submission import Submission
    
    # Get all problems in this stage
    total_problems = await Problem.find(
        Problem.module == module,
        Problem.difficulty == difficulty
    ).count()
    
    if total_problems == 0:
        return await get_by_user_id(user_id)

    # Get all solved problems (unique) in this stage for this user
    # A problem is considered 'solved' if the best score is >= 80
    best_submissions = await Submission.find(
        Submission.user.id == PydanticObjectId(user_id)
    ).to_list()
    
    solved_problem_ids = set()
    for sub in best_submissions:
        # Check if the problem belongs to the module/difficulty
        problem = await sub.problem.fetch()
        if problem and problem.module == module and problem.difficulty == difficulty:
            if sub.score >= 80:
                solved_problem_ids.add(str(problem.id))
                
    percentage = int((len(solved_problem_ids) / total_problems) * 100)
    
    # Update progress document
    progress = await get_by_user_id(user_id)
    if not progress:
        progress = await create(obj_in={"user_id": user_id})
        
    if module not in progress.scores:
        progress.scores[module] = {}
        
    progress.scores[module][difficulty] = percentage
    
    # Generic progression mapping for ALL modules
    # Unlocks stage N+1 if stage N is 100% complete
    stage_chains = {
        "school": ["beginner", "intermediate", "advanced"],
        "college": ["beginner", "intermediate", "advanced"],
        "it": ["beginner", "intermediate", "advanced"]
    }
    
    if module in stage_chains:
        chain = stage_chains[module]
        if difficulty in chain:
            idx = chain.index(difficulty)
            
            # If current stage is 100%, and there's a next stage, unlock it
            if percentage >= 100 and idx < len(chain) - 1:
                next_stage = chain[idx+1]
                # We only upgrade if the current stored current_stage is at or below the one we just finished
                if idx >= chain.index(progress.current_stage or chain[0]):
                    progress.current_stage = next_stage
            
            # If not 100%, and they are currently on this stage, keep it there
            elif percentage < 100:
                if idx >= chain.index(progress.current_stage or chain[0]):
                    progress.current_stage = difficulty

    await progress.save()
    return progress
