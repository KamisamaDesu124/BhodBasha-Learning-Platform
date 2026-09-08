from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.models.curriculum import Topic, Concept, Competency, ConceptCard

router = APIRouter(prefix="/api/knowledge", tags=["Curriculum Knowledge Graph"])

@router.get("/topics")
async def get_topics(asset_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = select(Topic)
    if asset_id:
        query = query.filter(Topic.asset_id == asset_id)
    result = await db.execute(query)
    topics = result.scalars().all()
    return [{"id": t.id, "name": t.name, "description": t.description, "order_index": t.order_index, "confidence": t.confidence} for t in topics]

@router.get("/concepts")
async def get_concepts(topic_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = select(Concept)
    if topic_id:
        query = query.filter(Concept.topic_id == topic_id)
    result = await db.execute(query)
    concepts = result.scalars().all()
    out = []
    for c in concepts:
        cards_res = await db.execute(select(ConceptCard).filter(ConceptCard.concept_id == c.id))
        cards = cards_res.scalars().all()
        out.append({
            "id": c.id,
            "topic_id": c.topic_id,
            "name": c.name,
            "summary_en": c.summary_en,
            "summary_te": c.summary_te,
            "summary_hi": c.summary_hi,
            "key_formula": c.key_formula,
            "si_unit": c.si_unit,
            "source_chunk_ref": c.source_chunk_ref,
            "confidence": c.confidence,
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
    return out

@router.get("/competencies")
async def get_competencies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Competency))
    comps = result.scalars().all()
    return [{"id": c.id, "code": c.code, "name": c.name, "subject": c.subject, "benchmark_mastery": c.benchmark_mastery, "description": c.description} for c in comps]
