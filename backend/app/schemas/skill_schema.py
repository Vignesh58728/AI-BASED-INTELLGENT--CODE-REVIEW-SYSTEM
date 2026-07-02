from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class SkillBase(BaseModel):
    skill_name: str
    proficiency_level: float

class SkillUpdateRequest(BaseModel):
    skill_name: str
    proficiency_level: float

class SkillCreate(SkillBase):
    user_id: str

class SkillUpdate(SkillBase):
    proficiency_level: Optional[float] = None

class Skill(SkillBase):
    id: str
    user_id: str
    last_updated: datetime

    class Config:
        from_attributes = True
