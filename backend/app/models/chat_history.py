from beanie import Document, Link
from pydantic import Field
from datetime import datetime
from typing import List, Optional
from app.models.user import User

class ChatHistory(Document):
    user: Link[User]
    # messages stores role and content
    messages: List[dict] = [] # List of {"role": str, "content": str}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_history"
