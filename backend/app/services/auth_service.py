from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.crud import users as crud_users
from app.models.user import User

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    return crud_users.authenticate(db, email=email, password=password)

def create_user_token(user: User) -> str:
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
