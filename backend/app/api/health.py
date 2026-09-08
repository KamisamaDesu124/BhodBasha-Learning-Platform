from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "tagline": settings.APP_TAGLINE,
        "environment": settings.BHODBASHA_ENV,
        "mock_providers": settings.MOCK_PROVIDERS,
        "version": "1.0.0"
    }
