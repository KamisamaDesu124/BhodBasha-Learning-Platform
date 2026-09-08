from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.services.gap_detector import evaluate_student_gaps

router = APIRouter(prefix="/api/gaps", tags=["Competency Gaps"])

@router.get("/my")
async def get_my_gaps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    gaps = await evaluate_student_gaps(current_user.id, db)
    return gaps
