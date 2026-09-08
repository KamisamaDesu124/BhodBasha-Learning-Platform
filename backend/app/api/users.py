from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user, require_roles
from backend.app.models.user import User, StudentProfile, TeacherProfile, AuditEvent

router = APIRouter(prefix="/api/users", tags=["Users"])

class UpdatePreferencesRequest(BaseModel):
    preferred_language: Optional[str] = None
    low_bandwidth_mode: Optional[bool] = None
    accessibility_settings: Optional[Dict[str, Any]] = None

@router.put("/preferences")
async def update_preferences(
    req: UpdatePreferencesRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if req.preferred_language is not None:
        current_user.preferred_language = req.preferred_language
    if req.low_bandwidth_mode is not None:
        current_user.low_bandwidth_mode = req.low_bandwidth_mode
    if req.accessibility_settings is not None:
        current_user.accessibility_settings = req.accessibility_settings

    await db.commit()
    await db.refresh(current_user)
    return {
        "id": current_user.id,
        "email": current_user.email,
        "preferred_language": current_user.preferred_language,
        "low_bandwidth_mode": current_user.low_bandwidth_mode,
        "accessibility_settings": current_user.accessibility_settings
    }

@router.get("/students", dependencies=[Depends(require_roles("teacher", "admin"))])
async def list_students(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).filter(User.role == "student")
    )
    students = result.scalars().all()
    out = []
    for s in students:
        prof_res = await db.execute(select(StudentProfile).filter(StudentProfile.user_id == s.id))
        prof = prof_res.scalars().first()
        out.append({
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "preferred_language": s.preferred_language,
            "grade": prof.grade if prof else "10",
            "school_name": prof.school_name if prof else "Government High School",
            "offline_sync_count": prof.offline_sync_count if prof else 0
        })
    return out
