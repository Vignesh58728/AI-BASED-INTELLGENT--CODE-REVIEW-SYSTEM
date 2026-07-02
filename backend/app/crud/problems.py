from typing import List, Optional
from beanie import PydanticObjectId
from app.models.problem import Problem, ProblemModule, DifficultyLevel
from app.models.sql_models import SQLProblem
from app.schemas.problem import ProblemCreate
from app.db.session import USE_SQL, SessionLocal

async def get(id: str) -> Optional[Problem]:
    if USE_SQL:
        db = SessionLocal()
        try:
            # Try numeric ID if possible
            try:
                numeric_id = int(id)
                return db.query(SQLProblem).filter(SQLProblem.id == numeric_id).first()
            except ValueError:
                return db.query(SQLProblem).filter(SQLProblem.title == id).first()
        finally:
            db.close()
    return await Problem.get(id)

async def get_multi_by_module(
    *, module: ProblemModule, skip: int = 0, limit: int = 100
) -> List[Problem]:
    if USE_SQL:
        db = SessionLocal()
        try:
            return db.query(SQLProblem).filter(SQLProblem.module == module).offset(skip).limit(limit).all()
        finally:
            db.close()
    return await Problem.find(
        Problem.module == module
    ).skip(skip).limit(limit).to_list()

async def create(*, obj_in: ProblemCreate) -> Problem:
    if USE_SQL:
        db = SessionLocal()
        try:
            db_obj = SQLProblem(
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
        finally:
            db.close()
            
    db_obj = Problem(
        title=obj_in.title,
        description=obj_in.description,
        module=obj_in.module,
        difficulty=obj_in.difficulty,
        points=obj_in.points,
        template_code=obj_in.template_code
    )
    await db_obj.insert()
    return db_obj
