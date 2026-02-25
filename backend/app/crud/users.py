from typing import Optional, List
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

async def get_by_email(email: str) -> Optional[User]:
    return await User.find_one(User.email == email)

async def get_by_username(username: str) -> Optional[User]:
    return await User.find_one(User.username == username)

async def create(*, obj_in: UserCreate) -> User:
    db_obj = User(
        email=obj_in.email,
        username=obj_in.username,
        hashed_password=get_password_hash(obj_in.password),
        full_name=obj_in.full_name,
        role=obj_in.role,
    )
    await db_obj.insert()
    return db_obj

async def authenticate(*, email: str, password: str) -> Optional[User]:
    user = await get_by_email(email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
