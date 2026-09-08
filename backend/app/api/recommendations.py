from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.services.recommendation_service import generate_personalized_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["Personalized Recommendations"])

@router.get("/my")
async def get_my_recommendations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    recs = await generate_personalized_recommendations(current_user.id, db)
    return recs
