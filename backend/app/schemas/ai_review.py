from typing import List, Optional
from pydantic import BaseModel

class AIReviewRequest(BaseModel):
    code: str
    language: str
    problem_id: int

class AIReviewItem(BaseModel):
    line: int
    comment: str
    severity: str # "info", "warning", "error"

class AIReviewResponse(BaseModel):
    score: float
    feedback: str
    detailed_reviews: List[AIReviewItem]
    status: str # "completed", "failed"
