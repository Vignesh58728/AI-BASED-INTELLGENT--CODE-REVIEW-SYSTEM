from beanie import Document, Link
from pydantic import Field
from typing import Optional, List
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"

class User(Document):
    full_name: Optional[str] = Field(None, index=True)
    email: str = Field(..., unique=True, index=True)
    username: str = Field(..., unique=True, index=True)
    hashed_password: str
    is_active: bool = True
    role: UserRole = UserRole.STUDENT
    bio: Optional[str] = None
    lang: Optional[str] = "Python"
    photo: Optional[str] = None

    # Relationships (Beanie uses Link for references)
    # We might want to keep these as references or embed depending on query patterns
    # For now, let's use Link for consistency with SQL relationships
    # Note: These actually need to be linked to the specific document classes
    # progress: Optional[Link["Progress"]] = None
    # submissions: List[Link["Submission"]] = []
    # skill_progress: List[Link["SkillProgress"]] = []

    class Settings:
        name = "users"
