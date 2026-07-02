from beanie import Document, Link
from pydantic import Field
from datetime import datetime
from typing import Optional
from app.models.user import User
from app.models.problem import Problem

class Submission(Document):
    user: Link[User]
    problem: Link[Problem]
    
    code: str
    language: str
    
    score: float = 0.0
    feedback: Optional[str] = None # AI Feedback
    
    # Execution Results
    status: str = "pending" # pending, success, error, timeout
    output: Optional[str] = None
    error_msg: Optional[str] = None
    
    # CCM (Code Check Module) Results
    ccm_status: str = "pending" # pending, completed, rejected
    ccm_feedback: Optional[str] = None
    ccm_score: float = 0.0
    
    # CRM (Code Review Module) & Tracking
    review_chain_id: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "submissions"
