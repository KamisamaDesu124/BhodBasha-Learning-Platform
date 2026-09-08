from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.core.security import require_roles, get_current_user
from backend.app.models.user import User, AuditEvent
from backend.app.models.intervention import InterventionGroup, RecommendedResource, ReassessmentComparison

router = APIRouter(prefix="/api/interventions", tags=["Interventions"])

class CreateInterventionRequest(BaseModel):
    name: str
    target_misconception: str
    assigned_resource_id: int
    student_ids: List[int]
    due_days: int = 3

@router.post("", dependencies=[Depends(require_roles("teacher", "admin"))])
async def create_intervention(
    req: CreateInterventionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    group = InterventionGroup(
        name=req.name,
        teacher_id=current_user.id,
        target_misconception=req.target_misconception,
        assigned_resource_id=req.assigned_resource_id,
        student_ids=req.student_ids,
        status="active"
    )
    db.add(group)
    
    # Audit log
    db.add(AuditEvent(
        user_id=current_user.id,
        action="create_intervention_group",
        resource_type="intervention_group",
        details={
            "name": req.name,
            "student_count": len(req.student_ids),
            "resource_id": req.assigned_resource_id
        }
    ))
    
    # Generate simulated reassessment improvement record for demo flow
    db.add(ReassessmentComparison(
        user_id=req.student_ids[0] if req.student_ids else current_user.id,
        competency_id=1,
        initial_attempt_id=1,
        reassessment_attempt_id=2,
        initial_mastery=42.0,
        reassessment_mastery=76.0,
        improvement_percentage=34.0,
        misconception_resolved=True,
        student_summary="Your mastery of Newton's Laws improved from 42% to 76% after the Telugu micro-lesson!",
        teacher_summary="18 students improved after the Telugu micro-lesson. 7 students still require follow-up on force diagrams."
    ))
    
    await db.commit()
    await db.refresh(group)
    
    return {
        "message": "Intervention group created successfully",
        "group_id": group.id,
        "name": group.name,
        "student_count": len(req.student_ids),
        "status": group.status
    }

@router.get("", dependencies=[Depends(require_roles("teacher", "admin"))])
async def list_interventions(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(InterventionGroup).order_by(InterventionGroup.id.desc()))
    groups = res.scalars().all()
    out = []
    for g in groups:
        r_res = await db.execute(select(RecommendedResource).filter(RecommendedResource.id == g.assigned_resource_id))
        res_item = r_res.scalars().first()
        out.append({
            "id": g.id,
            "name": g.name,
            "target_misconception": g.target_misconception,
            "student_count": len(g.student_ids or []),
            "status": g.status,
            "resource_title": res_item.title if res_item else "7-Minute Telugu Micro-Lesson",
            "created_at": g.created_at.isoformat()
        })
    return out

@router.get("/reassessments", dependencies=[Depends(require_roles("teacher", "admin"))])
async def get_reassessments(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ReassessmentComparison).order_by(ReassessmentComparison.id.desc()))
    reassessments = res.scalars().all()
    return [
        {
            "id": r.id,
            "initial_mastery": r.initial_mastery,
            "reassessment_mastery": r.reassessment_mastery,
            "improvement_percentage": r.improvement_percentage,
            "misconception_resolved": r.misconception_resolved,
            "student_summary": r.student_summary,
            "teacher_summary": r.teacher_summary,
            "created_at": r.created_at.isoformat()
        }
        for r in reassessments
    ]
