from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from backend.app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    VALIDATING = "validating"
    EXTRACTING = "extracting"
    TRANSCRIBING = "transcribing"
    ANALYZING = "analyzing"
    TRANSLATING = "translating"
    GENERATING_SUBTITLES = "generating_subtitles"
    GENERATING_AUDIO = "generating_audio"
    GENERATING_ASSESSMENT = "generating_assessment"
    REVIEW_REQUIRED = "review_required"
    READY = "ready"
    FAILED = "failed"

class LearningAsset(Base):
    __tablename__ = "learning_assets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), default="Physics")
    grade = Column(String(50), default="Grade 10")
    source_type = Column(String(50), default="video/mp4")  # mp4, mp3, pdf, docx, pptx
    original_file_path = Column(String(500), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    duration_seconds = Column(Float, default=0.0)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default=JobStatus.READY.value)
    is_published = Column(Boolean, default=True)
    package_size_mb = Column(Float, default=14.2)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    versions = relationship("AssetVersion", back_populates="asset", cascade="all, delete-orphan")
    media_tracks = relationship("MediaTrack", back_populates="asset", cascade="all, delete-orphan")
    transcripts = relationship("Transcript", back_populates="asset", cascade="all, delete-orphan")
    subtitle_tracks = relationship("SubtitleTrack", back_populates="asset", cascade="all, delete-orphan")
    translations = relationship("Translation", back_populates="asset", cascade="all, delete-orphan")
    glossary_terms = relationship("GlossaryTerm", back_populates="asset", cascade="all, delete-orphan")
    processing_jobs = relationship("ProcessingJob", back_populates="asset", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="asset", cascade="all, delete-orphan")
    topics = relationship("Topic", back_populates="asset", cascade="all, delete-orphan")


class AssetVersion(Base):
    __tablename__ = "asset_versions"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    version_number = Column(String(50), default="1.0.0")
    checksum = Column(String(64), nullable=True)
    manifest_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="versions")


class MediaTrack(Base):
    __tablename__ = "media_tracks"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    track_type = Column(String(50), nullable=False)  # "video_original", "video_compressed_lowbw", "audio_original", "audio_dub_te", "audio_dub_hi"
    language = Column(String(10), default="en")
    file_path = Column(String(500), nullable=False)
    bitrate_kbps = Column(Integer, default=500)
    mime_type = Column(String(100), default="video/mp4")
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="media_tracks")


class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    language = Column(String(10), default="en")
    provider = Column(String(50), default="Whisper")
    model = Column(String(50), default="whisper-base-en")
    full_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="transcripts")
    segments = relationship("TranscriptSegment", back_populates="transcript", cascade="all, delete-orphan")


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"), nullable=False)
    segment_index = Column(Integer, nullable=False)
    start_time = Column(Float, nullable=False)  # seconds
    end_time = Column(Float, nullable=False)    # seconds
    text = Column(Text, nullable=False)
    speaker = Column(String(50), default="Teacher")
    confidence = Column(Float, default=0.95)

    transcript = relationship("Transcript", back_populates="segments")


class SubtitleTrack(Base):
    __tablename__ = "subtitle_tracks"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    language = Column(String(10), nullable=False)  # "en", "te", "hi"
    vtt_content = Column(Text, nullable=False)
    srt_content = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=True)
    reviewed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="subtitle_tracks")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    target_language = Column(String(10), nullable=False)  # "te", "hi"
    source_segment_id = Column(Integer, nullable=False)
    translated_text = Column(Text, nullable=False)
    locked_terms = Column(JSON, default=list)  # list of terms locked like "acceleration (త్వరణం)", "F=ma"
    confidence = Column(Float, default=0.92)
    is_reviewed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="translations")


class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    english_term = Column(String(150), nullable=False)
    telugu_term = Column(String(150), nullable=False)
    hindi_term = Column(String(150), nullable=False)
    definition_en = Column(Text, nullable=True)
    definition_te = Column(Text, nullable=True)
    definition_hi = Column(Text, nullable=True)
    category = Column(String(50), default="Physics Terminology")  # formula, unit, term, symbol
    created_at = Column(DateTime, default=utc_now)

    asset = relationship("LearningAsset", back_populates="glossary_terms")


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("learning_assets.id"), nullable=False)
    current_stage = Column(String(50), default=JobStatus.PENDING.value)
    progress_percentage = Column(Integer, default=0)
    provider = Column(String(50), default="BhodBasha Mock AI Provider")
    model = Column(String(50), default="bhodbasha-v1-stem")
    version = Column(String(50), default="1.0.0")
    retry_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    asset = relationship("LearningAsset", back_populates="processing_jobs")
    errors = relationship("ProcessingError", back_populates="job", cascade="all, delete-orphan")


class ProcessingError(Base):
    __tablename__ = "processing_errors"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("processing_jobs.id"), nullable=False)
    stage = Column(String(50), nullable=False)
    error_code = Column(String(50), default="PIPELINE_ERROR")
    error_message = Column(Text, nullable=False)
    stack_trace = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=utc_now)

    job = relationship("ProcessingJob", back_populates="errors")
