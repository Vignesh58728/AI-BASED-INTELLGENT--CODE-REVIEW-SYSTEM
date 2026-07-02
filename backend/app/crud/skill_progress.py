from typing import List, Optional
from beanie import PydanticObjectId
from app.models.skill_progress import SkillProgress
from app.models.user import User
from app.models.sql_models import SQLSkillProgress, SQLUser
from app.db.session import USE_SQL, SessionLocal
from datetime import datetime

async def get_by_user(user_id: str) -> List[SkillProgress]:
    if USE_SQL:
        db = SessionLocal()
        try:
            return db.query(SQLSkillProgress).filter(SQLSkillProgress.user_id == int(user_id)).all()
        finally:
            db.close()
    return await SkillProgress.find(SkillProgress.user.id == PydanticObjectId(user_id)).to_list()

async def update_skill(user_id: str, skill_name: str, proficiency_level: float) -> SkillProgress:
    if USE_SQL:
        db = SessionLocal()
        try:
            user = db.query(SQLUser).filter(SQLUser.id == int(user_id)).first()
            if not user:
                raise ValueError("User not found")
                
            skill = db.query(SQLSkillProgress).filter(
                SQLSkillProgress.user_id == user.id,
                SQLSkillProgress.skill_name == skill_name
            ).first()
            
            if skill:
                skill.proficiency_level = proficiency_level
                skill.last_updated = datetime.utcnow()
            else:
                skill = SQLSkillProgress(
                    user_id=user.id,
                    skill_name=skill_name,
                    proficiency_level=proficiency_level
                )
                db.add(skill)
            
            db.commit()
            db.refresh(skill)
            return skill
        finally:
            db.close()
            
    # MongoDB Version
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
