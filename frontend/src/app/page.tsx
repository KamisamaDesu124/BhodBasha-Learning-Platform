'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  School,
  ArrowRight,
  DownloadCloud,
  Sparkles,
  ShieldCheck,
  BarChart2,
  BookOpen,
  Layers,
  CheckCircle2,
  Database,
  Languages,
  Award,
  FileText,
  Building,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { TextReveal } from '@/components/ui/3d-text-reveal';
import { ScrollStack } from '@/components/ui/scroll-stack';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFC] selection:bg-orange-100 selection:text-[#9F3E07]">

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/80">

        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-50/70 via-amber-50/40 to-transparent pointer-events-none -z-10" />
        <div className="absolute -top-24 right-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-32 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="heritage-container text-center max-w-4xl mx-auto space-y-6 animate-fade-in">

          {/* Official MoSPI & iGOT Verification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#894F00] border border-amber-200 shadow-2xs">
              <ShieldCheck size={14} className="text-[#9F3E07]" />
              <span>India's Official Statistical System • MoSPI & NSSTA</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <Sparkles size={13} className="text-emerald-600" />
              <span>iGOT Karmayogi (DoPT FRAC) Integrated</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-slate-900 leading-[1.15] tracking-tight">
            AI Skill Intelligence & Learning Platform,{' '}
            <span className="bg-gradient-to-r from-[#9F3E07] via-amber-700 to-[#833204] bg-clip-text text-transparent">
              even offline.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            BhodBasha assesses official competencies across MoSPI cadres, diagnoses skill gaps, and recommends personalized learning pathways across <strong>iGOT Karmayogi</strong> and <strong>NSSTA TPAC approved programmes</strong> with synchronized Indic subtitles (Telugu, Hindi, English).
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/student/progress"
              className="btn btn-primary py-3 px-6 text-sm font-semibold shadow-card flex items-center gap-2"
            >
              <span>View Official Competency Profile</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/login"
              className="btn btn-secondary py-3 px-5 text-sm font-semibold"
            >
              1-Click Demo Login
            </Link>

            <Link
              href="/student/learn/1"
              className="btn btn-outline py-3 px-5 text-sm font-medium"
            >
              Lecture Player
            </Link>
          </div>

          {/* Metric Stats Pills */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-serif font-bold text-slate-900">24 Officers</p>
              <p className="text-[11px] text-slate-500 font-medium">Monitored South Cadre</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-serif font-bold text-[#9F3E07]">100% Offline</p>
              <p className="text-[11px] text-slate-500 font-medium">Zero Data-Cost Edge PWA</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-serif font-bold text-[#2B4C7E]">19-Stage</p>
              <p className="text-[11px] text-slate-500 font-medium">AI Ingestion Pipeline</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-2xl font-serif font-bold text-emerald-700">76% Target</p>
              <p className="text-[11px] text-slate-500 font-medium">Post-Intervention Mastery</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Persona Role Paths (Learner vs Directorate Supervisor) */}
      <section className="py-16 heritage-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase text-slate-500 tracking-wider">
            Dual Ecosystem Consoles
          </span>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mt-1">
            Tailored Experiences for Every Cadre Level
          </h2>
          <p className="text-xs text-slate-600 mt-2">
            Seamlessly bridging field investigators in remote villages with academic supervisors at the NSSTA Directorate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Card 1: Official Learner Path */}
          <div className="heritage-card border-l-4 border-l-[#9F3E07] bg-white p-7 shadow-sm hover:shadow-hover transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 rounded-xl bg-orange-100 text-[#9F3E07]">
                  <GraduationCap size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    Learner Portal (Statistical Officers)
                  </h3>
                  <p className="text-xs font-mono text-slate-500">MoSPI Field Operations & Survey Cadres</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Explore automated skill-gap analysis, download complete offline training packages for field visits, watch lectures with synchronized Telugu/Hindi subtitles, and take checkpoint quizzes.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <ShieldCheck size={16} className="text-[#9F3E07] shrink-0" />
                  <span>Automated profile: Designation, Department & Experience</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <DownloadCloud size={16} className="text-[#9F3E07] shrink-0" />
                  <span>Offline packages with IndexedDB persistence & background sync</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Sparkles size={16} className="text-[#9F3E07] shrink-0" />
                  <span>Targeted iGOT Karmayogi & NSSTA TPAC recommendations</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <Link href="/student/progress" className="btn btn-primary w-full justify-between shadow-xs">
                <span>Enter Competency & Skill Gap Dashboard</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/student/downloads" className="btn btn-outline w-full justify-between text-xs py-2.5">
                <span>Offline Download Center</span>
                <DownloadCloud size={15} />
              </Link>
            </div>
          </div>

          {/* Card 2: Supervisor / NSSTA Director Path */}
          <div className="heritage-card border-l-4 border-l-[#2B4C7E] bg-white p-7 shadow-sm hover:shadow-hover transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 rounded-xl bg-blue-100 text-[#2B4C7E]">
                  <School size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    Supervisor Console (NSSTA Directorate)
                  </h3>
                  <p className="text-xs font-mono text-slate-500">Capacity Building & Training Committee</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor regional statistical competency heatmaps, detect cadre-wide misconception clusters (e.g. Implicit GDP Deflator vs. CPI), and dispatch 1-click targeted training intervention groups.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <BarChart2 size={16} className="text-[#2B4C7E] shrink-0" />
                  <span>Regional FOD Cadre Competency Heatmaps</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <BookOpen size={16} className="text-[#2B4C7E] shrink-0" />
                  <span>Misconception clusters with root-cause diagnostic feedback</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Layers size={16} className="text-[#2B4C7E] shrink-0" />
                  <span>1-Click Intervention Group creation & reassessment tracking</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <Link href="/teacher/insights" className="btn btn-secondary w-full justify-between shadow-xs">
                <span>Enter Supervisor Insights Dashboard</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/teacher/assets" className="btn btn-outline w-full justify-between text-xs py-2.5">
                <span>Curriculum Ingestion Pipeline</span>
                <Layers size={15} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. React Bits Pro 3D Text Reveal Section */}
      <section className="relative w-full border-t border-slate-200/80">
        <TextReveal
          subtitle="TECHNICAL ARCHITECTURE"
          items={[
            "India's Official Statistics",
            "Continuous Capacity Building",
            "Engineered for Real-World",
            "Field Realities"
          ]}
          scrollDistance="110vh"
          startRotation={-12}
          endRotation={54}
          gap={14}
          radiusOffset={0.16}
          scrubSmoothing={1.0}
        />
      </section>

      {/* 4. Core Architectural Highlights with React Bits Pro Scroll Stack */}
      <section className="relative w-full bg-slate-100/60 border-t border-slate-200/80 pt-10">
        <div className="heritage-container text-center max-w-3xl mx-auto mb-6">
          <span className="text-xs font-mono font-semibold uppercase text-slate-500 tracking-wider">
            Features & Technical Uniqueness
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">
            Engineered for India's Statistical Realities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Pinned cards that stack, turn, and dissolve as the page scrolls — showcasing the architectural pillars safeguarding official capacity building.
          </p>
        </div>

        <ScrollStack
          variant="deck"
          cardWidth={840}
          cardHeight={0.58}
          peek={30}
          scaleStep={0.06}
          scrollLength={0.9}
          dim={0.14}
          blur={2.5}
          showProgress={true}
          showCounter={true}
          items={[
            {
              eyebrow: '01. EDGE RESILIENCE & ZERO DATA COST',
              title: '100% Offline Edge PWA',
              body: 'Full encrypted training packages, synchronized Indic audio, and checkpoint assessment engines cached in browser IndexedDB via Dexie.js. Field enumerators study lectures and submit assessments in remote villages without internet; results auto-reconcile idempotently.',
              icon: <Database size={24} />,
              tags: ['IndexedDB Dexie.js Cache', 'Zero Network Dependency', 'Idempotent Sync Queue', 'AES-GCM Local Vault'],
              accent: '#9F3E07',
            },
            {
              eyebrow: '02. OFFICIAL TERMINOLOGY PRESERVATION',
              title: 'Glossary-Guarded Indic AI',
              body: 'State-of-the-art ASR speech models and Neural Machine Translation (IndicTrans2) preserve mathematical formulations and official Indian statistical nomenclature (Horvitz-Thompson, ASUSE, PLFS, implicit deflator) without literal distortion across Telugu, Hindi, and English.',
              icon: <Languages size={24} />,
              tags: ['IndicTrans2 Transformer', 'Mathematical Token Shield', 'Multi-dialect Phoneme ASR', 'Synchronized Subtitles'],
              accent: '#2B4C7E',
            },
            {
              eyebrow: '03. DIRECTORATE-WIDE CADRE DIAGNOSTICS',
              title: 'Cadre Misconception Clusters',
              body: 'Unsupervised machine learning clustering analyzes assessment failure patterns to surface systemic conceptual bottlenecks across regional FOD directorates, empowering NSSTA training committees with actionable 1-click targeted remediation groups.',
              icon: <TrendingUp size={24} />,
              tags: ['K-Means Cadre Diagnostics', 'Cadre Competency Heatmaps', '1-Click Remediation Dispatch', 'DoPT FRAC Alignment'],
              accent: '#894F00',
            },
            {
              eyebrow: '04. AUTOMATED CURRICULUM TRANSFORMATION',
              title: '19-Stage AI Ingestion Pipeline',
              body: 'Ingests raw MoSPI publications, survey manuals, and field video recordings into interactive learning modules. The 19-stage pipeline executes mathematical OCR, semantic chunking, multi-dialect ASR, synchronized WebVTT subtitle synthesis, and automated MCQ generation with source page citations.',
              icon: <Cpu size={24} />,
              tags: ['Mathematical Formulation OCR', 'Indic ASR Diarization', 'Automated Checkpoint Synthesis', 'Source Page Traceability'],
              accent: '#047857',
            },
            {
              eyebrow: '05. NATIONAL GOVTECH ALIGNMENT',
              title: 'iGOT & DoPT FRAC Competency Matrix',
              body: 'Dynamically maps individual field investigator quiz results and training hours directly to the official DoPT FRAC (Framework for Roles, Activities and Competencies) schema and NSSTA TPAC guidelines. Enables automated career progression tracking, capability auditing, and national MoSPI certification.',
              icon: <ShieldCheck size={24} />,
              tags: ['DoPT FRAC Ontologies', 'iGOT Karmayogi Sync', 'NSSTA TPAC Accreditation', 'Cryptographic Skill Badges'],
              accent: '#5B21B6',
            },
          ]}
        />
      </section>

    </div>
  );
}
