import logging
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.models.assessment import AssessmentAttempt, AttemptAnswer, Question, QuestionOption, Assessment
from backend.app.models.mastery import MasteryScore, UserCompetencyEvidence
from backend.app.models.user import StudentProfile, User
from backend.app.services.mastery_calc import calculate_attempt_mastery

logger = logging.getLogger("bhodbasha.sync")

async def process_offline_attempt_sync(
    user_id: int,
    sync_payload: Dict[str, Any],
    db: AsyncSession
) -> Dict[str, Any]:
    """
    Idempotent sync handler for offline assessment submissions.
    """
    client_attempt_id = sync_payload.get("client_attempt_id")
    if not client_attempt_id:
        raise ValueError("Missing client_attempt_id in sync payload")

    # Check for existing synced attempt (Idempotency)
    existing_attempt_res = await db.execute(
        select(AssessmentAttempt).filter(AssessmentAttempt.client_attempt_id == client_attempt_id)
    )
    existing_attempt = existing_attempt_res.scalars().first()
    if existing_attempt:
        return {
            "status": "already_synced",
            "attempt_id": existing_attempt.id,
            "client_attempt_id": client_attempt_id,
            "score_percentage": existing_attempt.score_percentage,
            "ai_estimated_mastery": existing_attempt.ai_estimated_mastery,
            "message": "Attempt was previously synced successfully."
        }

    assessment_id = sync_payload.get("assessment_id", 1)
    answers_data = sync_payload.get("answers", [])
    language_used = sync_payload.get("language_used", "te")
    total_time_seconds = sync_payload.get("total_time_seconds", 120)

    # Process and verify answers
    processed_answers = []
    correct_count = 0

    for a_data in answers_data:
        q_id = a_data.get("question_id")
        opt_id = a_data.get("selected_option_id")
        
        q_res = await db.execute(select(Question).filter(Question.id == q_id))
        question = q_res.scalars().first()
        
        is_correct = False
        misconception_tag = None
        if opt_id:
            opt_res = await db.execute(select(QuestionOption).filter(QuestionOption.id == opt_id))
            opt = opt_res.scalars().first()
            if opt:
                is_correct = opt.is_correct
                misconception_tag = opt.misconception_tag

        if is_correct:
            correct_count += 1

        processed_answers.append({
            "question_id": q_id,
            "selected_option_id": opt_id,
            "is_correct": is_correct,
            "difficulty": question.difficulty if question else "medium",
            "student_confidence": a_data.get("student_confidence", "high"),
            "time_spent_seconds": a_data.get("time_spent_seconds", 30),
            "misconception_detected": misconception_tag,
            "competency_id": question.competency_id if question else None
        })

    # Retrieve prior attempts to calculate improvement
    prior_attempts_res = await db.execute(
        select(AssessmentAttempt).filter(
            AssessmentAttempt.user_id == user_id,
            AssessmentAttempt.assessment_id == assessment_id
        ).order_by(AssessmentAttempt.id.desc())
    )
    prior_attempts = prior_attempts_res.scalars().all()
    has_prior = len(prior_attempts) > 0
    previous_accuracy = prior_attempts[0].score_percentage if has_prior else 0.0

    raw_score = (correct_count / len(processed_answers) * 100.0) if processed_answers else 0.0
    mastery_val, improvement_delta, mastery_label = calculate_attempt_mastery(
        processed_answers,
        previous_accuracy=previous_accuracy,
        has_previous_attempt=has_prior
    )

    # Create AssessmentAttempt
    attempt = AssessmentAttempt(
        client_attempt_id=client_attempt_id,
        assessment_id=assessment_id,
        user_id=user_id,
        is_offline=sync_payload.get("is_offline", True),
        language_used=language_used,
        score_percentage=raw_score,
        ai_estimated_mastery=mastery_val,
        total_time_seconds=total_time_seconds,
        sync_status="synced"
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)

    # Save individual answers
    for p_ans in processed_answers:
        ans_record = AttemptAnswer(
            attempt_id=attempt.id,
            question_id=p_ans["question_id"],
            selected_option_id=p_ans["selected_option_id"],
            is_correct=p_ans["is_correct"],
            student_confidence=p_ans["student_confidence"],
            time_spent_seconds=p_ans["time_spent_seconds"],
            misconception_detected=p_ans["misconception_detected"]
        )
        db.add(ans_record)

        # Record competency evidence
        if p_ans["competency_id"]:
            db.add(UserCompetencyEvidence(
                user_id=user_id,
                competency_id=p_ans["competency_id"],
                attempt_id=attempt.id,
                score_percentage=100.0 if p_ans["is_correct"] else 0.0,
                weight=1.0,
                source="offline_sync_quiz"
            ))

            # Update MasteryScore for competency
            comp_score_res = await db.execute(
                select(MasteryScore).filter(
                    MasteryScore.user_id == user_id,
                    MasteryScore.competency_id == p_ans["competency_id"]
                )
            )
            m_score = comp_score_res.scalars().first()
            if not m_score:
                m_score = MasteryScore(
                    user_id=user_id,
                    competency_id=p_ans["competency_id"],
                    current_mastery=mastery_val,
                    previous_mastery=previous_accuracy,
                    improvement_delta=improvement_delta,
                    mastery_label=mastery_label,
                    evidence_count=1
                )
                db.add(m_score)
            else:
                m_score.previous_mastery = m_score.current_mastery
                m_score.current_mastery = mastery_val
                m_score.improvement_delta = round(mastery_val - m_score.previous_mastery, 1)
                m_score.mastery_label = mastery_label
                m_score.evidence_count += 1

    # Update Student Profile offline sync counter
    prof_res = await db.execute(select(StudentProfile).filter(StudentProfile.user_id == user_id))
    profile = prof_res.scalars().first()
    if profile:
        profile.offline_sync_count += 1
        profile.total_study_time_seconds += total_time_seconds

    await db.commit()

    return {
        "status": "synced",
        "attempt_id": attempt.id,
        "client_attempt_id": client_attempt_id,
        "score_percentage": raw_score,
        "ai_estimated_mastery": mastery_val,
        "improvement_delta": improvement_delta,
        "mastery_label": mastery_label,
        "synced_at": attempt.synced_at.isoformat()
    }
