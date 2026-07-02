from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"

class SQLUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="student")
    bio = Column(String)
    lang = Column(String, default="Python")
    photo = Column(String)
    resume_url = Column(String, nullable=True)
    
    # Gamification
    streak_count = Column(Integer, default=0)
    last_login = Column(DateTime)
    badges = Column(JSON, default=[])

class SQLProblem(Base):
    __tablename__ = "problem"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    module = Column(String)
    difficulty = Column(String)
    points = Column(Integer, default=10)
    tags = Column(JSON, default=[])
    template_code = Column(JSON, default={})

class SQLSubmission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    problem_id = Column(Integer)
    code = Column(Text)
    language = Column(String)
    status = Column(String)
    result = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class SQLReview(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer)
    feedback = Column(Text)
    score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class SQLNotification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    title = Column(String)
    message = Column(Text)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SQLProgress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True)
    scores = Column(JSON, default={})
    current_module = Column(String, default="school")
    current_stage = Column(String, default="beginner")
    failed_stage = Column(String)

class SQLSkillProgress(Base):
    __tablename__ = "skill_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    skill_name = Column(String)
    proficiency_level = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow)
