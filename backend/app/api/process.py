from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.models.asset import ProcessingJob, LearningAsset
from backend.app.services.ingestion import run_asset_ingestion_pipeline

router = APIRouter(prefix="/api/process", tags=["Processing Pipeline"])

@router.get("/{asset_id}/status")
async def get_processing_status(asset_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ProcessingJob).filter(ProcessingJob.asset_id == asset_id))
    job = res.scalars().first()
    if not job:
        return {
            "asset_id": asset_id,
            "current_stage": "ready",
            "progress_percentage": 100,
            "provider": "BhodBasha Mock AI Provider",
            "model": "bhodbasha-v1-stem"
        }
    return {
        "asset_id": job.asset_id,
        "current_stage": job.current_stage,
        "progress_percentage": job.progress_percentage,
        "provider": job.provider,
        "model": job.model,
        "version": job.version,
        "updated_at": job.updated_at.isoformat()
    }

@router.post("/{asset_id}/retry")
async def retry_processing(asset_id: int, db: AsyncSession = Depends(get_db)):
    asset = await run_asset_ingestion_pipeline(asset_id, db)
    return {"message": "Pipeline processing completed", "asset_id": asset.id, "status": asset.status}
