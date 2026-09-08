from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.models.asset import Transcript, TranscriptSegment

router = APIRouter(prefix="/api/transcripts", tags=["Transcripts"])

@router.get("/{asset_id}")
async def get_transcript(asset_id: int, language: str = "en", db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Transcript).filter(
            Transcript.asset_id == asset_id,
            Transcript.language == language
        )
    )
    transcript = res.scalars().first()
    if not transcript:
        # Fallback to English transcript
        res = await db.execute(select(Transcript).filter(Transcript.asset_id == asset_id))
        transcript = res.scalars().first()
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found")

    seg_res = await db.execute(
        select(TranscriptSegment).filter(TranscriptSegment.transcript_id == transcript.id).order_by(TranscriptSegment.segment_index)
    )
    segments = seg_res.scalars().all()
    return {
        "id": transcript.id,
        "asset_id": transcript.asset_id,
        "language": transcript.language,
        "full_text": transcript.full_text,
        "segments": [
            {
                "segment_index": s.segment_index,
                "start_time": s.start_time,
                "end_time": s.end_time,
                "text": s.text,
                "speaker": s.speaker,
                "confidence": s.confidence
            }
            for s in segments
        ]
    }
