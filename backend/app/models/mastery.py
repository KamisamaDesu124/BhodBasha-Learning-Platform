from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class UserCompetencyEvidence(Base):
    __tablename__ = "user_competency_evidences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.id"), nullable=False)
    attempt_id = Column(Integer, nullable=True)
    score_percentage = Column(Float, nullable=False)
    weight = Column(Float, default=1.0)
    source = Column(String(50), default="quiz_attempt")  # quiz_attempt, reassessment, teacher_eval
    timestamp = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="competency_evidences")
    competency = relationship("Competency", back_populates="evidences")


class MasteryScore(Base):
    __tablename__ = "mastery_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.id"), nullable=False)
    current_mastery = Column(Float, default=0.0)  # 0 to 100
    previous_mastery = Column(Float, default=0.0)
    improvement_delta = Column(Float, default=0.0)
    mastery_label = Column(String(50), default="Developing")  # Mastered, Developing, Needs support, Not enough evidence
    evidence_count = Column(Integer, default=1)
    confidence = Column(Float, default=0.92)
    last_evaluated_at = Column(DateTime, default=utc_now)

    competency = relationship("Competency", back_populates="mastery_scores")


class CompetencyGap(Base):
    __tablename__ = "competency_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.id"), nullable=False)
    required_mastery = Column(Float, default=80.0)
    current_mastery = Column(Float, default=0.0)
    gap = Column(Float, default=80.0)
    classification = Column(String(50), default="Weak area")  # Strong area, Developing area, Weak area, No evidence
    recommended_action = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=utc_now)


class MisconceptionCluster(Base):
    __tablename__ = "misconception_clusters"

    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String(100), default="Class 10 - Physics")
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)
    misconception_tag = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    affected_student_count = Column(Integer, default=12)
    percentage_affected = Column(Float, default=68.0)
    root_cause = Column(Text, nullable=False)
    recommended_intervention = Column(Text, nullable=False)
    target_resource_id = Column(String(100), default="RES-TELUGU-MICRO-03")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
