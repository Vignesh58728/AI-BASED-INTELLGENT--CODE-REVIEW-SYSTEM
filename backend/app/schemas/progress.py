from typing import Optional, Dict
from pydantic import BaseModel

class ProgressBase(BaseModel):
    scores: Optional[Dict] = {}
    current_module: Optional[str] = "school"
    current_stage: Optional[str] = "beginner"
    failed_stage: Optional[str] = None

class ProgressCreate(ProgressBase):
    user_id: int

class ProgressUpdate(ProgressBase):
    pass

class Progress(ProgressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
        
class UserProgressResponse(BaseModel):
    # Specialized response for the frontend dashboard
    user_id: int
    total_score: float
    completed_stages: int
    current_status: str # e.g. "Locked at Stage 5"
