from beanie import Document
from pydantic import Field
from typing import Optional, List, Dict
import enum

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class ProblemModule(str, enum.Enum):
    SCHOOL = "school"
    COLLEGE = "college"
    IT = "it"

class Problem(Document):
    title: str = Field(..., index=True)
    description: str
    module: ProblemModule
    difficulty: DifficultyLevel
    points: int = 10
    tags: List[str] = []
    
    # Boilerplate code for various languages
    template_code: Dict[str, str] = {}

    class Settings:
        name = "problems"
