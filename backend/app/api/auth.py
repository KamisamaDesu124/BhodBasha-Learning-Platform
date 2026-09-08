from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.core.security import (
    verify_password, get_password_hash, create_access_token, get_current_user
)
from backend.app.models.user import User, StudentProfile, TeacherProfile, ConsentRecord, AuditEvent

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "student"  # student, teacher, admin
    preferred_language: str = "te"
    supabase_uid: Optional[str] = None
    consent_offline_sync: bool = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    preferred_language: str
    low_bandwidth_mode: bool
    accessibility_settings: Dict[str, Any]

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    existing = await db.execute(select(User).filter(User.email == req.email))
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )

    user = User(
        email=req.email,
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        role=req.role.lower(),
        preferred_language=req.preferred_language,
        supabase_uid=req.supabase_uid
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Create associated profile
    if user.role == "student":
        db.add(StudentProfile(user_id=user.id))
    elif user.role == "teacher":
        db.add(TeacherProfile(user_id=user.id))

    # Record consent
    db.add(ConsentRecord(
        user_id=user.id,
        consent_type="offline_data_sync",
        granted=req.consent_offline_sync
    ))
    db.add(AuditEvent(
        user_id=user.id,
        action="user_registered",
        resource_type="user",
        resource_id=str(user.id)
    ))
    await db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "preferred_language": user.preferred_language,
            "low_bandwidth_mode": user.low_bandwidth_mode,
            "accessibility_settings": user.accessibility_settings or {}
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email))
    user = result.scalars().first()
    if not user or not user.hashed_password or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    db.add(AuditEvent(
        user_id=user.id,
        action="user_login",
        resource_type="session",
        resource_id=str(user.id)
    ))
    await db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "preferred_language": user.preferred_language,
            "low_bandwidth_mode": user.low_bandwidth_mode,
            "accessibility_settings": user.accessibility_settings or {}
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "preferred_language": current_user.preferred_language,
        "low_bandwidth_mode": current_user.low_bandwidth_mode,
        "accessibility_settings": current_user.accessibility_settings or {}
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    db.add(AuditEvent(
        user_id=current_user.id,
        action="user_logout",
        resource_type="session",
        resource_id=str(current_user.id)
    ))
    await db.commit()
    return {"message": "Logged out successfully"}
