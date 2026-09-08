from fastapi import APIRouter, Depends
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.models.intervention import RecommendedResource
from backend.app.services.recommendation_service import seed_curated_resources_if_empty

router = APIRouter(prefix="/api/resources", tags=["Curated & iGOT Resources"])

@router.get("")
async def list_resources(language: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    await seed_curated_resources_if_empty(db)
    query = select(RecommendedResource)
    if language:
        query = query.filter(RecommendedResource.language == language)
    res = await db.execute(query)
    resources = res.scalars().all()
    return [
        {
            "id": r.id,
            "resource_code": r.resource_code,
            "title": r.title,
            "description": r.description,
            "resource_type": r.resource_type,
            "language": r.language,
            "duration_minutes": r.duration_minutes,
            "file_path_or_url": r.file_path_or_url,
            "target_misconception": r.target_misconception,
            "igot_reference_id": r.igot_reference_id,
            "is_offline_ready": r.is_offline_ready,
            "size_mb": r.size_mb
        }
        for r in resources
    ]
