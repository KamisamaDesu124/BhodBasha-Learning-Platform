from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=1)
    confidence = Column(Float, default=0.95)
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="topics")
    concepts = relationship("Concept", back_populates="topic", cascade="all, delete-orphan")


class Concept(Base):
    __tablename__ = "concepts"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    name = Column(String(200), nullable=False)
    summary_en = Column(Text, nullable=False)
    summary_te = Column(Text, nullable=True)
    summary_hi = Column(Text, nullable=True)
    key_formula = Column(String(255), nullable=True)  # e.g., "F = m * a", "F_AB = -F_BA"
    si_unit = Column(String(100), nullable=True)     # e.g., "Newton (N) or kg·m/s²"
    source_chunk_ref = Column(String(255), nullable=True)
    confidence = Column(Float, default=0.94)
    teacher_reviewed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    topic = relationship("Topic", back_populates="concepts")
    competency_maps = relationship("ConceptCompetencyMap", back_populates="concept", cascade="all, delete-orphan")
    cards = relationship("ConceptCard", back_populates="concept", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="concept")


class Competency(Base):
    __tablename__ = "competencies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "PHY-NEWTON-01"
    name = Column(String(255), nullable=False)
    subject = Column(String(100), default="Physics")
    grade = Column(String(50), default="Grade 10")
    description = Column(Text, nullable=True)
    benchmark_mastery = Column(Float, default=80.0)  # Required mastery threshold (0-100)
    created_at = Column(DateTime, default=utc_now)

    skills = relationship("Skill", back_populates="competency", cascade="all, delete-orphan")
    concept_maps = relationship("ConceptCompetencyMap", back_populates="competency", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="competency")
    evidences = relationship("UserCompetencyEvidence", back_populates="competency", cascade="all, delete-orphan")
    mastery_scores = relationship("MasteryScore", back_populates="competency", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    competency_id = Column(Integer, ForeignKey("competencies.id"), nullable=False)
    code = Column(String(50), index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    competency = relationship("Competency", back_populates="skills")


class ConceptCompetencyMap(Base):
    __tablename__ = "concept_competency_maps"

    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.id"), nullable=False)
    weight = Column(Float, default=1.0)

    concept = relationship("Concept", back_populates="competency_maps")
    competency = relationship("Competency", back_populates="concept_maps")


class ConceptCard(Base):
    __tablename__ = "concept_cards"

    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=False)
    title_en = Column(String(255), nullable=False)
    title_te = Column(String(255), nullable=False)
    title_hi = Column(String(255), nullable=False)
    content_en = Column(Text, nullable=False)
    content_te = Column(Text, nullable=False)
    content_hi = Column(Text, nullable=False)
    formula = Column(String(255), nullable=True)
    example = Column(Text, nullable=True)
    misconception_warning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    concept = relationship("Concept", back_populates="cards")
