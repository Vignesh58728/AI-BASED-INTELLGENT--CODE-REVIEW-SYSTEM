from typing import List, Optional, Union
from pydantic import BaseModel

class AIReviewRequest(BaseModel):
    code: str
    language: str
    problem_id: Optional[Union[str, int]] = None
    user_id: Optional[Union[str, int]] = None
    model: Optional[str] = "default"

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
    line: Optional[int] = None
    model: Optional[str] = "default"
    language_hint: Optional[str] = "english"

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
    model: Optional[str] = "default"

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
    problem_id: Optional[Union[str, int]] = None
    model: Optional[str] = "default"

class CodeGenResponse(BaseModel):
    code: str
    explanation: str
    status: str = "completed"

class TestCase(BaseModel):
    input: str
    expectedOutput: str

class CodeReviewSubmitRequest(BaseModel):
    code: str
    problemContext: str
    testCases: List[TestCase]
    requiredFunctions: Optional[List[str]] = None
    language: Optional[str] = "python"

class TestResult(BaseModel):
    input: str
    expected: str
    actual: str
    passed: bool
    error: Optional[str] = None
    executor_status: Optional[str] = None

class CodeReviewSubmitResponse(BaseModel):
    status: str # "passed", "failed", "rejected"
    type: Optional[str] = None # For rejection types
    message: Optional[str] = None
    aiReview: Optional[str] = None
    runResult: Optional[dict] = None
    reviewStatus: str # "no_correct", "no_meaningless", "proceed"
