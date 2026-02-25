from typing import List, Optional
from pydantic import BaseModel

class AIReviewRequest(BaseModel):
    code: str
    language: str
    problem_id: Optional[str] = None
    user_id: Optional[str] = None

class AIItem(BaseModel):
    line: int
    comment: str
    severity: str # "info", "warning", "error"

class AIReviewResponse(BaseModel):
    score: float
    feedback: str
    detailed_reviews: List[AIItem]
    status: str # "completed", "failed"

class ComplexityResponse(BaseModel):
    time_complexity: str # e.g., "O(n)"
    space_complexity: str # e.g., "O(1)"
    explanation: str
    status: str = "completed"

class ExplainRequest(BaseModel):
    code: str
    language: str
    model: Optional[str] = "default"

class ExplainResponse(BaseModel):
    explanation: str
    line_by_line: Optional[List[dict]] = []
    status: str = "completed"

class SuggestionResponse(BaseModel):
    suggestions: List[str]
    status: str = "completed"

class EdgeCaseItem(BaseModel):
    input: str
    reason: str

class EdgeCaseResponse(BaseModel):
    cases: List[EdgeCaseItem]
    status: str = "completed"

class FixRequest(BaseModel):
    code: str
    language: str

class FixResponse(BaseModel):
    fixed_code: str
    explanation: str
    status: str = "completed"

class PlagiarismResponse(BaseModel):
    is_plagiarized: bool
    confidence: float
    likely_source: Optional[str] = None
    status: str = "completed"

class CodeGenRequest(BaseModel):
    prompt: str
    language: str
    problem_id: Optional[str] = None

class CodeGenResponse(BaseModel):
    code: str
    explanation: str
    status: str = "completed"
