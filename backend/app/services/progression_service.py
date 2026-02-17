from typing import Dict, Any
from sqlalchemy.orm import Session
from app.crud import progress as crud_progress
from app.models.progress import Progress

def check_and_unlock_next_stage(db: Session, user_id: int, current_score: float) -> Dict[str, Any]:
    """
    Logic to unlock the next stage if the current score is above a threshold.
    Example: 80+ to unlock next stage.
    """
    progress = crud_progress.get_by_user_id(db, user_id=user_id)
    if not progress:
        return {"status": "error", "message": "Progress not found"}
    
    unlocked = False
    message = "Keep practicing!"
    
    if current_score >= 80:
        # Complex logic for stage transition (beginner -> intermediate -> advanced)
        # For now, just update a flag or move pointer
        unlocked = True
        message = "Next stage unlocked!"
        
        # Update progress in DB
        # crud_progress.update(...)
        
    return {
        "score": current_score,
        "unlocked": unlocked,
        "message": message,
        "next_stage": progress.current_stage # Simplified
    }
