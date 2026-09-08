from backend.app.core.database import Base
from backend.app.models.user import User, StudentProfile, TeacherProfile, ConsentRecord, AuditEvent
from backend.app.models.asset import (
    LearningAsset, AssetVersion, MediaTrack, Transcript, TranscriptSegment,
    SubtitleTrack, Translation, GlossaryTerm, ProcessingJob, ProcessingError, JobStatus
)
from backend.app.models.curriculum import Topic, Concept, Competency, Skill, ConceptCompetencyMap, ConceptCard
from backend.app.models.assessment import Assessment, Question, QuestionOption, AssessmentAttempt, AttemptAnswer
from backend.app.models.mastery import UserCompetencyEvidence, MasteryScore, CompetencyGap, MisconceptionCluster
from backend.app.models.intervention import RecommendedResource, Recommendation, InterventionGroup, ReassessmentComparison

__all__ = [
    "Base",
    "User",
    "StudentProfile",
    "TeacherProfile",
    "ConsentRecord",
    "AuditEvent",
    "LearningAsset",
    "AssetVersion",
    "MediaTrack",
    "Transcript",
    "TranscriptSegment",
    "SubtitleTrack",
    "Translation",
    "GlossaryTerm",
    "ProcessingJob",
    "ProcessingError",
    "JobStatus",
    "Topic",
    "Concept",
    "Competency",
    "Skill",
    "ConceptCompetencyMap",
    "ConceptCard",
    "Assessment",
    "Question",
    "QuestionOption",
    "AssessmentAttempt",
    "AttemptAnswer",
    "UserCompetencyEvidence",
    "MasteryScore",
    "CompetencyGap",
    "MisconceptionCluster",
    "RecommendedResource",
    "Recommendation",
    "InterventionGroup",
    "ReassessmentComparison",
]
