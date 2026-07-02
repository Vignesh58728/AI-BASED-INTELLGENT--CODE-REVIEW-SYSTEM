from typing import Optional, List
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.models.sql_models import SQLUser
from app.schemas.user import UserCreate, UserUpdate
from app.db.session import USE_SQL, SessionLocal

async def get(id: str) -> Optional[User]:
    if USE_SQL:
        db = SessionLocal()
        try:
            try:
                numeric_id = int(id)
                return db.query(SQLUser).filter(SQLUser.id == numeric_id).first()
            except ValueError:
                return None
        finally:
            db.close()
    return await User.get(id)

async def get_by_email(email: str) -> Optional[User]:
    print(f"DEBUG: crud_users.get_by_email called with: {email} (USE_SQL: {USE_SQL})")
    if USE_SQL:
        db = SessionLocal()
        try:
            return db.query(SQLUser).filter(SQLUser.email == email).first()
        finally:
            db.close()
    return await User.find_one({"email": email})

async def get_by_username(username: str) -> Optional[User]:
    print(f"DEBUG: crud_users.get_by_username called with: {username} (USE_SQL: {USE_SQL})")
    if USE_SQL:
        db = SessionLocal()
        try:
            return db.query(SQLUser).filter(SQLUser.username == username).first()
        finally:
            db.close()
    return await User.find_one({"username": username})

async def create(*, obj_in: UserCreate) -> User:
    print(f"DEBUG: crud_users.create called for: {obj_in.email} (USE_SQL: {USE_SQL})")
    hashed = get_password_hash(obj_in.password)
    
    if USE_SQL:
        db = SessionLocal()
        try:
            db_obj = SQLUser(
                email=obj_in.email,
                username=obj_in.username,
                hashed_password=hashed,
                full_name=obj_in.full_name,
                role=obj_in.role or "student",
                bio=obj_in.bio,
                lang=obj_in.lang or "Python",
                photo=obj_in.photo,
            )
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        finally:
            db.close()
            
    db_obj = User(
        email=obj_in.email,
        username=obj_in.username,
        hashed_password=hashed,
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
    
    if USE_SQL:
        db = SessionLocal()
        try:
            # Need to get local object if db_obj is from MongoDB
            if hasattr(db_obj, "id"):
                local_obj = db.query(SQLUser).filter(SQLUser.id == db_obj.id).first()
                if local_obj:
                    for field, value in update_data.items():
                        setattr(local_obj, field, value)
                    db.commit()
                    db.refresh(local_obj)
                    return local_obj
            return db_obj # Fallback if not found
        finally:
            db.close()
            
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    await db_obj.save()
    return db_obj

async def authenticate(*, username_or_email: str, password: str) -> Optional[User]:
    # Try finding user by email first
    user = await get_by_email(email=username_or_email)
    
    # If not found by email, try by username
    if not user:
        user = await get_by_username(username=username_or_email)
        
    if not user:
        return None
        
    if not verify_password(password, user.hashed_password):
        return None
    return user
