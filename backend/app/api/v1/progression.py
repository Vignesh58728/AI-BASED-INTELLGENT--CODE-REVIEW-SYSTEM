from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.schemas.progress import UserProgressResponse
from app.services import progression_service

router = APIRouter()

@router.get("/me", response_model=UserProgressResponse)
def get_my_progress(
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user's progress and stats.
    """
    # Mock response for now
    return {
        "user_id": 1,
        "total_score": 92.5,
        "completed_stages": 5,
        "current_status": "Unlocked: Intermediate Stage 2"
    }

@router.post("/failed-stage")
def handle_failed_stage(
    stage_id: str,
    db: Session = Depends(get_db),
) -> Any:
    """
    Handle logic when a user fails a stage.
    """
    return {"status": "recorded", "stage": stage_id, "message": "Failed stage tracked."}
