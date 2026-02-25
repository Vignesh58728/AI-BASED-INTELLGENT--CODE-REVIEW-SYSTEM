from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.schemas.submission_schema import Submission, SubmissionCreate
from app.crud import submission_crud as crud_submissions

router = APIRouter()

@router.post("/", response_model=Submission)
async def create_submission(
    *,
    submission_in: SubmissionCreate
) -> Any:
    """Submit solution for a problem."""
    try:
        return await crud_submissions.create(obj_in=submission_in)
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/user/{user_id}", response_model=List[Submission])
async def read_user_submissions(
    user_id: str
) -> Any:
    """Get history of submissions for a user."""
    return await crud_submissions.get_by_user(user_id=user_id)
