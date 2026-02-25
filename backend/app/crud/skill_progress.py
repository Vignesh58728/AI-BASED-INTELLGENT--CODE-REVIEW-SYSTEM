from typing import List, Optional
from beanie import PydanticObjectId
from app.models.skill_progress import SkillProgress
from app.models.user import User

async def get_by_user(user_id: str) -> List[SkillProgress]:
    return await SkillProgress.find(SkillProgress.user.id == PydanticObjectId(user_id)).to_list()

async def update_skill(user_id: str, skill_name: str, proficiency_level: float) -> SkillProgress:
    user = await User.get(user_id)
    if not user:
        raise ValueError("User not found")
        
    skill = await SkillProgress.find_one(
        SkillProgress.user.id == PydanticObjectId(user_id),
        SkillProgress.skill_name == skill_name
    )
    
    if skill:
        skill.proficiency_level = proficiency_level
        await skill.save()
    else:
        skill = SkillProgress(
            user=user,
            skill_name=skill_name,
            proficiency_level=proficiency_level
        )
        await skill.insert()
    
    return skill
