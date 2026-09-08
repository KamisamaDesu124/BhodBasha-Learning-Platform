from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.services.sync_service import process_offline_attempt_sync

router = APIRouter(prefix="/api/sync", tags=["Offline Sync Engine"])

class SyncBatchRequest(BaseModel):
    client_sync_batch_id: str
    items: List[Dict[str, Any]]

@router.post("/batch")
async def sync_batch(
    req: SyncBatchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Processes an array of offline queued attempts and returns synchronized statuses.
    """
    results = []
    for item in req.items:
        try:
            res = await process_offline_attempt_sync(
                user_id=current_user.id,
                sync_payload=item,
                db=db
            )
            results.append(res)
        except Exception as e:
            results.append({
                "status": "sync_failed",
                "client_attempt_id": item.get("client_attempt_id"),
                "error": str(e)
            })

    return {
        "batch_id": req.client_sync_batch_id,
        "synced_count": sum(1 for r in results if r.get("status") in ["synced", "already_synced"]),
        "failed_count": sum(1 for r in results if r.get("status") == "sync_failed"),
        "items": results
    }
