from typing import Optional
from datetime import timedelta
from app.core import security
from app.core.config import settings
from app.crud import users as crud_users
from app.models.user import User

async def authenticate_user(username_or_email: str = None, password: str = None, email: str = None) -> Optional[User]:
    # Support both 'username_or_email' and 'email' parameter for flexibility
    lookup = username_or_email or email
    return await crud_users.authenticate(username_or_email=lookup, password=password)

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
