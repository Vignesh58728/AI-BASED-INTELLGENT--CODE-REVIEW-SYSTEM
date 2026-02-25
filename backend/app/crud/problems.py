from typing import List, Optional
from beanie import PydanticObjectId
from app.models.problem import Problem, ProblemModule, DifficultyLevel
from app.schemas.problem import ProblemCreate

async def get(id: str) -> Optional[Problem]:
    return await Problem.get(id)

async def get_multi_by_module(
    *, module: ProblemModule, skip: int = 0, limit: int = 100
) -> List[Problem]:
    return await Problem.find(
        Problem.module == module
    ).skip(skip).limit(limit).to_list()

async def create(*, obj_in: ProblemCreate) -> Problem:
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
