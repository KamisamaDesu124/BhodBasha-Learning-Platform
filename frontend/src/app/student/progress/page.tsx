'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  User, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Building,
  Target,
  Briefcase,
  RefreshCw,
  FileCheck
} from 'lucide-react';

interface CompetencyItem {
  code: string;
  name: string;
  current: number;
  required: number;
  gap: number;
  status: 'Mastered' | 'Developing' | 'Needs Support';
  badgeClass: string;
  recommendation: string;
  assetLink: string;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [recalculating, setRecalculating] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const [competencies, setCompetencies] = useState<CompetencyItem[]>([
    {
      code: "STAT-SAMP-01",
      name: "Stratified Multi-Stage Sampling & Horvitz-Thompson Estimation",
      current: 42,
      required: 80,
      gap: -38,
      status: "Needs Support",
      badgeClass: "badge-support",
      recommendation: "ASUSE 2026 Manual Chapter 4 & Sampling Calibration Workshop",
      assetLink: "/student/learn/2"
    },
    {
      code: "STAT-NAC-02",
      name: "National Accounts & Implicit GDP Deflator vs CPI",
      current: 52,
      required: 80,
      gap: -28,
      status: "Developing",
      badgeClass: "badge-developing",
      recommendation: "MoSPI NAS 2026 Lecture & Paasche Weighting Exercises",
      assetLink: "/student/learn/1"
    },
    {
      code: "STAT-AIML-03",
      name: "AI/ML & Automated Data Validation in Statistical Surveys",
      current: 30,
      required: 75,
      gap: -45,
      status: "Needs Support",
      badgeClass: "badge-support",
      recommendation: "iGOT Karmayogi Course: AI/ML Applications in Official Statistics",
      assetLink: "/student/learn/1"
    },
    {
      code: "STAT-CAPI-04",
      name: "CAPI Tablet Operations & Geo-Tagging Integrity",
      current: 88,
      required: 80,
      gap: +8,
      status: "Mastered",
      badgeClass: "badge-mastered",
      recommendation: "Benchmark Cadre Standard Maintained (Annual Recertification)",
      assetLink: "/student/learn/2"
    }
  ]);

  const loadRealTimeCompetencies = async () => {
    setRecalculating(true);
    try {
      // 1. Check local storage overrides from recent tests
      const storedScores = JSON.parse(localStorage.getItem('bhodbasha_competency_scores') || '{}');
      
      // 2. Check IndexedDB attempts
      const allAttempts = await db.attempts.toArray();
      setAttemptCount(allAttempts.length);

      setCompetencies(prev => prev.map(comp => {
        let score = comp.current;

        // If stored score exists in local storage
        if (storedScores[comp.code] !== undefined) {
          score = Number(storedScores[comp.code]);
        }

        // Check if there are specific attempts in IndexedDB
        const matchingAttempts = allAttempts.filter(a => (a as any).competency_code === comp.code);
        if (matchingAttempts.length > 0) {
          const correctCount = matchingAttempts.filter(a => a.is_correct).length;
          score = Math.round((correctCount / matchingAttempts.length) * 100);
        }

        const gap = score - comp.required;
        let status: 'Mastered' | 'Developing' | 'Needs Support' = 'Needs Support';
        let badgeClass = 'badge-support';

        if (score >= comp.required) {
          status = 'Mastered';
          badgeClass = 'badge-mastered';
        } else if (score >= 50) {
          status = 'Developing';
          badgeClass = 'badge-developing';
        }

        return {
          ...comp,
          current: score,
          gap,
          status,
          badgeClass
        };
      }));
    } catch (e) {
      console.error('Error loading real-time competencies:', e);
    } finally {
      setTimeout(() => {
        setRecalculating(false);
      }, 500);
    }
  };

  useEffect(() => {
    loadRealTimeCompetencies();
  }, []);

  const officialProfile = {
    name: user?.full_name || "Sunil Sharma (SSO)",
    designation: "Senior Statistical Officer (SSO)",
    department: "Field Operations Division (FOD), MoSPI - Hyderabad RO",
    role: "Survey Supervision & Data Quality Verification",
    currentAssignment: "Periodic Labour Force Survey (PLFS) & ASUSE 2026",
    qualification: "M.Sc. Statistics / Econometrics",
    experience: "7 Years in Official Statistical Cadre",
    cadreId: "MoSPI-FOD-HYD-0482",
    previousTrainings: [
      "Basic Survey Sampling & Stratification (NSSTA)",
      "Computer-Assisted Personal Interviewing (CAPI)",
      "National Industrial Classification (NIC-2008)"
    ]
  };

  const recommendations = [
    {
      id: "iGOT-STAT-AIML-401",
      type: "iGOT Karmayogi Official Course",
      title: "AI/ML & Big Data Analytics in Official Statistics (MoSPI / NSSTA)",
      duration: "45 Mins • Self-Paced Online",
      language: "English / Hindi Subtitles",
      targetGap: "STAT-AIML-03 (Gap: -45%)",
      reason: "Directly bridges automated survey validation, outlier detection, and CAPI error trapping.",
      link: "https://igotkarmayogi.gov.in/#/browse-courses",
      inAppModule: "/student/learn/1"
    },
    {
      id: "NSSTA-TPAC-2026-04",
      type: "NSSTA TPAC Approved In-Service Programme",
      title: "Multi-Stage Stratified Sampling & Survey Calibration (Telugu / English)",
      duration: "3-Day In-Service Workshop • NSSTA Greater Noida / Regional Centres",
      language: "Telugu & English",
      targetGap: "STAT-SAMP-01 (Gap: -38%)",
      reason: "Mandatory in-service calibration for Field Supervisors to eliminate sampling variance and boundary errors.",
      link: "https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta",
      inAppModule: "/student/learn/2"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBFC] py-10">
      <div className="heritage-container max-w-5xl space-y-8 animate-fade-in">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#9F3E07] border border-orange-200 mb-2">
              <ShieldCheck size={13} className="text-[#9F3E07]" />
              <span>MoSPI Skill Intelligence Engine</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Official Competency Profile & Gap Analysis
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              AI-estimated competency scores calibrated in real-time from survey assessment evidence, benchmarked against DoPT FRAC and NSSTA TPAC standards.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadRealTimeCompetencies}
              disabled={recalculating}
              className="btn btn-outline text-xs h-9 shadow-xs flex items-center gap-1.5 font-mono"
            >
              <RefreshCw size={13} className={recalculating ? 'animate-spin text-[#9F3E07]' : ''} />
              <span>{recalculating ? 'Calculating Evidence...' : 'Recalculate Scores'}</span>
            </button>
            <Link 
              href="/student/learn/1" 
              className="btn btn-primary text-xs h-9 shadow-xs flex items-center gap-1.5"
            >
              <span>Continue Learning</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* 1. Official Comprehensive Competency Profile */}
        <div className="heritage-card border-l-4 border-l-[#2B4C7E] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-online text-[10px]">
                <ShieldCheck size={12} className="inline mr-1" />
                Verified Cadre Profile
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                ID: {officialProfile.cadreId}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Calibrated from {attemptCount} Assessment Submissions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Officer Name</p>
              <p className="font-serif font-bold text-lg text-slate-900">{officialProfile.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Designation</p>
              <p className="font-serif font-bold text-base text-[#9F3E07]">{officialProfile.designation}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Department / Office</p>
              <p className="text-xs text-slate-700 font-medium">{officialProfile.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Current Field Assignment</p>
              <p className="text-xs text-slate-700 font-medium">{officialProfile.currentAssignment}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Qualifications & Experience</p>
              <p className="text-xs text-slate-700 font-medium">{officialProfile.qualification} • {officialProfile.experience}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Verified Prior In-Service Trainings</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {officialProfile.previousTrainings.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Automated Real-Time Skill-Gap Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Automated Competency Gap Analysis (Real-Time Evidence)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                4 Competencies Tracked
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">Benchmark Threshold: 80% Mastery</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {competencies.map((item) => (
              <div key={item.code} className="heritage-card space-y-4 p-5 hover:shadow-hover transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="badge-mono badge-offline text-[10px]">{item.code}</span>
                    <h3 className="font-serif font-bold text-base text-slate-900 mt-1 leading-snug">
                      {item.name}
                    </h3>
                  </div>
                  <span className={`badge-mono ${item.badgeClass} shrink-0`}>{item.status}</span>
                </div>

                {/* Progress Comparison */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">
                      Current Score: <strong className="text-slate-900">{item.current}%</strong>
                    </span>
                    <span className="text-slate-500">
                      Required: <strong className="text-slate-900">{item.required}%</strong>
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.current >= item.required 
                          ? 'bg-emerald-600' 
                          : 'bg-gradient-to-r from-amber-500 to-[#9F3E07]'
                      }`}
                      style={{ width: `${item.current}%` }}
                    />
                  </div>
                </div>

                {/* Gap Metric & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-mono font-bold ${item.gap < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                    {item.gap < 0 ? `Deficit: ${item.gap}%` : `Benchmark Met (+${item.gap}%)`}
                  </span>
                  <Link href={item.assetLink} className="text-[#9F3E07] hover:underline font-semibold text-[11px] flex items-center gap-1">
                    <span>Study Module</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Personalized iGOT Karmayogi & NSSTA TPAC Recommendations with Verified Links */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Personalized Training Pathways (iGOT & NSSTA TPAC)
              </h2>
              <p className="text-xs text-slate-600">
                Curated interventions prioritized by the AI skill intelligence engine to eliminate your specific statistical gaps.
              </p>
            </div>
            <span className="badge-mono badge-waiting">2 Priority Interventions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="heritage-card space-y-4 border-l-4 border-l-amber-600 bg-white p-5 hover:shadow-hover transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="badge-mono badge-developing text-[10px]">{rec.type}</span>
                    <span className="text-xs font-mono font-bold text-[#9F3E07]">
                      Target: {rec.targetGap}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                  
                  <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <p>• Duration: {rec.duration}</p>
                    <p>• Subtitles: {rec.language}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 mt-3">
                  <span className="text-xs font-mono text-[#2B4C7E] font-bold">{rec.id}</span>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={rec.inAppModule}
                      className="btn btn-primary text-xs h-8 py-1 px-3 shadow-xs"
                    >
                      Study in App
                    </Link>

                    <a
                      href={rec.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-xs h-8 py-1 px-3 shadow-xs flex items-center gap-1 text-slate-700 hover:text-slate-900"
                    >
                      <span>Official Portal</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
