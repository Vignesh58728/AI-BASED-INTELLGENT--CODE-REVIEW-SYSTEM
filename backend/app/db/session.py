from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.sql_models import SQLUser, SQLProblem, SQLSubmission, SQLReview, SQLNotification, SQLProgress, SQLSkillProgress
import os

# SQL Connection Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Global flag fixed to True for SQL-only backend
USE_SQL = True

async def init_db():
    print("INITIALIZING SQL DATABASE (SQLite)...")
    # Initialize SQL tables
    Base.metadata.create_all(bind=engine)
    print("Local SQL database initialized successfully.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
