from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    supabase_uid = Column(String(255), unique=True, index=True, nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False)  # student, teacher, admin
    is_active = Column(Boolean, default=True)
    preferred_language = Column(String(50), default="te")  # te (Telugu), hi (Hindi), en (English)
    low_bandwidth_mode = Column(Boolean, default=False)
    accessibility_settings = Column(JSON, default=dict)  # font_size, high_contrast, reduce_motion
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    competency_evidences = relationship("UserCompetencyEvidence", back_populates="user", cascade="all, delete-orphan")
    consent_records = relationship("ConsentRecord", back_populates="user", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    grade = Column(String(50), default="10")
    school_name = Column(String(255), default="Government High School")
    # MoSPI / Official Statistical System attributes
    designation = Column(String(100), default="Senior Statistical Officer")
    department = Column(String(150), default="Field Operations Division (FOD), MoSPI")
    job_role = Column(String(150), default="Survey Supervision & Statistical Data Quality")
    current_assignment = Column(String(200), default="Periodic Labour Force Survey (PLFS) & ASUSE")
    qualifications = Column(String(150), default="M.Sc. Statistics / Econometrics")
    work_experience_years = Column(Integer, default=7)
    previous_trainings = Column(JSON, default=lambda: ["Basic Survey Sampling (NSSTA)", "CAPI Tablet Operations"])
    baseline_level = Column(String(50), default="Standard")
    total_study_time_seconds = Column(Integer, default=0)
    offline_sync_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="student_profile")


class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    subject = Column(String(100), default="Physics & STEM")
    department = Column(String(100), default="Secondary Science")
    assigned_classes = Column(JSON, default=list)  # ["Class 9A", "Class 10B"]
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="teacher_profile")


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    consent_type = Column(String(100), nullable=False)  # "offline_data_sync", "analytics", "terms"
    granted = Column(Boolean, default=True)
    ip_address = Column(String(100), nullable=True)
    user_agent = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="consent_records")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)  # "approve_translation", "assign_intervention", "login"
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="audit_events")
