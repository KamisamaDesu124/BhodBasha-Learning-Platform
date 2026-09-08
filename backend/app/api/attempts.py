from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.models.assessment import AssessmentAttempt, AttemptAnswer
from backend.app.services.sync_service import process_offline_attempt_sync

router = APIRouter(prefix="/api/attempts", tags=["Assessment Attempts"])

class AnswerInput(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None
    student_confidence: str = "high"
    time_spent_seconds: int = 30

class SubmitAttemptRequest(BaseModel):
    client_attempt_id: str
    assessment_id: int
    is_offline: bool = False
    language_used: str = "te"
    total_time_seconds: int = 120
    answers: List[AnswerInput]

@router.post("")
async def submit_attempt(
    req: SubmitAttemptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await process_offline_attempt_sync(
        user_id=current_user.id,
        sync_payload=req.model_dump(),
        db=db
    )
    return result

@router.get("/my")
async def get_my_attempts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(AssessmentAttempt).filter(AssessmentAttempt.user_id == current_user.id).order_by(AssessmentAttempt.id.desc())
    )
    attempts = res.scalars().all()
    return [
        {
            "id": a.id,
            "client_attempt_id": a.client_attempt_id,
            "assessment_id": a.assessment_id,
            "is_offline": a.is_offline,
            "language_used": a.language_used,
            "score_percentage": a.score_percentage,
            "ai_estimated_mastery": a.ai_estimated_mastery,
            "total_time_seconds": a.total_time_seconds,
            "sync_status": a.sync_status,
            "created_at": a.created_at.isoformat()
        }
        for a in attempts
    ]
