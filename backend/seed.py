import asyncio
import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.future import select
from backend.app.core.database import AsyncSessionLocal, init_db
from backend.app.core.security import get_password_hash
from backend.app.models.user import User, StudentProfile, TeacherProfile, ConsentRecord, AuditEvent
from backend.app.models.asset import LearningAsset, JobStatus
from backend.app.services.ingestion import run_asset_ingestion_pipeline
from backend.app.services.recommendation_service import seed_curated_resources_if_empty
from backend.app.models.mastery import MisconceptionCluster, MasteryScore, UserCompetencyEvidence, CompetencyGap
from backend.app.models.curriculum import Competency

async def seed_database():
    print("[1/5] Initializing Database schema...")
    await init_db()

    async with AsyncSessionLocal() as db:
        print("[2/5] Seeding Users (Student, Teacher, Admin, and Class Roster)...")
        
        # 1. Admin
        # 1. Admin
        admin_res = await db.execute(select(User).filter(User.email == "admin@bhodbasha.edu"))
        if not admin_res.scalars().first():
            admin = User(
                email="admin@bhodbasha.edu",
                hashed_password=get_password_hash("admin123"),
                full_name="Dr. P. Radhakrishnan (ADG, MoSPI & NSSTA)",
                role="admin",
                preferred_language="en"
            )
            db.add(admin)

        # 2. Teacher / NSSTA Training Director
        teacher_res = await db.execute(select(User).filter(User.email == "teacher@bhodbasha.edu"))
        teacher = teacher_res.scalars().first()
        if not teacher:
            teacher = User(
                email="teacher@bhodbasha.edu",
                hashed_password=get_password_hash("physics123"),
                full_name="Dr. Ananya Rao (Director, NSSTA)",
                role="teacher",
                preferred_language="en"
            )
            db.add(teacher)
            await db.commit()
            await db.refresh(teacher)
            db.add(TeacherProfile(
                user_id=teacher.id,
                subject="Official Statistics, Sampling & AI/ML",
                department="National Statistical Systems Training Academy (NSSTA)",
                assigned_classes=["MoSPI Statistical Cadre - Batch 2026", "FOD Survey Supervisors"]
            ))

        # 3. Main Statistical Official (Learner)
        student_res = await db.execute(select(User).filter(User.email == "student@bhodbasha.edu"))
        student = student_res.scalars().first()
        if not student:
            student = User(
                email="student@bhodbasha.edu",
                hashed_password=get_password_hash("student123"),
                full_name="Sunil Sharma (Senior Statistical Officer)",
                role="student",
                preferred_language="te"
            )
            db.add(student)
            await db.commit()
            await db.refresh(student)
            db.add(StudentProfile(
                user_id=student.id,
                grade="Senior Statistical Officer",
                school_name="Field Operations Division (FOD), MoSPI - Hyderabad RO",
                designation="Senior Statistical Officer (SSO)",
                department="Field Operations Division (FOD), MoSPI",
                job_role="Survey Supervision & Statistical Data Quality",
                current_assignment="Periodic Labour Force Survey (PLFS) & ASUSE",
                qualifications="M.Sc. Statistics / Econometrics",
                work_experience_years=7,
                previous_trainings=["Basic Survey Sampling (NSSTA 2022)", "CAPI Tablet Operations"]
            ))
            db.add(ConsentRecord(user_id=student.id, consent_type="offline_data_sync", granted=True))

        # 4. 23 additional cohort officials for cadre analytics
        for i in range(1, 24):
            email = f"student{i}@bhodbasha.edu"
            st_check = await db.execute(select(User).filter(User.email == email))
            if not st_check.scalars().first():
                st = User(
                    email=email,
                    hashed_password=get_password_hash("student123"),
                    full_name=f"Statistical Officer {i:02d}",
                    role="student",
                    preferred_language="te" if i % 2 == 0 else "hi"
                )
                db.add(st)
                await db.commit()
                await db.refresh(st)
                db.add(StudentProfile(
                    user_id=st.id,
                    grade="Junior Statistical Officer",
                    school_name="MoSPI Regional Cadre",
                    designation="Junior Statistical Officer (JSO)",
                    department="Field Operations Division (FOD), MoSPI"
                ))

        await db.commit()

        print("[3/5] Seeding Newton's Laws Ingested Learning Asset...")
        asset_res = await db.execute(select(LearningAsset).filter(LearningAsset.title == "Introduction to Newton's Laws of Motion"))
        asset = asset_res.scalars().first()
        if not asset:
            asset = LearningAsset(
                title="Introduction to Newton's Laws of Motion",
                description="Comprehensive STEM lecture exploring Inertia, Momentum, and Action-Reaction interaction force pairs.",
                subject="Physics",
                grade="Grade 10",
                source_type="video/mp4",
                original_file_path="newtons_laws_demo.mp4",
                duration_seconds=105.0,
                status=JobStatus.PENDING.value,
                is_published=True,
                package_size_mb=14.2
            )
            db.add(asset)
            await db.commit()
            await db.refresh(asset)

            # Run full ingestion pipeline to generate transcripts, WebVTT subtitles, concepts, and questions
            print("     Running 19-stage localization pipeline for Newton's Laws...")
            await run_asset_ingestion_pipeline(asset.id, db)

        print("[4/5] Seeding Curated Resources and Misconception Clusters...")
        await seed_curated_resources_if_empty(db)

        # Misconception Clusters
        misc_res = await db.execute(select(MisconceptionCluster))
        if not misc_res.scalars().first():
            db.add(MisconceptionCluster(
                class_name="MoSPI Statistical Cadre - Batch 2026",
                concept_id=1,
                misconception_tag="deflator_basket_confusion",
                title="Implicit GDP Deflator vs Consumer Price Index (CPI)",
                description="72% of statistical officers confuse CPI fixed consumer basket index with broad-based domestic production implicit GDP deflator.",
                affected_student_count=17,
                percentage_affected=72.0,
                root_cause="Conceptual conflation between fixed-weight Laspeyres index (CPI) and Paasche-type current weight deflator (GDP deflator) in National Accounts.",
                recommended_intervention="Assign NSSTA TPAC Programme: Multi-Stage Stratified Sampling & Survey Calibration (Telugu/English).",
                target_resource_id="RES-TPAC-SAMP-02"
            ))
            db.add(MisconceptionCluster(
                class_name="Class 10 - Physics",
                concept_id=1,
                misconception_tag="action_force_greater_than_reaction",
                title="Action-Reaction Forces on Same Object",
                description="68% of class struggles with Third Law interaction pairs, believing action cancels reaction on the same body.",
                affected_student_count=12,
                percentage_affected=68.0,
                root_cause="Intuitive belief that motion requires an unbalanced force on a single body leads to confusion regarding dual-body force interaction pairs.",
                recommended_intervention="Assign 7-Minute Telugu Micro-Lesson on Rocket Propulsion.",
                target_resource_id="RES-TELUGU-MICRO-03"
            ))
            await db.commit()

        print("[5/5] Seed completed successfully! All demo datasets ready.")

if __name__ == "__main__":
    asyncio.run(seed_database())
