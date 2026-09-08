from fastapi import APIRouter, Depends
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.models.mastery import MasteryScore, CompetencyGap
from backend.app.models.curriculum import Competency
from backend.app.services.gap_detector import evaluate_student_gaps

router = APIRouter(prefix="/api/mastery", tags=["Mastery Scores"])

@router.get("/my")
async def get_my_mastery(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Ensure gaps and scores are fresh
    await evaluate_student_gaps(current_user.id, db)
    
    res = await db.execute(
        select(MasteryScore, Competency).join(
            Competency, MasteryScore.competency_id == Competency.id
        ).filter(MasteryScore.user_id == current_user.id)
    )
    scores = res.all()
    out = []
    for score, comp in scores:
        out.append({
            "competency_id": comp.id,
            "competency_code": comp.code,
            "competency_name": comp.name,
            "current_mastery": score.current_mastery,
            "previous_mastery": score.previous_mastery,
            "improvement_delta": score.improvement_delta,
            "mastery_label": score.mastery_label,
            "evidence_count": score.evidence_count,
            "confidence": score.confidence
        })
    return out
