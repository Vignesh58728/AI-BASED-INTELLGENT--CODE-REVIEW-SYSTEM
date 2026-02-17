from sqlalchemy import Column, Integer, String, Text, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class ProblemModule(str, enum.Enum):
    SCHOOL = "school"
    COLLEGE = "college"
    IT = "it"

class Problem(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    module = Column(Enum(ProblemModule))
    difficulty = Column(Enum(DifficultyLevel))
    points = Column(Integer, default=10)
    
    # Boilerplate code for various languages
    template_code = Column(JSON, default=dict)

    # Relationships
    submissions = relationship("Submission", back_populates="problem")
