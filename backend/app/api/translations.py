from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user, require_roles
from backend.app.models.user import User, AuditEvent
from backend.app.models.asset import Translation, SubtitleTrack

router = APIRouter(prefix="/api/translations", tags=["Translations"])

@router.get("")
async def list_translations(
    asset_id: Optional[int] = None,
    language: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Translation)
    if asset_id:
        query = query.filter(Translation.asset_id == asset_id)
    if language:
        query = query.filter(Translation.target_language == language)
    
    result = await db.execute(query)
    translations = result.scalars().all()
    return [
        {
            "id": t.id,
            "asset_id": t.asset_id,
            "target_language": t.target_language,
            "source_segment_id": t.source_segment_id,
            "translated_text": t.translated_text,
            "locked_terms": t.locked_terms,
            "confidence": t.confidence,
            "is_reviewed": t.is_reviewed
        }
        for t in translations
    ]

@router.post("/{translation_id}/approve")
async def approve_translation(
    translation_id: int,
    current_user: User = Depends(require_roles("teacher", "admin")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Translation).filter(Translation.id == translation_id))
    t = res.scalars().first()
    if not t:
        raise HTTPException(status_code=404, detail="Translation not found")
    
    t.is_reviewed = True
    db.add(AuditEvent(
        user_id=current_user.id,
        action="approve_translation",
        resource_type="translation",
        resource_id=str(t.id),
        details={"language": t.target_language, "asset_id": t.asset_id}
    ))
    await db.commit()
    return {"message": "Translation approved successfully", "translation_id": t.id}
