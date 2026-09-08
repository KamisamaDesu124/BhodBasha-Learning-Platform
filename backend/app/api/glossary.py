from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.core.database import get_db
from backend.app.models.asset import GlossaryTerm

router = APIRouter(prefix="/api/glossary", tags=["Glossary"])

@router.get("")
async def get_glossary(asset_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = select(GlossaryTerm)
    if asset_id:
        query = query.filter(GlossaryTerm.asset_id == asset_id)
    result = await db.execute(query)
    terms = result.scalars().all()
    return [
        {
            "id": t.id,
            "asset_id": t.asset_id,
            "english_term": t.english_term,
            "telugu_term": t.telugu_term,
            "hindi_term": t.hindi_term,
            "definition_en": t.definition_en,
            "definition_te": t.definition_te,
            "definition_hi": t.definition_hi,
            "category": t.category
        }
        for t in terms
    ]
