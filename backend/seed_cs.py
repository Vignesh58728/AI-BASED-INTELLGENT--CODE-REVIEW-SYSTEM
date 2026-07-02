
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
    template_code = Column(JSON, default=dict)

def seed():
    db = SessionLocal()
    
    problems = [
        {
            "title": "Operating Systems - Process Scheduling",
            "description": "Explain and implement FCFS scheduling algorithm logic.",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 15,
            "template_code": {"python": "def schedule(processes):\n    # logic\n    pass"}
        },
        {
            "title": "DBMS - SQL Query Optimization",
            "description": "Write a query to find the second highest salary using subquery.",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 20,
            "template_code": {"sql": "SELECT ..."}
        }
    ]

    for p_data in problems:
        # Check if already exists by title
        if not db.query(Problem).filter(Problem.title == p_data["title"]).first():
            db.add(Problem(**p_data))
    
    db.commit()
    print(f"Added {len(problems)} CS Core problems.")
    db.close()

if __name__ == "__main__":
    seed()
