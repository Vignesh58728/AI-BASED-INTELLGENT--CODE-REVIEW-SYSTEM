from typing import Optional
from datetime import timedelta
from app.core import security
from app.core.config import settings
from app.crud import users as crud_users
from app.models.user import User

async def authenticate_user(email: str, password: str) -> Optional[User]:
    return await crud_users.authenticate(email=email, password=password)

def create_user_token(user: User) -> str:
    print(f"DEBUG: Creating token for user type: {type(user)}, data: {user}")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return security.create_access_token(
        str(user.id), 
        expires_delta=access_token_expires,
        additional_data={
            "name": user.full_name,
            "email": user.email,
            "username": user.username,
            "role": user.role,
            "photo": user.photo
        }
    )
