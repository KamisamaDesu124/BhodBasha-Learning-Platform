from fastapi import APIRouter, Depends, HTTPException, Response
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.models.asset import SubtitleTrack

router = APIRouter(prefix="/api/subtitles", tags=["Subtitles"])

@router.get("/{asset_id}/{language}/vtt")
async def get_vtt_subtitle(asset_id: int, language: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(SubtitleTrack).filter(
            SubtitleTrack.asset_id == asset_id,
            SubtitleTrack.language == language
        )
    )
    track = res.scalars().first()
    if not track:
        raise HTTPException(status_code=404, detail="Subtitle track not found")
    return Response(content=track.vtt_content, media_type="text/vtt")

@router.get("/{asset_id}/{language}/srt")
async def get_srt_subtitle(asset_id: int, language: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(SubtitleTrack).filter(
            SubtitleTrack.asset_id == asset_id,
            SubtitleTrack.language == language
        )
    )
    track = res.scalars().first()
    if not track:
        raise HTTPException(status_code=404, detail="Subtitle track not found")
    return Response(content=track.srt_content, media_type="text/plain")
