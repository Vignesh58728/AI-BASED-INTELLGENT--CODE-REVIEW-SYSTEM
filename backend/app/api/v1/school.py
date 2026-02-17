from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.crud import problems as crud_problems
from app.models.problem import ProblemModule
from app.schemas.problem import Problem

router = APIRouter()

@router.get("/problems", response_model=List[Problem])
def read_school_problems(
    db: Session = Depends(get_db), skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve problems for the School Module (Beginner to Advanced).
    """
    problems = crud_problems.get_multi_by_module(
        db, module=ProblemModule.SCHOOL, skip=skip, limit=limit
    )
    return problems
