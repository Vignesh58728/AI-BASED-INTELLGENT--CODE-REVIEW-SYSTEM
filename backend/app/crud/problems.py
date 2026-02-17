from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.problem import Problem, ProblemModule, DifficultyLevel
from app.schemas.problem import ProblemCreate

def get(db: Session, id: int) -> Optional[Problem]:
    return db.query(Problem).filter(Problem.id == id).first()

def get_multi_by_module(
    db: Session, *, module: ProblemModule, skip: int = 0, limit: int = 100
) -> List[Problem]:
    return (
        db.query(Problem)
        .filter(Problem.module == module)
        .offset(skip)
        .limit(limit)
        .all()
    )

def create(db: Session, *, obj_in: ProblemCreate) -> Problem:
    db_obj = Problem(
        title=obj_in.title,
        description=obj_in.description,
        module=obj_in.module,
        difficulty=obj_in.difficulty,
        points=obj_in.points,
        template_code=obj_in.template_code
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
