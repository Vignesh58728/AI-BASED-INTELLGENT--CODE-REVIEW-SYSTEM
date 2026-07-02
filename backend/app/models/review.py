from beanie import Document, Link
from pydantic import Field
from datetime import datetime
from typing import Optional, List
from app.models.user import User
from app.models.submission import Submission

class Review(Document):
    submission: Link[Submission]
    reviewer: Link[User]
    
    comments: List[dict] = [] # List of {line: int, text: str, type: str}
    overall_feedback: str
    rating: int = Field(ge=1, le=5)
    
    # Review Chain Persistence
    parent_review_id: Optional[str] = None
    chain_id: str
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reviews"
