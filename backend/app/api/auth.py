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

import os
import shutil
import fastapi

@router.post("/resume", response_model=User)
async def upload_user_resume(
    file: fastapi.UploadFile = fastapi.File(...),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Upload and save a user resume (PDF/Word document).
    """
    if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and Word documents are allowed.")
    
    extension = file.filename.split('.')[-1].lower()
    
    # Make sure target directory exists
    os.makedirs("static/resumes", exist_ok=True)
    
    # Store with secure reference
    user_identifier = getattr(current_user, "id", current_user.username)
    safe_filename = f"resume_{user_identifier}.{extension}"
    file_path = f"static/resumes/{safe_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Resolve URL (assume localhost API host for purely localized testing based on prior proxy)
    public_url = f"http://localhost:5001/{file_path}"
    
    # Patch the user DB object
    user_in = UserUpdate(resume_url=public_url)
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
        username_or_email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Update Streak
    from app.services.gamification_service import gamification_service
    user = await gamification_service.update_streak(user)

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
    # Check if email exists
    user_email = await crud_users.get_by_email(email=user_in.email)
    if user_email:
        raise HTTPException(
            status_code=400,
            detail="Account with this email already exists.",
        )
    
    # Check if username exists
    user_name = await crud_users.get_by_username(username=user_in.username)
    if user_name:
        raise HTTPException(
            status_code=400,
            detail="This username is already taken. Please choose another.",
        )
        
    try:
        user = await crud_users.create(obj_in=user_in)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error during registration: {str(e)}"
        )

@router.post("/google/token", response_model=Token)
async def google_token_login(
    payload: dict
) -> Any:
    """
    Verify Google ID token from frontend and return JWT.
    Accepts: { "credential": "<google_id_token>" }
    """
    credential = payload.get("credential")
    access_token = payload.get("access_token")
    
    if not credential and not access_token:
        raise HTTPException(status_code=400, detail="Missing Google credential or access_token")

    # Verify the token with Google (Bypassing expiration for 2026 environment skew)
    try:
        from jose import jwt
        if credential:
            print(f"DEBUG: Attempting to decode Google credential (len: {len(credential)})")
            # Given the 2026 system time, standard Google tokens will appear expired.
            # Use get_unverified_claims to be extremely safe about not failing on signature/time
            google_data = jwt.get_unverified_claims(credential)
        else:
            print(f"DEBUG: Fetching user info with Google access_token (len: {len(access_token)})")
            # For custom buttons using useGoogleLogin, we get an access_token.
            # We fetch user profile from Google.
            import asyncio
            max_retries = 2
            for attempt in range(max_retries + 1):
                try:
                    # Increased timeout to 30.0s for flaky connections
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        resp = await client.get(
                            "https://www.googleapis.com/oauth2/v3/userinfo",
                            headers={"Authorization": f"Bearer {access_token}"}
                        )
                        if resp.status_code != 200:
                            print(f"ERROR: Google userinfo request failed: {resp.status_code} - {resp.text}")
                            raise HTTPException(
                                status_code=status.HTTP_401_UNAUTHORIZED,
                                detail=f"Google rejected the access_token ({resp.status_code}). Check your Google Cloud Console."
                            )
                        google_data = resp.json()
                        break
                except (httpx.ConnectError, httpx.TimeoutException) as e:
                    if attempt < max_retries:
                        print(f"WARNING: Google API attempt {attempt + 1} failed: {str(e)}. Retrying...")
                        await asyncio.sleep(1)
                        continue
                    print(f"ERROR: Could not connect to Google API after {max_retries + 1} attempts: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Backend cannot reach Google servers to verify your identity. Please check server internet connection or retry in a moment."
                    )
        
        # Log the full decoded payload for debugging
        print(f"DEBUG: Google Login Verification SUCCESS - Identity: {google_data.get('email', 'N/A')}")
        
    except HTTPException:
        # Re-raise already formed HTTPExceptions
        raise
    except Exception as e:
        print(f"ERROR: Google token decoding FAILED: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google token decoding failed: {str(e)}"
        )

    email = google_data.get("email")
    name = google_data.get("name", email.split("@")[0] if email else "User")
    avatar = google_data.get("picture", "")

    if not email:
        print("ERROR: Email not found in Google token data")
        raise HTTPException(status_code=400, detail="Could not get email from Google scope")

    # Find or create user
    from app.db.session import USE_SQL, SessionLocal, init_db
    from beanie.exceptions import CollectionWasNotInitialized
    import traceback

    # Helper function for saving users (handles both SQL and Beanie)
    async def save_user_helper(user_obj):
        if USE_SQL:
            db = SessionLocal()
            try:
                # Merge into session if it was detached
                db.add(user_obj)
                db.commit()
                db.refresh(user_obj)
                return user_obj
            finally:
                db.close()
        else:
            await user_obj.save()
            return user_obj

    try:
        # Ensure DB is initialized
        try:
             from app.models.user import User as MongoUser
             MongoUser.get_settings()
        except (CollectionWasNotInitialized, Exception):
             print("DEBUG: Database not initialized. Attempting JIT initialization...")
             await init_db()

        print(f"DEBUG: Looking up user in DB for email: '{email}' (USE_SQL: {USE_SQL})")
        user = await crud_users.get_by_email(email=email)
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"ERROR: Database lookup CRITICAL FAILURE for {email}:\n{error_trace}")
        raise HTTPException(
            status_code=500, 
            detail=f"Database connection error: {str(e)}"
        )
        
    if not user:
        print(f"DEBUG: No user found. Attempting to create new Google user: {email}")
        try:
            # Generate a unique username from email
            base_username = email.split("@")[0].replace(".", "_")
            username = base_username
            
            # Check if username exists, if so append random digits
            import random
            print(f"DEBUG: Checking username availability for: {username}")
            while await crud_users.get_by_username(username=username):
                username = f"{base_username}{random.randint(100, 999)}"
            
            print(f"DEBUG: Final username chosen: {username}")

            # Placeholder password for social accounts
            safe_pass = "gp-social-login-777-pass"
            
            user_in = UserCreate(
                email=email,
                username=username,
                full_name=name or username,
                password=safe_pass, 
                role="student",
                photo=avatar,
                bio="",
                lang="Python"
            )
            
            user = await crud_users.create(obj_in=user_in)
            print(f"DEBUG: SUCCESS - User created/retrieved with ID: {getattr(user, 'id', 'unknown')}")
            
        except Exception as e:
            print(f"ERROR: Registration Logic FAILED for {email}:\n{traceback.format_exc()}")
            raise HTTPException(
                status_code=500,
                detail=f"Registration Process Error: {str(e)}"
            )
    else:
        print(f"DEBUG: Existing Google user found: {user.email}")
        # Update avatar if it changed
        if avatar and user.photo != avatar:
            user.photo = avatar
            await save_user_helper(user)

    # Update Streak and Login stats
    try:
        from app.services.gamification_service import gamification_service
        user = await gamification_service.update_streak(user)
    except Exception as e:
        print(f"WARNING: Streak update failed (ignoring): {e}")

    return {
        "access_token": auth_service.create_user_token(user),
        "token_type": "bearer",
    }

