from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class RecommendedResource(Base):
    __tablename__ = "recommended_resources"

    id = Column(Integer, primary_key=True, index=True)
    resource_code = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    resource_type = Column(String(50), default="micro_lesson")  # micro_lesson, interactive_sim, concept_card, video
    language = Column(String(10), default="te")  # te, hi, en
    duration_minutes = Column(Integer, default=7)
    file_path_or_url = Column(String(500), nullable=False)
    target_misconception = Column(String(255), nullable=True)
    igot_reference_id = Column(String(100), nullable=True)  # iGOT Karmayogi reference or local demo
    is_offline_ready = Column(Boolean, default=True)
    size_mb = Column(Float, default=4.5)
    created_at = Column(DateTime, default=utc_now)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    group_id = Column(Integer, nullable=True)
    resource_id = Column(Integer, ForeignKey("recommended_resources.id"), nullable=False)
    gap_reason = Column(Text, nullable=False)
    expected_objective = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)
    status = Column(String(50), default="pending")  # pending, assigned, completed
    assigned_at = Column(DateTime, default=utc_now)

    resource = relationship("RecommendedResource")


class InterventionGroup(Base):
    __tablename__ = "intervention_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=True)
    target_misconception = Column(String(255), nullable=True)
    assigned_resource_id = Column(Integer, ForeignKey("recommended_resources.id"), nullable=True)
    student_ids = Column(JSON, default=list)  # list of user IDs
    status = Column(String(50), default="active")  # active, completed, reassessed
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    assigned_resource = relationship("RecommendedResource")


class ReassessmentComparison(Base):
    __tablename__ = "reassessment_comparisons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.id"), nullable=False)
    initial_attempt_id = Column(Integer, nullable=False)
    reassessment_attempt_id = Column(Integer, nullable=False)
    initial_mastery = Column(Float, default=42.0)
    reassessment_mastery = Column(Float, default=76.0)
    improvement_percentage = Column(Float, default=34.0)
    misconception_resolved = Column(Boolean, default=True)
    student_summary = Column(Text, nullable=False)
    teacher_summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)
