from typing import Any, List
from fastapi import APIRouter
from app.crud import problems as crud_problems
from app.models.problem import ProblemModule
from app.schemas.problem import Problem
import json
import os

router = APIRouter()

# Load static fallback data
STATIC_SCHOOL_PROBLEMS = []
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    resources_path = os.path.join(current_dir, "..", "resources", "school_programs.json")
    if os.path.exists(resources_path):
        with open(resources_path, "r") as f:
            STATIC_SCHOOL_PROBLEMS = json.load(f)
        print(f"INFO: Loaded {len(STATIC_SCHOOL_PROBLEMS)} school programs from static fallback.")
    else:
        print(f"WARNING: School programs fallback file not found at {resources_path}")
except Exception as e:
    print(f"ERROR: Failed to load school programs fallback: {e}")

@router.get("/school", response_model=List[Problem])
async def read_school_problems(
    skip: int = 0, limit: int = 100
) -> Any:
    """Retrieve problems for the School Module with robust fallback."""
    try:
        db_problems = await crud_problems.get_multi_by_module(module=ProblemModule.SCHOOL, skip=skip, limit=limit)
        if db_problems:
            return db_problems
    except Exception as e:
        print(f"Database error in read_school_problems: {e}")
    
    # Fallback logic
    if not skip:
        return STATIC_SCHOOL_PROBLEMS[:limit]
    return []

@router.get("/college", response_model=List[Problem])
async def read_college_problems(
    skip: int = 0, limit: int = 100
) -> Any:
    """Retrieve problems for the College Module."""
    try:
        return await crud_problems.get_multi_by_module(module=ProblemModule.COLLEGE, skip=skip, limit=limit)
    except Exception as e:
        print(f"DATABASE ERROR in read_college_problems: {e}")
        return []

@router.get("/it", response_model=List[Problem])
async def read_it_problems(
    skip: int = 0, limit: int = 100
) -> Any:
    """Retrieve problems for the IT Module."""
    try:
        return await crud_problems.get_multi_by_module(module=ProblemModule.IT, skip=skip, limit=limit)
    except Exception as e:
        print(f"DATABASE ERROR in read_it_problems: {e}")
        return []

@router.get("/{problem_id}", response_model=Problem)
async def read_problem(
    problem_id: str
) -> Any:
    """Retrieve a specific problem."""
    try:
        db_problem = await crud_problems.get(id=problem_id)
        if db_problem:
            return db_problem
    except Exception as e:
        print(f"Database error in read_problem: {e}")
    
    # Static fallback check
    for p in STATIC_SCHOOL_PROBLEMS:
        if str(p.get("id")) == str(problem_id):
            return p
            
    return None
