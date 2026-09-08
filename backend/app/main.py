from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.core.config import settings
from backend.app.core.database import init_db
from backend.app.core.logging import setup_logging, logger

# Import all API routers
from backend.app.api.health import router as health_router
from backend.app.api.auth import router as auth_router
from backend.app.api.users import router as users_router
from backend.app.api.assets import router as assets_router
from backend.app.api.process import router as process_router
from backend.app.api.transcripts import router as transcripts_router
from backend.app.api.translations import router as translations_router
from backend.app.api.subtitles import router as subtitles_router
from backend.app.api.glossary import router as glossary_router
from backend.app.api.knowledge import router as knowledge_router
from backend.app.api.assessments import router as assessments_router
from backend.app.api.attempts import router as attempts_router
from backend.app.api.mastery import router as mastery_router
from backend.app.api.gaps import router as gaps_router
from backend.app.api.recommendations import router as recommendations_router
from backend.app.api.resources import router as resources_router
from backend.app.api.interventions import router as interventions_router
from backend.app.api.sync import router as sync_router
from backend.app.api.analytics import router as analytics_router

setup_logging()

app = FastAPI(
    title="BhodBasha API",
    description="Offline-first Multilingual STEM Learning Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for Next.js PWA client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows localhost, local network, and PWA origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def root():
    return {
        "app_name": "BhodBasha Backend API",
        "status": "online",
        "description": "AI-Enabled Skill Intelligence & Learning Platform for India's Official Statistical System (MoSPI & NSSTA)",
        "docs_url": "/docs",
        "frontend_url": "http://localhost:3000",
        "version": "1.0.0"
    }

# Include all API Routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(assets_router)
app.include_router(process_router)
app.include_router(transcripts_router)
app.include_router(translations_router)
app.include_router(subtitles_router)
app.include_router(glossary_router)
app.include_router(knowledge_router)
app.include_router(assessments_router)
app.include_router(attempts_router)
app.include_router(mastery_router)
app.include_router(gaps_router)
app.include_router(recommendations_router)
app.include_router(resources_router)
app.include_router(interventions_router)
app.include_router(sync_router)
app.include_router(analytics_router)

# Mount static media files for video/audio playback
if os.path.exists(settings.MEDIA_STORAGE_DIR):
    app.mount("/media", StaticFiles(directory=settings.MEDIA_STORAGE_DIR), name="media")

@app.on_event("startup")
async def on_startup():
    logger.info("Initializing BhodBasha Database Schema...")
    await init_db()
    logger.info("BhodBasha Backend Started Successfully.")
