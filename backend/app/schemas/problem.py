from typing import Optional, Dict, List, Any
from pydantic import BaseModel
from app.models.problem import DifficultyLevel, ProblemModule

class ProblemBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    module: Optional[ProblemModule] = None
    difficulty: Optional[DifficultyLevel] = None
    points: Optional[int] = 10
    tags: List[str] = []
    template_code: Optional[Dict] = {}

class ProblemCreate(ProblemBase):
    title: str
    module: ProblemModule
    difficulty: DifficultyLevel

class ProblemUpdate(ProblemBase):
    pass

class Problem(ProblemBase):
    id: Any

    class Config:
        from_attributes = True
        populate_by_name = True
