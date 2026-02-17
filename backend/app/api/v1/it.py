from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.crud import problems as crud_problems
from app.models.problem import ProblemModule
from app.schemas.problem import Problem

router = APIRouter()

@router.get("/problems", response_model=List[Problem])
def read_it_problems(
    db: Session = Depends(get_db), skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve problems for the IT Module (Full Stack, Cloud, Cyber Security).
    """
    problems = crud_problems.get_multi_by_module(
        db, module=ProblemModule.IT, skip=skip, limit=limit
    )
    return problems
