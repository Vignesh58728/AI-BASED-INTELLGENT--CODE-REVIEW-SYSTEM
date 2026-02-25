from beanie import Document, Link
from pydantic import Field
from typing import Optional, Dict
from app.models.user import User

class Progress(Document):
    user: Link[User]
    
    # Track completion across modules
    # Format: {"school": {"beginner": 100, "intermediate": 50, ...}, "college": {...}}
    scores: Dict[str, Dict[str, int]] = {}
    
    # Track which stage is currently locked/unlocked
    failed_stage: Optional[str] = None
    current_module: str = "school"
    current_stage: str = "beginner"

    class Settings:
        name = "progress"
