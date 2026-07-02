from typing import Any, List
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.user import User
from app.crud import skill_progress as crud_skill
from app.crud import progress as crud_progression
from app.schemas.skill_schema import Skill, SkillUpdateRequest
from app.schemas.progress import Progress

router = APIRouter()

@router.get("/progress", response_model=Progress)
async def get_my_overall_progress(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user's overall progress and stats.
    """
    progress = await crud_progression.get_by_user_id(user_id=str(current_user.id))
    if not progress:
        # Create initial progress if not exists
        progress = await crud_progression.create(obj_in={"user_id": str(current_user.id)})
    return progress

@router.get("/skills", response_model=List[Skill])
async def get_my_skills(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user's skill proficiency levels.
    """
    return await crud_skill.get_by_user(user_id=str(current_user.id))

@router.post("/update-skill", response_model=Skill)
async def update_skill_progress(
    request: SkillUpdateRequest,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update a user's proficiency in a specific skill.
    """
    return await crud_skill.update_skill(
        user_id=str(current_user.id), 
        skill_name=request.skill_name, 
        proficiency_level=request.proficiency_level
    )
