from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.core.security import require_roles, get_current_user
from backend.app.models.user import User, AuditEvent
from backend.app.models.assessment import Assessment, Question, QuestionOption

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])

@router.get("")
async def list_assessments(asset_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = select(Assessment)
    if asset_id:
        query = query.filter(Assessment.asset_id == asset_id)
    result = await db.execute(query)
    assessments = result.scalars().all()
    return [
        {
            "id": a.id,
            "asset_id": a.asset_id,
            "title": a.title,
            "assessment_type": a.assessment_type,
            "passing_score": a.passing_score,
            "time_limit_minutes": a.time_limit_minutes,
            "review_status": a.review_status,
            "is_published": a.is_published
        }
        for a in assessments
    ]

@router.get("/{assessment_id}/questions")
async def get_assessment_questions(assessment_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Assessment).filter(Assessment.id == assessment_id))
    assessment = res.scalars().first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    q_res = await db.execute(select(Question).filter(Question.assessment_id == assessment_id))
    questions = q_res.scalars().all()
    out = []
    for q in questions:
        opt_res = await db.execute(select(QuestionOption).filter(QuestionOption.question_id == q.id))
        opts = opt_res.scalars().all()
        out.append({
            "id": q.id,
            "assessment_id": q.assessment_id,
            "question_type": q.question_type,
            "difficulty": q.difficulty,
            "question_text_en": q.question_text_en,
            "question_text_te": q.question_text_te,
            "question_text_hi": q.question_text_hi,
            "explanation_en": q.explanation_en,
            "explanation_te": q.explanation_te,
            "explanation_hi": q.explanation_hi,
            "source_citation": q.source_citation,
            "review_status": q.review_status,
            "confidence": q.confidence,
            "options": [
                {
                    "id": o.id,
                    "option_label": o.option_label,
                    "text_en": o.text_en,
                    "text_te": o.text_te,
                    "text_hi": o.text_hi,
                    "is_correct": o.is_correct,
                    "misconception_tag": o.misconception_tag
                }
                for o in opts
            ]
        })
    return out

@router.post("/questions/{question_id}/approve")
async def approve_question(
    question_id: int,
    current_user: User = Depends(require_roles("teacher", "admin")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Question).filter(Question.id == question_id))
    q = res.scalars().first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    q.review_status = "approved"
    db.add(AuditEvent(
        user_id=current_user.id,
        action="approve_question",
        resource_type="question",
        resource_id=str(q.id)
    ))
    await db.commit()
    return {"message": "Question approved successfully", "question_id": q.id}
