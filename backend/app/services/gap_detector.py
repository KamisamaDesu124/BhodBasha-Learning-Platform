from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.models.curriculum import Competency
from backend.app.models.mastery import MasteryScore, CompetencyGap, UserCompetencyEvidence

async def evaluate_student_gaps(user_id: int, db: AsyncSession) -> List[Dict[str, Any]]:
    """Evaluates all competencies for a student and computes gap analysis."""
    comp_result = await db.execute(select(Competency))
    competencies = comp_result.scalars().all()

    gaps = []
    for comp in competencies:
        # Check current mastery score
        score_res = await db.execute(
            select(MasteryScore).filter(
                MasteryScore.user_id == user_id,
                MasteryScore.competency_id == comp.id
            )
        )
        score = score_res.scalars().first()
        current_mastery = score.current_mastery if score else 0.0
        evidence_count = score.evidence_count if score else 0

        gap_value = max(0.0, comp.benchmark_mastery - current_mastery)

        if evidence_count == 0:
            classification = "No evidence"
            recommended_action = "Take initial diagnostic assessment."
        elif current_mastery >= 80.0:
            classification = "Strong area"
            recommended_action = "Advance to advanced mechanical engineering scenarios."
        elif current_mastery >= 50.0:
            classification = "Developing area"
            recommended_action = "Practice 3 targeted numerical MCQs."
        else:
            classification = "Weak area"
            recommended_action = "Review targeted multilingual micro-lesson and retake concept quiz."

        # Upsert CompetencyGap in database
        gap_record_res = await db.execute(
            select(CompetencyGap).filter(
                CompetencyGap.user_id == user_id,
                CompetencyGap.competency_id == comp.id
            )
        )
        gap_record = gap_record_res.scalars().first()
        if not gap_record:
            gap_record = CompetencyGap(
                user_id=user_id,
                competency_id=comp.id,
                required_mastery=comp.benchmark_mastery,
                current_mastery=current_mastery,
                gap=gap_value,
                classification=classification,
                recommended_action=recommended_action
            )
            db.add(gap_record)
        else:
            gap_record.current_mastery = current_mastery
            gap_record.gap = gap_value
            gap_record.classification = classification
            gap_record.recommended_action = recommended_action

        gaps.append({
            "competency_id": comp.id,
            "competency_code": comp.code,
            "competency_name": comp.name,
            "required_mastery": comp.benchmark_mastery,
            "current_mastery": current_mastery,
            "gap": round(gap_value, 1),
            "evidence_count": evidence_count,
            "classification": classification,
            "recommended_action": recommended_action
        })

    await db.commit()
    return gaps
