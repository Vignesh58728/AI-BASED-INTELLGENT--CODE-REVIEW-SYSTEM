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
        bio=obj_in.bio,
        lang=obj_in.lang,
        photo=obj_in.photo,
    )
    await db_obj.insert()
    return db_obj

async def update(*, db_obj: User, obj_in: UserUpdate) -> User:
    update_data = obj_in.dict(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["hashed_password"] = hashed_password
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    await db_obj.save()
    return db_obj

async def authenticate(*, email: str, password: str) -> Optional[User]:
    user = await get_by_email(email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
