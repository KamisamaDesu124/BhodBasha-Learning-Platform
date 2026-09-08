import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#57423A"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "BhodBasha — AI Skill Intelligence & Learning Platform | MoSPI & NSSTA")
            self.setStrokeColor(colors.HexColor("#DCD9D9"))
            self.setLineWidth(0.5)
            self.line(54, 742, letter[0] - 54, 742)
            
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#DCD9D9"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "Confidential & Proprietary — Smart India Hackathon 2026 | MoSPI & iGOT Karmayogi")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 32, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=60,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_terracotta = colors.HexColor("#9F3E07")
    c_indigo = colors.HexColor("#2B4C7E")
    c_charcoal = colors.HexColor("#1C1B1B")
    c_muted = colors.HexColor("#57423A")
    c_light_bg = colors.HexColor("#F9F8F7")
    c_border = colors.HexColor("#E2E8F0")

    # Custom Styles
    style_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_terracotta,
        alignment=TA_LEFT,
        spaceAfter=4
    )
    
    style_subtitle = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_indigo,
        alignment=TA_LEFT,
        spaceAfter=14
    )
    
    style_meta_badge = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#894F00"),
    )

    style_h1 = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_terracotta,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    
    style_h2 = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_indigo,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_charcoal,
        alignment=TA_LEFT,
        spaceAfter=6
    )

    style_bullet = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=13,
        textColor=c_charcoal,
        leftIndent=12,
        spaceAfter=3
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_charcoal
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # Title & Header
    story.append(Paragraph("BhodBasha (బోధభాష)", style_title))
    story.append(Paragraph("AI-Enabled Multilingual Skill Intelligence & Offline-First Learning Platform for India's Official Statistical System", style_subtitle))
    
    # Metadata Badge Box
    meta_data = [
        [
            Paragraph("<b>Target Domain:</b> Ministry of Statistics & Programme Implementation (MoSPI) & NSSTA", style_meta_badge),
            Paragraph("<b>Ecosystem:</b> iGOT Karmayogi (DoPT FRAC Aligned)", style_meta_badge),
            Paragraph("<b>Hackathon:</b> Smart India Hackathon 2026", style_meta_badge)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[200, 160, 144])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FEF9EE")),
        ('BORDER', (0, 0), (-1, -1), 0.5, colors.HexColor("#FDE68A")),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # 1. Project Overview & Problem Statement
    story.append(Paragraph("1. Problem Statement & Key Challenges", style_h1))
    story.append(Paragraph(
        "<b>SIH 2026 Focus:</b> Strengthening capacity building, continuous in-service education, and statistical competency for field enumerators, statistical officers, and supervisors across India's Official Statistical System (FOD, SSS, and ISS cadres) by integrating with the <b>iGOT Karmayogi</b> ecosystem.",
        style_body
    ))
    story.append(Paragraph("• <b>Language & Dialect Barriers:</b> Technical manuals (PLFS, ASUSE, National Accounts) are predominantly published in dense academic English, hindering deep comprehension for regional cadre officers across non-Hindi and non-English speaking states.", style_bullet))
    story.append(Paragraph("• <b>Field Connectivity Constraints (Digital Divide):</b> Field surveys are conducted in remote, rural, and tribal zones with zero internet connectivity, rendering cloud-dependent LMS portals non-functional during real-world field deployments.", style_bullet))
    story.append(Paragraph("• <b>Lack of Diagnostic Cadre Intelligence:</b> Training remains transactional (passive video consumption) rather than diagnostic. Training directorates (NSSTA) lack visibility into cadre-wide misconception clusters (e.g. confusion between Implicit GDP Deflator vs. CPI).", style_bullet))
    story.append(Paragraph("• <b>Disconnection from Official Career Frameworks:</b> Learning outcomes are rarely synchronized with MoSPI designations or official Competency Frameworks (FRAC), leaving training without tailored career development pathways.", style_bullet))
    story.append(Spacer(1, 8))

    # 2. Our Solution & Core Features
    story.append(Paragraph("2. Our Solution / Web Application Features", style_h1))
    story.append(Paragraph(
        "<b>BhodBasha</b> is a comprehensive, offline-first, domain-calibrated GovTech platform structured into four high-impact pillars:",
        style_body
    ))
    
    story.append(Paragraph("A. Cadre Skill Intelligence & Competency Engine", style_h2))
    story.append(Paragraph("• <b>Automated Cadre Profiling:</b> Automatically provisions profiles based on designation (SSO, JSO, Director), regional office (FOD Hyderabad, Kolkata, Delhi, Bengaluru), and current survey assignment (PLFS, ASUSE 2026).", style_bullet))
    story.append(Paragraph("• <b>Diagnostic Gap Analytics:</b> Evaluates officer mastery against an 80% benchmark threshold across core competencies (Stratified Sampling, Horvitz-Thompson Estimators, CAPI, Macroeconomic Aggregates).", style_bullet))
    story.append(Paragraph("• <b>Curated iGOT & NSSTA Pathways:</b> Recommends specific accredited courses on iGOT Karmayogi and forthcoming physical/virtual workshops on the official NSSTA TPAC calendar.", style_bullet))

    story.append(Paragraph("B. Multilingual Statistical Learning & Assessment Engine", style_h2))
    story.append(Paragraph("• <b>Speech-Synchronized Indic Dual Subtitles:</b> Interactive audio player delivering high-density statistical lectures with synchronized bilingual subtitles (English alongside regional Indic languages like Telugu and Hindi).", style_bullet))
    story.append(Paragraph("• <b>Interactive Statistical Formula Glossary:</b> Mathematical formulations (Horvitz-Thompson estimator, Deflator identities) with localized contextual definitions.", style_bullet))
    story.append(Paragraph("• <b>Confidence-Calibrated Assessments:</b> Checkpoint evaluations capture officer confidence ratings (High / Medium / Low) alongside answers, identifying lucky guesses versus authentic mastery.", style_bullet))

    story.append(Paragraph("C. Zero Data-Cost Offline PWA (Edge Persistence)", style_h2))
    story.append(Paragraph("• <b>IndexedDB Local Package Caching:</b> Compressed <15MB modules contain audio, WebVTT tracks, glossaries, and quiz items for 100% offline study during rural field visits.", style_bullet))
    story.append(Paragraph("• <b>Idempotent Background Sync:</b> Offline quiz attempts are stored with client-side UUID idempotency keys and automatically reconcile with central servers upon reconnecting.", style_bullet))

    story.append(Paragraph("D. NSSTA Directorate Supervisory Console", style_h2))
    story.append(Paragraph("• <b>Regional Cadre Heatmap:</b> Real-time competency tracking across FOD regional directorates.", style_bullet))
    story.append(Paragraph("• <b>Cadre Misconception Detection:</b> Automatically clusters systemic errors (e.g. flagging that 72% of officers confused the Implicit GDP Deflator with CPI).", style_bullet))
    story.append(Paragraph("• <b>1-Click Remediation Dispatch:</b> Enables directors to dispatch targeted 15-minute micro-learning modules to flagged officers with a single click.", style_bullet))
    story.append(Spacer(1, 8))

    # Page Break for clean layout
    story.append(PageBreak())

    # 3. Technology Stack & Justification
    story.append(Paragraph("3. Technology Stack & Technical Justification", style_h1))
    
    tech_data = [
        [Paragraph("Layer", style_table_header), Paragraph("Technologies Used", style_table_header), Paragraph("Technical Justification", style_table_header)],
        [
            Paragraph("<b>Frontend Framework</b>", style_table_cell),
            Paragraph("Next.js 15 (React 19, TypeScript)", style_table_cell),
            Paragraph("Server-side rendering, edge routing, strict type-safety, and native PWA Service Worker lifecycle management.", style_table_cell)
        ],
        [
            Paragraph("<b>Styling & UX</b>", style_table_cell),
            Paragraph("Tailwind CSS + Academic Heritage Theme", style_table_cell),
            Paragraph("High-performance utilities, zero flash of unstyled content, responsive design for rugged field tablets, WCAG AAA contrast.", style_table_cell)
        ],
        [
            Paragraph("<b>Offline Edge Storage</b>", style_table_cell),
            Paragraph("Dexie.js (IndexedDB wrapper)", style_table_cell),
            Paragraph("High-throughput browser storage that holds multi-megabyte audio packages, transcripts, and sync queues without eviction.", style_table_cell)
        ],
        [
            Paragraph("<b>Identity & Auth</b>", style_table_cell),
            Paragraph("Supabase Auth + JWT", style_table_cell),
            Paragraph("Enterprise cloud identity with role-based access control (RBAC) separating Cadre Learners from NSSTA Supervisors.", style_table_cell)
        ],
        [
            Paragraph("<b>Backend API</b>", style_table_cell),
            Paragraph("Python FastAPI (Async)", style_table_cell),
            Paragraph("High concurrency, asynchronous REST endpoints, native OpenAPI/Swagger auto-docs, and direct Python ML/AI runtime.", style_table_cell)
        ],
        [
            Paragraph("<b>Database ORM</b>", style_table_cell),
            Paragraph("SQLAlchemy 2.0 (Async) + PostgreSQL", style_table_cell),
            Paragraph("ACID compliance, relational integrity for user profiles, competency vectors, audit events, and easy GovCloud migration.", style_table_cell)
        ],
    ]
    t_tech = Table(tech_data, colWidths=[110, 154, 240])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_indigo),
        ('BORDER', (0, 0), (-1, -1), 0.5, c_border),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 10))

    # 4. Machine Learning & AI Models
    story.append(Paragraph("4. Machine Learning & AI Models Used", style_h1))
    story.append(Paragraph("• <b>Indic-Whisper & Conformer ASR:</b> Automatic speech-to-text transcription calibrated for Indian English accents and code-switched statistical lectures.", style_bullet))
    story.append(Paragraph("• <b>IndicTrans2 & NLLB-200 (Neural Machine Translation):</b> High-fidelity translation into scheduled Indian languages (Telugu, Hindi, etc.) with protected terminology guarding statistical formulas from broken literal translation.", style_bullet))
    story.append(Paragraph("• <b>Semantic Sentence Embeddings (IndicBERT / all-MiniLM-L6-v2):</b> Vector semantic indexing over MoSPI survey manuals and NSSTA question banks to power curriculum recommendations.", style_bullet))
    story.append(Paragraph("• <b>HDBSCAN / K-Means Misconception Clustering:</b> Unsupervised clustering on incorrect answer vectors to discover shared conceptual root-causes across cadre cohorts.", style_bullet))
    story.append(Paragraph("• <b>Item Response Theory (IRT - 2PL Model):</b> Calibrates officer latent ability scores against question difficulty and discrimination parameters rather than basic percentage sums.", style_bullet))
    story.append(Spacer(1, 8))

    # 5. Architecture & Framework
    story.append(Paragraph("5. Architecture & Operational Framework", style_h1))
    story.append(Paragraph(
        "BhodBasha implements a <b>4-Tier Edge-First Cloud Architecture</b> designed to maintain zero downtime even in zero-connectivity field assignments:",
        style_body
    ))
    story.append(Paragraph("1. <b>Edge Presentation Layer (PWA):</b> Next.js 15 client running in mobile/tablet browsers with Service Worker cache and local IndexedDB.", style_bullet))
    story.append(Paragraph("2. <b>Identity & Security Layer:</b> Supabase Auth with JWT bearer tokens and Role-Based Access Control enforcing MoSPI cadre separation.", style_bullet))
    story.append(Paragraph("3. <b>Application & Intelligence Layer:</b> Asynchronous FastAPI gateway running the 19-stage AI ingestion pipeline, competency assessment, and clustering engines.", style_bullet))
    story.append(Paragraph("4. <b>Data Persistence & Integrations:</b> PostgreSQL database storing user matrices and audit logs, cloud storage for curriculum media, and iGOT Karmayogi API synchronizer.", style_bullet))
    story.append(Spacer(1, 8))

    # 6. Novelty & Competitive Advantage
    story.append(Paragraph("6. Novelty & Competitive Advantage (Compared to Existing Projects)", style_h1))
    
    novel_data = [
        [Paragraph("Dimension", style_table_header), Paragraph("Conventional Platforms (Moodle, Coursera, Generic iGOT)", style_table_header), Paragraph("BhodBasha (Our Solution)", style_table_header)],
        [
            Paragraph("<b>Domain Specialization</b>", style_table_cell),
            Paragraph("Generic IT or academic topics; zero understanding of official survey methodologies.", style_table_cell),
            Paragraph("<b>Calibrated for MoSPI & NSSTA:</b> Built-in modules for Horvitz-Thompson, National Accounts, CAPI, and NSS schedules.", style_table_cell)
        ],
        [
            Paragraph("<b>Offline Capability</b>", style_table_cell),
            Paragraph("Cloud-dependent streaming; breaks down immediately without internet in remote villages.", style_table_cell),
            Paragraph("<b>True Zero Data-Cost PWA:</b> Complete <15MB encrypted packages execute lectures, glossaries, and tests 100% offline.", style_table_cell)
        ],
        [
            Paragraph("<b>Indic Language Handling</b>", style_table_cell),
            Paragraph("Unchecked machine translation destroys mathematical formulas and statistical meanings.", style_table_cell),
            Paragraph("<b>Glossary-Guarded Dual Subtitles:</b> Protects mathematical equations while rendering natural conversational regional explanations.", style_table_cell)
        ],
        [
            Paragraph("<b>Cadre Analytics</b>", style_table_cell),
            Paragraph("Superficial pass/fail grades without diagnostic insights for academies.", style_table_cell),
            Paragraph("<b>Cadre Misconception Clustering:</b> Uncovers root-cause confusion across regional offices with 1-click targeted remediation.", style_table_cell)
        ],
        [
            Paragraph("<b>Career Framework</b>", style_table_cell),
            Paragraph("Isolated course completions unlinked to official governance structures.", style_table_cell),
            Paragraph("<b>Native iGOT & NSSTA Integration:</b> Directly aligned with FRAC competency matrices and NSSTA in-service TPAC calendars.", style_table_cell)
        ],
    ]
    t_novel = Table(novel_data, colWidths=[100, 180, 224])
    t_novel.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_terracotta),
        ('BORDER', (0, 0), (-1, -1), 0.5, c_border),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
    ]))
    story.append(t_novel)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully built: {filename}")

if __name__ == "__main__":
    output_pdf = "BhodBasha_Project_Summary.pdf"
    build_pdf(output_pdf)
    
    # Also copy to frontend public directory for instant web download
    public_dir = os.path.join("frontend", "public")
    if os.path.exists(public_dir):
        public_dest = os.path.join(public_dir, "BhodBasha_Project_Summary.pdf")
        shutil.copyfile(output_pdf, public_dest)
        print(f"Copied to public web folder: {public_dest}")
