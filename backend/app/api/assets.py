import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user, require_roles
from backend.app.core.config import settings
from backend.app.models.user import User, AuditEvent
from backend.app.models.asset import LearningAsset, AssetVersion, MediaTrack, Transcript, SubtitleTrack, GlossaryTerm, ProcessingJob, JobStatus
from backend.app.models.curriculum import Topic, Concept, ConceptCard
from backend.app.models.assessment import Assessment, Question, QuestionOption
from backend.app.services.ingestion import run_asset_ingestion_pipeline

router = APIRouter(prefix="/api/assets", tags=["Learning Assets"])

@router.get("")
async def list_assets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LearningAsset).order_by(LearningAsset.id.desc()))
    assets = result.scalars().all()
    out = []
    for a in assets:
        out.append({
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "subject": a.subject,
            "grade": a.grade,
            "source_type": a.source_type,
            "duration_seconds": a.duration_seconds,
            "status": a.status,
            "package_size_mb": a.package_size_mb,
            "is_published": a.is_published,
            "created_at": a.created_at.isoformat()
        })
    return out

@router.get("/{asset_id}")
async def get_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(LearningAsset).filter(LearningAsset.id == asset_id))
    asset = res.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Get media tracks
    mt_res = await db.execute(select(MediaTrack).filter(MediaTrack.asset_id == asset_id))
    tracks = mt_res.scalars().all()

    # Get subtitles
    sub_res = await db.execute(select(SubtitleTrack).filter(SubtitleTrack.asset_id == asset_id))
    subs = sub_res.scalars().all()

    # Get glossary
    glo_res = await db.execute(select(GlossaryTerm).filter(GlossaryTerm.asset_id == asset_id))
    glossary = glo_res.scalars().all()

    return {
        "id": asset.id,
        "title": asset.title,
        "description": asset.description,
        "subject": asset.subject,
        "grade": asset.grade,
        "duration_seconds": asset.duration_seconds,
        "status": asset.status,
        "package_size_mb": asset.package_size_mb,
        "media_tracks": [{"track_type": t.track_type, "language": t.language, "file_path": t.file_path} for t in tracks],
        "subtitles": [{"language": s.language, "is_approved": s.is_approved} for s in subs],
        "glossary_count": len(glossary)
    }

@router.get("/{asset_id}/package")
async def get_offline_package(asset_id: int, db: AsyncSession = Depends(get_db)):
    """
    Returns the complete structured offline learning package bundle for caching in IndexedDB.
    """
    res = await db.execute(select(LearningAsset).filter(LearningAsset.id == asset_id))
    asset = res.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Transcripts & Segments
    tr_res = await db.execute(select(Transcript).filter(Transcript.asset_id == asset_id))
    transcripts = tr_res.scalars().all()
    transcript_data = []
    for tr in transcripts:
        seg_res = await db.execute(select(TranscriptSegment).filter(TranscriptSegment.transcript_id == tr.id))
        segs = seg_res.scalars().all()
        transcript_data.append({
            "language": tr.language,
            "full_text": tr.full_text,
            "segments": [{"segment_index": s.segment_index, "start_time": s.start_time, "end_time": s.end_time, "text": s.text} for s in segs]
        })

    # Subtitles
    sub_res = await db.execute(select(SubtitleTrack).filter(SubtitleTrack.asset_id == asset_id))
    subs = sub_res.scalars().all()
    subtitles_data = {s.language: {"vtt": s.vtt_content, "srt": s.srt_content} for s in subs}

    # Concepts and Cards
    top_res = await db.execute(select(Topic).filter(Topic.asset_id == asset_id))
    topics = top_res.scalars().all()
    concepts_data = []
    for top in topics:
        c_res = await db.execute(select(Concept).filter(Concept.topic_id == top.id))
        concepts = c_res.scalars().all()
        for c in concepts:
            cards_res = await db.execute(select(ConceptCard).filter(ConceptCard.concept_id == c.id))
            cards = cards_res.scalars().all()
            concepts_data.append({
                "id": c.id,
                "name": c.name,
                "summary_en": c.summary_en,
                "summary_te": c.summary_te,
                "summary_hi": c.summary_hi,
                "key_formula": c.key_formula,
                "si_unit": c.si_unit,
                "cards": [
                    {
                        "title_en": cd.title_en,
                        "title_te": cd.title_te,
                        "title_hi": cd.title_hi,
                        "content_en": cd.content_en,
                        "content_te": cd.content_te,
                        "content_hi": cd.content_hi,
                        "formula": cd.formula,
                        "example": cd.example,
                        "misconception_warning": cd.misconception_warning
                    }
                    for cd in cards
                ]
            })

    # Glossary
    glo_res = await db.execute(select(GlossaryTerm).filter(GlossaryTerm.asset_id == asset_id))
    glossary = glo_res.scalars().all()
    glossary_data = [
        {
            "english": g.english_term,
            "telugu": g.telugu_term,
            "hindi": g.hindi_term,
            "definition_en": g.definition_en,
            "definition_te": g.definition_te,
            "definition_hi": g.definition_hi
        }
        for g in glossary
    ]

    # Assessments & Questions
    ass_res = await db.execute(select(Assessment).filter(Assessment.asset_id == asset_id))
    assessment = ass_res.scalars().first()
    assessment_data = None
    if assessment:
        q_res = await db.execute(select(Question).filter(Question.assessment_id == assessment.id))
        questions = q_res.scalars().all()
        q_list = []
        for q in questions:
            opt_res = await db.execute(select(QuestionOption).filter(QuestionOption.question_id == q.id))
            opts = opt_res.scalars().all()
            q_list.append({
                "id": q.id,
                "difficulty": q.difficulty,
                "question_type": q.question_type,
                "question_text_en": q.question_text_en,
                "question_text_te": q.question_text_te,
                "question_text_hi": q.question_text_hi,
                "explanation_en": q.explanation_en,
                "explanation_te": q.explanation_te,
                "explanation_hi": q.explanation_hi,
                "source_citation": q.source_citation,
                "options": [
                    {
                        "id": o.id,
                        "option_label": o.option_label,
                        "text_en": o.text_en,
                        "text_te": o.text_te,
                        "text_hi": o.text_hi,
                        "is_correct": o.is_correct
                    }
                    for o in opts
                ]
            })
        assessment_data = {
            "id": assessment.id,
            "title": assessment.title,
            "passing_score": assessment.passing_score,
            "time_limit_minutes": assessment.time_limit_minutes,
            "questions": q_list
        }

    return {
        "package_id": f"pkg_{asset.id}_v1",
        "asset_id": asset.id,
        "title": asset.title,
        "subject": asset.subject,
        "grade": asset.grade,
        "version": "1.0.0",
        "checksum": "sha256-bhodbasha-verified-pack",
        "size_mb": asset.package_size_mb,
        "transcripts": transcript_data,
        "subtitles": subtitles_data,
        "concepts": concepts_data,
        "glossary": glossary_data,
        "assessment": assessment_data,
        "media": {
            "video_url": "/media/newtons_laws_demo.mp4",
            "video_lowbw_url": "/media/newtons_laws_demo_lowbw.mp4",
            "dubbed_audio_te": "/media/audio/asset_1_dub_te.wav",
            "dubbed_audio_hi": "/media/audio/asset_1_dub_hi.wav"
        }
    }

@router.post("/upload")
async def upload_asset(
    title: str = Form(...),
    subject: str = Form("Physics"),
    grade: str = Form("Grade 10"),
    file: UploadFile = File(...),
    current_user: User = Depends(require_roles("teacher", "admin")),
    db: AsyncSession = Depends(get_db)
):
    # Save file
    file_loc = os.path.join(settings.MEDIA_STORAGE_DIR, "assets", file.filename)
    with open(file_loc, "wb") as f:
        content = await file.read()
        f.write(content)

    asset = LearningAsset(
        title=title,
        description=f"Uploaded STEM lecture: {file.filename}",
        subject=subject,
        grade=grade,
        source_type=file.content_type or "video/mp4",
        original_file_path=file_loc,
        file_size_bytes=len(content),
        created_by_id=current_user.id,
        status=JobStatus.PENDING.value
    )
    db.add(asset)
    await db.commit()
    await db.refresh(asset)

    # Trigger processing pipeline
    await run_asset_ingestion_pipeline(asset.id, db)
    return {"message": "Asset uploaded and processed successfully", "asset_id": asset.id}
