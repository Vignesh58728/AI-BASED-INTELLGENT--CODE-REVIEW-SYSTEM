from datetime import datetime
from typing import Optional
from beanie import Document, Indexed

class Notification(Document):
    user_id: Indexed(str)
    type: str # 'login' | 'download' | 'system'
    title: str
    description: str
    is_read: bool = False
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "notifications"
