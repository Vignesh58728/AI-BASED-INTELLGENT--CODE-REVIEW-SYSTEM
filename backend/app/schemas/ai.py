from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class AIChatSource(BaseModel):
    title: str
    url: str

class AIChatRequest(BaseModel):
    query: str
    model: Optional[str] = "default"
    history: List[dict] = Field(default_factory=list)
    file_context: Optional[str] = None
    language_hint: Optional[str] = "english"
    use_web_search: bool = False

class AIChatResponse(BaseModel):
    answer: str
    sources: List[AIChatSource]
    suggested_questions: List[str]
    status: str = "completed"

class AIGeneratedQuestionRequest(BaseModel):
    topic: str
    difficulty: str
    language: str = "python"

class AIGeneratedQuestionResponse(BaseModel):
    title: str
    description: str
    template_code: str
    difficulty: str
    topic: str
    status: str = "completed"

class ChatHistorySaveRequest(BaseModel):
    messages: List[dict]

class ChatHistoryResponse(BaseModel):
    messages: List[dict]
    updated_at: datetime
