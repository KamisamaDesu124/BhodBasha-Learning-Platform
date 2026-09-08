from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.models.intervention import RecommendedResource, Recommendation, InterventionGroup
from backend.app.models.mastery import MisconceptionCluster, CompetencyGap
from backend.app.models.user import User

DEFAULT_CURATED_RESOURCES = [
    {
        "resource_code": "RES-IGOT-AIML-01",
        "title": "iGOT Karmayogi: AI/ML & Big Data Analytics in Official Statistics (MoSPI / NSSTA)",
        "description": "Comprehensive competency module covering machine learning models for survey data imputation, outlier detection, and automated data dissemination.",
        "resource_type": "igot_course",
        "language": "en",
        "duration_minutes": 45,
        "file_path_or_url": "https://igotkarmayogi.gov.in/course/stat-aiml-401",
        "target_misconception": "ai_replaces_survey_design",
        "igot_reference_id": "iGOT-STAT-AIML-401",
        "is_offline_ready": True,
        "size_mb": 12.4
    },
    {
        "resource_code": "RES-TPAC-SAMP-02",
        "title": "NSSTA TPAC Programme: Multi-Stage Stratified Sampling & Survey Calibration (Telugu/English)",
        "description": "Specialized training programme approved by NSSTA TPAC focusing on Horvitz-Thompson estimation, CAPI fieldwork, and non-sampling error control.",
        "resource_type": "tpac_programme",
        "language": "te",
        "duration_minutes": 30,
        "file_path_or_url": "https://nssta.gov.in/tpac/programmes/2026-04",
        "target_misconception": "action_force_greater_than_reaction",
        "igot_reference_id": "NSSTA-TPAC-2026-04",
        "is_offline_ready": True,
        "size_mb": 8.5
    },
    {
        "resource_code": "RES-IGOT-GIS-03",
        "title": "iGOT Karmayogi: Geo-Spatial GIS Integration for MoSPI Field Cadres (Hindi/English)",
        "description": "Practical training on integrating GIS mapping, satellite imagery, and agricultural field survey boundaries on CAPI tablets.",
        "resource_type": "igot_course",
        "language": "hi",
        "duration_minutes": 25,
        "file_path_or_url": "https://igotkarmayogi.gov.in/course/stat-gis-204",
        "target_misconception": "divided_mass_by_accel",
        "igot_reference_id": "iGOT-STAT-GIS-204",
        "is_offline_ready": True,
        "size_mb": 6.2
    },
    {
        "resource_code": "RES-TPAC-NAC-04",
        "title": "NSSTA TPAC: National Accounts Statistics & Implicit GDP Deflator Hands-on Workshop",
        "description": "Hands-on calibration workshop for computing Gross Value Added (GVA), base-year revisions, and deflator methodologies.",
        "resource_type": "tpac_programme",
        "language": "te",
        "duration_minutes": 20,
        "file_path_or_url": "https://nssta.gov.in/tpac/programmes/2026-08",
        "target_misconception": "motion_requires_continuous_force",
        "igot_reference_id": "NSSTA-TPAC-2026-08",
        "is_offline_ready": True,
        "size_mb": 5.0
    },
    {
        "resource_code": "RES-TELUGU-MICRO-03",
        "title": "7-Minute Telugu Micro-Lesson: Survey Sampling Variance & Newton's Principles",
        "description": "Explains foundational analytical principles and calculation formulas with localized Telugu narration.",
        "resource_type": "micro_lesson",
        "language": "te",
        "duration_minutes": 7,
        "file_path_or_url": "media/micro_lessons/sampling_variance_telugu.mp4",
        "target_misconception": "action_force_greater_than_reaction",
        "igot_reference_id": "iGOT-STEM-PHY-10-042",
        "is_offline_ready": True,
        "size_mb": 4.2
    }
]

async def seed_curated_resources_if_empty(db: AsyncSession):
    res_count = await db.execute(select(RecommendedResource))
    if not res_count.scalars().first():
        for r_data in DEFAULT_CURATED_RESOURCES:
            db.add(RecommendedResource(**r_data))
        await db.commit()

async def generate_personalized_recommendations(user_id: int, db: AsyncSession) -> List[Dict[str, Any]]:
    await seed_curated_resources_if_empty(db)
    user_res = await db.execute(select(User).filter(User.id == user_id))
    user = user_res.scalars().first()
    lang = user.preferred_language if user else "te"

    # Find highest gap
    gaps_res = await db.execute(
        select(CompetencyGap).filter(CompetencyGap.user_id == user_id).order_by(CompetencyGap.gap.desc())
    )
    top_gap = gaps_res.scalars().first()

    # Find matching resource in preferred language
    res_query = await db.execute(
        select(RecommendedResource).filter(RecommendedResource.language == lang)
    )
    resources = res_query.scalars().all()
    if not resources:
        all_res = await db.execute(select(RecommendedResource))
        resources = all_res.scalars().all()

    recommendations = []
    for r in resources:
        rec = {
            "resource_id": r.id,
            "resource_code": r.resource_code,
            "title": r.title,
            "description": r.description,
            "resource_type": r.resource_type,
            "language": r.language,
            "duration_minutes": r.duration_minutes,
            "size_mb": r.size_mb,
            "is_offline_ready": r.is_offline_ready,
            "gap_reason": f"Targeted remediation for {top_gap.classification if top_gap else 'Newton’s Laws'} (Gap: {top_gap.gap if top_gap else 38.0}%)",
            "expected_objective": "Master action-reaction dual body interactions and elevate score to >= 80%",
            "confidence": 0.95,
            "igot_metadata": {
                "source": "iGOT Karmayogi STEM Catalog (Local Demo Adapter)",
                "reference_id": r.igot_reference_id
            }
        }
        recommendations.append(rec)
    return recommendations
