from beanie import Document, Link
from pydantic import Field
from datetime import datetime
from app.models.user import User

class SkillProgress(Document):
    user: Link[User]
    skill_name: str
    proficiency_level: float
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "skill_progress"
