# BhodBasha-Learning-Platform
1. BhodBasha is a comprehensive, offline-first, domain-calibrated GovTech platform which Emphasizes on the iGOT Karmayogi ecosystem courses and NSSTA for capacity Building of India's Statistical Officers and Officials.

2. Our PWA is structured into four high-impact pillars:
A. Cadre Skill Intelligence & Competency Engine
• Automated Cadre Profiling: Automatically provisions profiles based on designation (SSO, JSO, Director), regional office
(FOD Hyderabad, Kolkata, Delhi, Bengaluru), and current survey assignment (PLFS, ASUSE 2026).
• Diagnostic Gap Analytics: Evaluates officer mastery against an 80% benchmark threshold across core competencies
(Stratified Sampling, Horvitz-Thompson Estimators, CAPI, Macroeconomic Aggregates).
• Curated iGOT & NSSTA Pathways: Recommends specific accredited courses on iGOT Karmayogi and forthcoming
physical/virtual workshops on the official NSSTA TPAC calendar.
B. Multilingual Statistical Learning & Assessment Engine
• Speech-Synchronized Indic Dual Subtitles: Interactive audio player delivering high-density statistical lectures with
synchronized bilingual subtitles (English alongside regional Indic languages like Telugu and Hindi).
• Interactive Statistical Formula Glossary: Mathematical formulations (Horvitz-Thompson estimator, Deflator identities)
with localized contextual definitions.
• Confidence-Calibrated Assessments: Checkpoint evaluations capture officer confidence ratings (High / Medium / Low)
alongside answers, identifying lucky guesses versus authentic mastery.
C. Zero Data-Cost Offline PWA (Edge Persistence)
• IndexedDB Local Package Caching: Compressed <15MB modules contain audio, WebVTT tracks, glossaries, and quiz
items for 100% offline study during rural field visits.
• Idempotent Background Sync: Offline quiz attempts are stored with client-side UUID idempotency keys and
automatically reconcile with central servers upon reconnecting.
D. NSSTA Directorate Supervisory Console
• Regional Cadre Heatmap: Real-time competency tracking across FOD regional directorates.
• Cadre Misconception Detection: Automatically clusters systemic errors (e.g. flagging that 72% of officers confused the
Implicit GDP Deflator with CPI).
• 1-Click Remediation Dispatch: Enables directors to dispatch targeted 15-minute micro-learning modules to flagged
officers with a single click.


3. Technology Stack & Technical Justification
Layer Technologies Used Technical Justification
Frontend Framework Next.js 15 (React 19, TypeScript) Server-side rendering, edge routing, strict type-safety, and
native PWA Service Worker lifecycle management.
Styling & UX Tailwind CSS + Academic Heritage
Theme
High-performance utilities, zero flash of unstyled content,
responsive design for rugged field tablets, WCAG AAA contrast.
Offline Edge Storage Dexie.js (IndexedDB wrapper) High-throughput browser storage that holds multi-megabyte
audio packages, transcripts, and sync queues without eviction.
Identity & Auth Supabase Auth + JWT Enterprise cloud identity with role-based access control (RBAC)
separating Cadre Learners from NSSTA Supervisors.
Backend API Python FastAPI (Async) High concurrency, asynchronous REST endpoints, native
OpenAPI/Swagger auto-docs, and direct Python ML/AI runtime.
Database ORM SQLAlchemy 2.0 (Async) + PostgreSQL ACID compliance, relational integrity for user profiles,
competency vectors, audit events, and easy GovCloud

4. Machine Learning & AI Models Used
• Indic-Whisper & Conformer ASR: Automatic speech-to-text transcription calibrated for Indian English accents and
code-switched statistical lectures.
• IndicTrans2 & NLLB-200 (Neural Machine Translation): High-fidelity translation into scheduled Indian languages
(Telugu, Hindi, etc.) with protected terminology guarding statistical formulas from broken literal translation.
• Semantic Sentence Embeddings (IndicBERT / all-MiniLM-L6-v2): Vector semantic indexing over MoSPI survey
manuals and NSSTA question banks to power curriculum recommendations.
• HDBSCAN / K-Means Misconception Clustering: Unsupervised clustering on incorrect answer vectors to discover
shared conceptual root-causes across cadre cohorts.
• Item Response Theory (IRT - 2PL Model): Calibrates officer latent ability scores against question difficulty and
discrimination parameters rather than basic percentage sums.


5. Architecture & Operational Framework
BhodBasha implements a 4-Tier Edge-First Cloud Architecture designed to maintain zero downtime even in
zero-connectivity field assignments:
1. Edge Presentation Layer (PWA): Next.js 15 client running in mobile/tablet browsers with Service Worker cache and
local IndexedDB.
2. Identity & Security Layer: Supabase Auth with JWT bearer tokens and Role-Based Access Control enforcing MoSPI
cadre separation.
3. Application & Intelligence Layer: Asynchronous FastAPI gateway running the 19-stage AI ingestion pipeline,
competency assessment, and clustering engines.
4. Data Persistence & Integrations: PostgreSQL database storing user matrices and audit logs, cloud storage for
curriculum media, and iGOT Karmayogi API synchronizer.


