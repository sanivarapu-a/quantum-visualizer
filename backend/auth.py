"""
Password hashing and JWT creation/verification.

Deliberately has zero FastAPI/HTTP knowledge in this file, same
principle as translator.py — routes call these, this file doesn't
know about requests or responses.
"""

import os
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError

# In production, load this from an environment variable, never hardcode
# it in source. For local dev, os.getenv with a fallback is fine.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> int:
    """Returns the user id encoded in a valid token. Raises JWTError if
    the token is invalid, expired, or tampered with."""
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return int(payload["sub"])