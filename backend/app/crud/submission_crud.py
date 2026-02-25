from typing import List, Optional
from beanie import PydanticObjectId
from app.models.submission import Submission
from app.models.user import User
from app.models.problem import Problem
from app.schemas.submission_schema import SubmissionCreate

async def get(id: str) -> Optional[Submission]:
    return await Submission.get(id)

async def get_by_user(user_id: str) -> List[Submission]:
    # In Beanie, if we use Link, we query by the id of the reference
    return await Submission.find(Submission.user.id == PydanticObjectId(user_id)).to_list()

from app.services.ccm_service import ccm_service

async def create(*, obj_in: SubmissionCreate) -> Submission:
    # We fetch the documents to create Links
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
    
    # Run CCM (Code Check Module) Evaluation
    eval_result = await ccm_service.evaluate_submission(db_obj, problem)
    
    # Update score and feedback if CCM approved
    if eval_result.get("action") == "approve":
        db_obj.score = eval_result.get("score", db_obj.score)
    else:
        db_obj.score = 0.0 # Force 0 if rejected by CCM
        
    db_obj.feedback = eval_result.get("feedback")
    
    await db_obj.insert()
    return db_obj
