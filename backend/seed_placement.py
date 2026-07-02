
import enum
from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class ProblemModule(str, enum.Enum):
    SCHOOL = "school"
    COLLEGE = "college"
    IT = "it"

class Problem(Base):
    __tablename__ = "problem"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    module = Column(Enum(ProblemModule))
    difficulty = Column(Enum(DifficultyLevel))
    points = Column(Integer, default=10)
    tags = Column(JSON, default=list)
    template_code = Column(JSON, default=dict)

def seed():
    db = SessionLocal()
    
    problems = [
        # Interview Questions
        {
            "title": "Explain OOPs concepts",
            "description": "Provide a detailed explanation of Abstraction, Encapsulation, Inheritance, and Polymorphism.",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 15,
            "tags": ["interview", "oops"],
            "template_code": {"text": "Explain here..."}
        },
        {
            "title": "What is the difference between SQL and NoSQL?",
            "description": "Compare relational and non-relational databases.",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 15,
            "tags": ["interview", "dbms"],
            "template_code": {"text": "Explain here..."}
        }
    ]

    for p_data in problems:
        if not db.query(Problem).filter(Problem.title == p_data["title"]).first():
            db.add(Problem(**p_data))
    
    db.commit()
    print(f"Added {len(problems)} placement/interview problems.")
    db.close()

if __name__ == "__main__":
    seed()
