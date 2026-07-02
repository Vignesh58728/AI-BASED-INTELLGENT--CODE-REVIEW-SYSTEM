from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None, additional_data: dict = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    if additional_data:
        to_encode.update(additional_data)
        
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Match the hashing stripping
    plain_password = plain_password.strip()
    
    # Truncate to match hashing limit (71 chars for safety)
    encoded_pass = plain_password.encode('utf-8')
    if len(encoded_pass) > 71:
        plain_password = encoded_pass[:71].decode('utf-8', 'ignore')
        
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    # Remove leading/trailing whitespace
    password = password.strip()
    
    # Bypass for social login placeholders to avoid any bcrypt limits
    if "social-login" in password or password.startswith("gp-"):
        return "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L6.SxD3XzF3G0uS" # dummy hash for 'password'

    # Bcrypt has a hard limit of 72 bytes. 
    # To be extremely safe, we'll ensure the byte-length is under 72.
    encoded_pass = password.encode('utf-8')
    if len(encoded_pass) > 71: # Using 71 for a safety margin
        print(f"DEBUG: Truncating long password from {len(encoded_pass)} bytes.")
        password = encoded_pass[:71].decode('utf-8', 'ignore')

    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
