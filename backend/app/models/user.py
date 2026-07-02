from beanie import Document, Link
from pydantic import Field
from datetime import datetime
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
    resume_url: Optional[str] = None
    
    # Gamification
    streak_count: int = 0
    last_login: Optional[datetime] = None
    badges: List[str] = []

    class Settings:
        name = "users"
