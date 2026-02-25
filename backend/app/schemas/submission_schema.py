from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class SubmissionBase(BaseModel):
    problem_id: int
    code: str
    language: str
    score: Optional[float] = 0.0
    feedback: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    user_id: int

class SubmissionUpdate(BaseModel):
    score: Optional[float] = None
    feedback: Optional[str] = None

class SubmissionInDBBase(SubmissionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Submission(SubmissionInDBBase):
    pass
