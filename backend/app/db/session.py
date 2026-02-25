from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.progress import Progress
from app.models.skill_progress import SkillProgress
from app.models.chat_history import ChatHistory

from app.models.review import Review

async def init_db():
    client = AsyncIOMotorClient(
        settings.DATABASE_URL, 
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=5000
    )
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        document_models=[
            User,
            Problem,
            Submission,
            Review,
            Progress,
            SkillProgress,
            ChatHistory
        ]
    )
