from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.core.dependencies import get_db, get_current_user
from app.schemas.user import User, UserCreate, UserUpdate, Token
from app.services import auth_service
from app.crud import users as crud_users
import httpx

router = APIRouter()

@router.get("/profile", response_model=User)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user profile.
    """
    return current_user

@router.patch("/profile", response_model=User)
async def update_user_profile(
    *,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update current user profile.
    """
    user = await crud_users.update(db_obj=current_user, obj_in=user_in)
    return user

@router.post("/login", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await auth_service.authenticate_user(
        email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return {
        "access_token": auth_service.create_user_token(user),
        "token_type": "bearer",
    }

@router.post("/register", response_model=User)
async def register_user(
    *,
    user_in: UserCreate
) -> Any:
    """
    Create new user.
    """
    user = await crud_users.get_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = await crud_users.create(obj_in=user_in)
    return user

@router.post("/google/token", response_model=Token)
async def google_token_login(
    payload: dict
) -> Any:
    """
    Verify Google ID token from frontend and return JWT.
    Accepts: { "credential": "<google_id_token>" }
    """
    credential = payload.get("credential")
    if not credential:
        raise HTTPException(status_code=400, detail="Missing Google credential")

    # Verify the token with Google
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
        )
    
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    
    google_data = resp.json()

    # Verify it's for our app
    if google_data.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Token audience mismatch")

    email = google_data.get("email")
    name = google_data.get("name", email.split("@")[0])
    avatar = google_data.get("picture", "")

    if not email:
        raise HTTPException(status_code=400, detail="Could not get email from Google")

    # Find or create user
    user = await crud_users.get_by_email(email=email)
    if not user:
        from app.schemas.user import UserCreate
        user_in = UserCreate(
            email=email,
            full_name=name,
            password="google-oauth-user",  # dummy, won't be used for login
            role="student"
        )
        user = await crud_users.create(obj_in=user_in)

    return {
        "access_token": auth_service.create_user_token(user),
        "token_type": "bearer",
    }
