from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    title = Column(String(255), nullable=False)
    assessment_type = Column(String(50), default="formative")  # formative, diagnostic, reassessment
    is_published = Column(Boolean, default=True)
    passing_score = Column(Float, default=70.0)
    time_limit_minutes = Column(Integer, default=15)
    generation_provider = Column(String(50), default="BhodBasha STEM RAG Engine")
    generation_model = Column(String(50), default="bhodbasha-v1-rag")
    review_status = Column(String(50), default="approved")  # draft, review_required, approved
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="assessments")
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    attempts = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=True)
    competency_id = Column(Integer, ForeignKey("competencies.id"), nullable=True)
    question_type = Column(String(50), default="concept_mcq")  # concept_mcq, numerical_mcq, scenario_mcq, true_false
    difficulty = Column(String(20), default="medium")  # easy (weight 1.0), medium (weight 1.5), hard (weight 2.0)
    language = Column(String(10), default="en")

    question_text_en = Column(Text, nullable=False)
    question_text_te = Column(Text, nullable=True)
    question_text_hi = Column(Text, nullable=True)

    explanation_en = Column(Text, nullable=False)
    explanation_te = Column(Text, nullable=True)
    explanation_hi = Column(Text, nullable=True)

    source_chunk_id = Column(String(100), nullable=True)
    source_citation = Column(Text, nullable=True)  # e.g., "Timestamp [04:12 - 05:30] in Lecture Segment 4"
    confidence = Column(Float, default=0.96)
    review_status = Column(String(50), default="approved")
    created_at = Column(DateTime, default=utc_now)

    assessment = relationship("Assessment", back_populates="questions")
    concept = relationship("Concept", back_populates="questions")
    competency = relationship("Competency", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
    answers = relationship("AttemptAnswer", back_populates="question")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    option_label = Column(String(10), nullable=False)  # A, B, C, D
    text_en = Column(Text, nullable=False)
    text_te = Column(Text, nullable=True)
    text_hi = Column(Text, nullable=True)
    is_correct = Column(Boolean, default=False)
    misconception_tag = Column(String(255), nullable=True)  # e.g. "confuses_action_reaction_same_body"

    question = relationship("Question", back_populates="options")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(Integer, primary_key=True, index=True)
    client_attempt_id = Column(String(100), unique=True, index=True, nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_offline = Column(Boolean, default=False)
    language_used = Column(String(10), default="te")
    score_percentage = Column(Float, default=0.0)
    ai_estimated_mastery = Column(Float, default=0.0)
    total_time_seconds = Column(Integer, default=0)
    sync_status = Column(String(50), default="synced")  # waiting_to_sync, synced, sync_failed
    synced_at = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)

    assessment = relationship("Assessment", back_populates="attempts")
    answers = relationship("AttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")


class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("assessment_attempts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_option_id = Column(Integer, ForeignKey("question_options.id"), nullable=True)
    is_correct = Column(Boolean, default=False)
    student_confidence = Column(String(20), default="high")  # low, medium, high
    time_spent_seconds = Column(Integer, default=30)
    misconception_detected = Column(String(255), nullable=True)

    attempt = relationship("AssessmentAttempt", back_populates="answers")
    question = relationship("Question", back_populates="answers")
