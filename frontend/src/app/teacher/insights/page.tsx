'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  PlusCircle,
  BarChart3, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  X,
  Target,
  Building,
  Layers,
  MapPin,
  FileCheck,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

interface HeatmapRow {
  office: string;
  state: string;
  samp: number;
  nac: number;
  aiml: number;
  capi: number;
}

interface OfficerRecord {
  id: string;
  name: string;
  designation: string;
  office: string;
  state: string;
  samp: number;
  nac: number;
  aiml: number;
  capi: number;
  misconception: string;
}

interface CadreCohortData {
  id: string;
  name: string;
  description: string;
  officersCount: number;
  officesCount: number;
  averageMastery: number;
  gainTrend: string;
  priorityGapsCount: number;
  priorityGapsTopic: string;
  offlineSyncHealth: string;
  collisionErrors: number;
  misconception: {
    title: string;
    affectedPercent: number;
    affectedCount: number;
    explanation: string;
    recommendedModule: string;
    projectedGain: string;
  };
  heatmap: HeatmapRow[];
  officers: OfficerRecord[];
}

const CADRE_COHORTS: Record<string, CadreCohortData> = {
  'MoSPI Statistical Cadre - Batch 2026': {
    id: 'batch-2026',
    name: 'MoSPI Statistical Cadre - Batch 2026',
    description: 'Direct recruit Senior and Junior Statistical Officers (SSO/JSO) undergoing apex NSSTA in-service foundational training across South Zone directorates.',
    officersCount: 24,
    officesCount: 4,
    averageMastery: 64,
    gainTrend: '+18% gain post-CAPI training',
    priorityGapsCount: 17,
    priorityGapsTopic: 'Implicit GDP Deflator & Sampling Calibration',
    offlineSyncHealth: '100%',
    collisionErrors: 0,
    misconception: {
      title: 'Confusion between Implicit GDP Deflator vs. Consumer Price Index (CPI)',
      affectedPercent: 72,
      affectedCount: 17,
      explanation: 'Item response diagnostics reveal that 17 officers erroneously assume the Implicit Deflator uses a fixed base-year basket like CPI, rather than accounting for changing domestic production patterns via Paasche dynamic weighting.',
      recommendedModule: 'NSSTA TPAC: Multi-Stage Stratified Sampling & Survey Calibration (Telugu/English)',
      projectedGain: '42% → 76% (+34% gain)'
    },
    heatmap: [
      { office: "FOD Hyderabad RO", state: "Telangana", samp: 44, nac: 52, aiml: 38, capi: 92 },
      { office: "FOD Vijayawada RO", state: "Andhra Pradesh", samp: 38, nac: 48, aiml: 26, capi: 86 },
      { office: "FOD Bengaluru RO", state: "Karnataka", samp: 56, nac: 62, aiml: 45, capi: 94 },
      { office: "FOD Chennai RO", state: "Tamil Nadu", samp: 48, nac: 54, aiml: 40, capi: 88 },
    ],
    officers: [
      { id: "MoSPI-SSO-HYD-0482", name: "Sunil Sharma", designation: "Senior Statistical Officer (SSO)", office: "FOD Hyderabad RO", state: "Telangana", samp: 42, nac: 52, aiml: 30, capi: 88, misconception: "Implicit Deflator Paasche Weighting" },
      { id: "MoSPI-JSO-HYD-0511", name: "K. Anuradha", designation: "Junior Statistical Officer (JSO)", office: "FOD Hyderabad RO", state: "Telangana", samp: 46, nac: 50, aiml: 42, capi: 94, misconception: "Implicit Deflator Paasche Weighting" },
      { id: "MoSPI-SSO-VIJ-0391", name: "V. Rama Krishna", designation: "Senior Statistical Officer (SSO)", office: "FOD Vijayawada RO", state: "Andhra Pradesh", samp: 36, nac: 46, aiml: 24, capi: 84, misconception: "Implicit Deflator Paasche Weighting" },
      { id: "MoSPI-JSO-VIJ-0442", name: "P. Sravani", designation: "Junior Statistical Officer (JSO)", office: "FOD Vijayawada RO", state: "Andhra Pradesh", samp: 40, nac: 50, aiml: 28, capi: 88, misconception: "Horvitz-Thompson Inclusion Probability" },
      { id: "MoSPI-SSO-BLR-0289", name: "G. Venkatesh", designation: "Senior Statistical Officer (SSO)", office: "FOD Bengaluru RO", state: "Karnataka", samp: 58, nac: 64, aiml: 48, capi: 96, misconception: "Implicit Deflator Paasche Weighting" },
      { id: "MoSPI-JSO-BLR-0312", name: "Deepa Hegde", designation: "Junior Statistical Officer (JSO)", office: "FOD Bengaluru RO", state: "Karnataka", samp: 54, nac: 60, aiml: 42, capi: 92, misconception: "Intermediate Consumption Imputation" },
      { id: "MoSPI-SSO-CHN-0194", name: "S. Balasubramanian", designation: "Senior Statistical Officer (SSO)", office: "FOD Chennai RO", state: "Tamil Nadu", samp: 46, nac: 52, aiml: 38, capi: 86, misconception: "Implicit Deflator Paasche Weighting" },
      { id: "MoSPI-JSO-CHN-0218", name: "M. Revathi", designation: "Junior Statistical Officer (JSO)", office: "FOD Chennai RO", state: "Tamil Nadu", samp: 50, nac: 56, aiml: 42, capi: 90, misconception: "Implicit Deflator Paasche Weighting" },
    ]
  },
  'FOD Field Investigators (South Zone)': {
    id: 'fod-south',
    name: 'FOD Field Investigators (South Zone)',
    description: 'Comprehensive cadre of all active field supervisors and investigators conducting ASUSE and PLFS survey rounds across 6 Southern regional directorates.',
    officersCount: 118,
    officesCount: 6,
    averageMastery: 58,
    gainTrend: '+12% gain post-regional calibration',
    priorityGapsCount: 46,
    priorityGapsTopic: 'ASUSE Enterprise Listing & OAE Census Criteria',
    offlineSyncHealth: '99.4%',
    collisionErrors: 1,
    misconception: {
      title: 'Own Account Enterprise (OAE) vs. Establishment Census Cutoff Confusion',
      affectedPercent: 68,
      affectedCount: 46,
      explanation: 'Enumerators frequently fail to apply the 10+ worker (without power) or 20+ worker (with power) mandatory complete enumeration (census) threshold, erroneously attempting to sample large manufacturing units.',
      recommendedModule: 'ASUSE 2026 Operational Guidelines: Chapter 4 Enterprise Classification Protocol',
      projectedGain: '38% → 82% (+44% gain)'
    },
    heatmap: [
      { office: "FOD Hyderabad RO", state: "Telangana", samp: 52, nac: 58, aiml: 42, capi: 94 },
      { office: "FOD Vijayawada RO", state: "Andhra Pradesh", samp: 46, nac: 52, aiml: 34, capi: 88 },
      { office: "FOD Bengaluru RO", state: "Karnataka", samp: 62, nac: 66, aiml: 48, capi: 95 },
      { office: "FOD Chennai RO", state: "Tamil Nadu", samp: 54, nac: 60, aiml: 44, capi: 90 },
      { office: "FOD Thiruvananthapuram RO", state: "Kerala", samp: 68, nac: 70, aiml: 52, capi: 96 },
      { office: "FOD Visakhapatnam SRO", state: "Andhra Pradesh", samp: 44, nac: 50, aiml: 32, capi: 85 },
    ],
    officers: [
      { id: "MoSPI-SSO-TVM-0112", name: "R. Nair", designation: "Senior Statistical Officer (SSO)", office: "FOD Thiruvananthapuram RO", state: "Kerala", samp: 70, nac: 72, aiml: 54, capi: 96, misconception: "OAE Census Cutoff Threshold" },
      { id: "MoSPI-JSO-TVM-0145", name: "A. Mathew", designation: "Junior Statistical Officer (JSO)", office: "FOD Thiruvananthapuram RO", state: "Kerala", samp: 66, nac: 68, aiml: 50, capi: 96, misconception: "GVA Raw Material Exclusions" },
      { id: "MoSPI-SSO-VSK-0078", name: "D. Srinivas", designation: "Senior Statistical Officer (SSO)", office: "FOD Visakhapatnam SRO", state: "Andhra Pradesh", samp: 42, nac: 48, aiml: 30, capi: 84, misconception: "OAE Census Cutoff Threshold" },
      { id: "MoSPI-JSO-VSK-0091", name: "B. Lavanya", designation: "Junior Statistical Officer (JSO)", office: "FOD Visakhapatnam SRO", state: "Andhra Pradesh", samp: 46, nac: 52, aiml: 34, capi: 86, misconception: "OAE Census Cutoff Threshold" }
    ]
  },
  'National Accounts Division (NAD) Trainees': {
    id: 'nad-delhi',
    name: 'National Accounts Division (NAD) Trainees',
    description: 'Central Statistical Office (CSO) macroeconomic accounting officers responsible for GDP compilation, Supply-Use Tables (SUT), and base-year revisions.',
    officersCount: 36,
    officesCount: 4,
    averageMastery: 71,
    gainTrend: '+22% gain post-SUT workshop',
    priorityGapsCount: 14,
    priorityGapsTopic: 'Double Deflation vs Single Deflation in Value Added',
    offlineSyncHealth: '100%',
    collisionErrors: 0,
    misconception: {
      title: 'Single Extrapolation Error in Constant-Price GVA Computation',
      affectedPercent: 54,
      affectedCount: 14,
      explanation: 'Trainee analysts frequently apply output deflators directly to value added (single deflation) instead of independently deflating gross output and intermediate consumption (double deflation), causing distorted sectoral growth rates.',
      recommendedModule: 'CSO National Accounts: Double Deflation Methodology & SUT Reconciliation',
      projectedGain: '50% → 88% (+38% gain)'
    },
    heatmap: [
      { office: "NAD CSO Production Accounts", state: "New Delhi", samp: 65, nac: 82, aiml: 55, capi: 90 },
      { office: "NAD Price Statistics & Deflator Cell", state: "New Delhi", samp: 58, nac: 74, aiml: 50, capi: 88 },
      { office: "NAD Supply-Use Tables (SUT) Div", state: "New Delhi", samp: 62, nac: 78, aiml: 58, capi: 92 },
      { office: "NAD State Domestic Product (SDP) Unit", state: "New Delhi", samp: 54, nac: 68, aiml: 46, capi: 86 },
    ],
    officers: [
      { id: "MoSPI-AD-NAD-0012", name: "Rajeshwari Sen", designation: "Assistant Director (AD)", office: "NAD CSO Production Accounts", state: "New Delhi", samp: 68, nac: 86, aiml: 60, capi: 92, misconception: "Single vs Double Deflation" },
      { id: "MoSPI-SSO-NAD-0045", name: "Amitabh Verma", designation: "Senior Statistical Officer (SSO)", office: "NAD Supply-Use Tables (SUT) Div", state: "New Delhi", samp: 64, nac: 80, aiml: 56, capi: 94, misconception: "Single vs Double Deflation" },
      { id: "MoSPI-JSO-NAD-0089", name: "Pooja Malhotra", designation: "Junior Statistical Officer (JSO)", office: "NAD Price Statistics Cell", state: "New Delhi", samp: 56, nac: 72, aiml: 48, capi: 86, misconception: "Single vs Double Deflation" }
    ]
  },
  'FOD Field Investigators (West Zone)': {
    id: 'fod-west',
    name: 'FOD Field Investigators (West Zone)',
    description: 'Field Operations Division directorates managing enterprise data collection in Maharashtra, Gujarat, Goa, and Chhattisgarh.',
    officersCount: 84,
    officesCount: 5,
    averageMastery: 62,
    gainTrend: '+15% gain post-CAPI rollout',
    priorityGapsCount: 29,
    priorityGapsTopic: 'Cluster Sampling Design Effect (deff) Calculation',
    offlineSyncHealth: '98.9%',
    collisionErrors: 2,
    misconception: {
      title: 'Underestimation of Cluster Design Effect (deff) in Urban Frame Surveys',
      affectedPercent: 61,
      affectedCount: 29,
      explanation: 'Supervisors underestimate intra-class correlation in high-density urban wards, resulting in insufficient sample sizes for unorganized service sector units.',
      recommendedModule: 'Urban Frame Survey (UFS) Geospatial Stratification & Design Effect Calibration',
      projectedGain: '44% → 79% (+35% gain)'
    },
    heatmap: [
      { office: "FOD Mumbai RO", state: "Maharashtra", samp: 54, nac: 62, aiml: 44, capi: 94 },
      { office: "FOD Ahmedabad RO", state: "Gujarat", samp: 52, nac: 60, aiml: 40, capi: 92 },
      { office: "FOD Pune RO", state: "Maharashtra", samp: 58, nac: 66, aiml: 46, capi: 95 },
      { office: "FOD Nagpur RO", state: "Maharashtra", samp: 48, nac: 56, aiml: 36, capi: 88 },
      { office: "FOD Raipur RO", state: "Chhattisgarh", samp: 44, nac: 52, aiml: 32, capi: 86 },
    ],
    officers: [
      { id: "MoSPI-SSO-MUM-0182", name: "Kailash Patil", designation: "Senior Statistical Officer (SSO)", office: "FOD Mumbai RO", state: "Maharashtra", samp: 56, nac: 64, aiml: 46, capi: 95, misconception: "Urban Cluster Design Effect" },
      { id: "MoSPI-JSO-AHM-0221", name: "Bhavik Patel", designation: "Junior Statistical Officer (JSO)", office: "FOD Ahmedabad RO", state: "Gujarat", samp: 50, nac: 58, aiml: 38, capi: 90, misconception: "Urban Cluster Design Effect" }
    ]
  },
  'FOD Field Investigators (North Zone)': {
    id: 'fod-north',
    name: 'FOD Field Investigators (North Zone)',
    description: 'Field Operations Division directorates across Delhi, Uttar Pradesh, Rajasthan, Punjab, Haryana, Uttarakhand, and Jammu & Kashmir.',
    officersCount: 96,
    officesCount: 6,
    averageMastery: 60,
    gainTrend: '+14% gain post-training',
    priorityGapsCount: 34,
    priorityGapsTopic: 'CAPI Geotagging Distance Thresholds & Tablet Security',
    offlineSyncHealth: '99.1%',
    collisionErrors: 1,
    misconception: {
      title: 'Geo-Boundary Tolerance & Buffer Zone Reconciliation Failure',
      affectedPercent: 58,
      affectedCount: 34,
      explanation: 'Investigators improperly override GPS boundary validation warnings when surveying peripheral rural hamlet clusters, causing spatial audit discrepancies.',
      recommendedModule: 'CAPI Tablet Security, Geo-Tagging Integrity & Audit Log Verification',
      projectedGain: '40% → 84% (+44% gain)'
    },
    heatmap: [
      { office: "FOD Delhi RO", state: "NCT of Delhi", samp: 58, nac: 64, aiml: 48, capi: 96 },
      { office: "FOD Lucknow RO", state: "Uttar Pradesh", samp: 46, nac: 54, aiml: 36, capi: 88 },
      { office: "FOD Jaipur RO", state: "Rajasthan", samp: 50, nac: 58, aiml: 38, capi: 90 },
      { office: "FOD Chandigarh RO", state: "Punjab & Haryana", samp: 56, nac: 62, aiml: 44, capi: 94 },
      { office: "FOD Dehradun RO", state: "Uttarakhand", samp: 48, nac: 52, aiml: 34, capi: 86 },
      { office: "FOD Jammu RO", state: "Jammu & Kashmir", samp: 42, nac: 48, aiml: 30, capi: 84 },
    ],
    officers: [
      { id: "MoSPI-SSO-DEL-0311", name: "Praveen Tiwari", designation: "Senior Statistical Officer (SSO)", office: "FOD Delhi RO", state: "NCT of Delhi", samp: 60, nac: 66, aiml: 50, capi: 96, misconception: "Geo-Boundary Tolerance Check" },
      { id: "MoSPI-JSO-LKO-0419", name: "Alok Srivastava", designation: "Junior Statistical Officer (JSO)", office: "FOD Lucknow RO", state: "Uttar Pradesh", samp: 44, nac: 52, aiml: 34, capi: 86, misconception: "Geo-Boundary Tolerance Check" }
    ]
  }
};

export default function TeacherInsightsPage() {
  const [selectedCadreKey, setSelectedCadreKey] = useState('MoSPI Statistical Cadre - Batch 2026');
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [dispatchedCadres, setDispatchedCadres] = useState<Record<string, boolean>>({});
  const [showRoster, setShowRoster] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');

  const currentCadre = CADRE_COHORTS[selectedCadreKey] || CADRE_COHORTS['MoSPI Statistical Cadre - Batch 2026'];
  const isInterventionDispatched = !!dispatchedCadres[selectedCadreKey];

  const handleCreateIntervention = () => {
    setDispatchedCadres(prev => ({ ...prev, [selectedCadreKey]: true }));
    setShowInterventionModal(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
    if (score >= 50) return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
    return 'bg-red-50 text-red-800 border-red-200 font-bold';
  };

  const filteredOfficers = currentCadre.officers.filter(o => 
    o.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    o.office.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    o.id.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    o.designation.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBFC] py-10">
      <div className="heritage-container max-w-6xl space-y-8 animate-fade-in">
        
        {/* Top Bar Header with Cohort Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2B4C7E] border border-blue-200 mb-2">
              <ShieldCheck size={13} className="text-[#2B4C7E]" />
              <span>MoSPI / NSSTA Supervisory Console</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Cadre Skill Intelligence & Actionable Insights
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Directorate analytics monitoring statistical capacity gaps, misconception clusters, and iGOT Karmayogi intervention outcomes across regional field offices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Select Active Cadre Cohort:
              </label>
              <select
                value={selectedCadreKey}
                onChange={(e) => setSelectedCadreKey(e.target.value)}
                className="input-field text-xs py-2 px-3 bg-white font-semibold text-slate-800 border-slate-300 shadow-xs focus:ring-2 focus:ring-[#9F3E07]"
              >
                {Object.keys(CADRE_COHORTS).map((cadreName) => (
                  <option key={cadreName} value={cadreName}>
                    {cadreName}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <Link href="/teacher/assets" className="btn btn-outline text-xs h-9 shadow-xs flex items-center gap-1.5">
                <Layers size={13} />
                <span>Curriculum Ingestion</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Selected Cadre Summary Callout */}
        <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-mono text-[11px] text-[#2B4C7E] font-bold uppercase tracking-wide">
              Active Cohort Context:
            </span>
            <p className="text-slate-700 font-medium">
              {currentCadre.description}
            </p>
          </div>
          <button
            onClick={() => setShowRoster(!showRoster)}
            className="btn btn-outline text-xs h-8 py-1 px-3 shrink-0 flex items-center gap-1.5 font-mono shadow-2xs"
          >
            <UserCheck size={13} />
            <span>{showRoster ? 'Hide Cadre Roster' : `Inspect Officer Roster (${currentCadre.officersCount})`}</span>
          </button>
        </div>

        {/* 1. Cadre Overview Metric Cards (Darkened High-Contrast Sub-Headings) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="heritage-card p-5 space-y-2 bg-white hover:shadow-hover transition-all border border-slate-300">
            <div className="flex items-center justify-between text-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-800 tracking-wider">Monitored Cadre</span>
              <Users size={18} className="text-[#2B4C7E]" />
            </div>
            <p className="text-3xl font-serif font-bold text-slate-950">
              {currentCadre.officersCount} Officers
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Active across {currentCadre.officesCount} Regional Directorates
            </p>
          </div>

          <div className="heritage-card p-5 space-y-2 bg-white hover:shadow-hover transition-all border border-slate-300">
            <div className="flex items-center justify-between text-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-800 tracking-wider">Average Cadre Mastery</span>
              <TrendingUp size={18} className="text-emerald-700" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#9F3E07]">
              {currentCadre.averageMastery}%
            </p>
            <p className="text-xs text-emerald-800 font-bold font-mono">
              {currentCadre.gainTrend}
            </p>
          </div>

          <div className="heritage-card p-5 space-y-2 bg-white hover:shadow-hover transition-all border border-slate-300">
            <div className="flex items-center justify-between text-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-800 tracking-wider">Priority Skill Gaps</span>
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <p className="text-3xl font-serif font-bold text-red-800">
              {currentCadre.priorityGapsCount} Officers
            </p>
            <p className="text-xs text-slate-700 font-semibold truncate" title={currentCadre.priorityGapsTopic}>
              {currentCadre.priorityGapsTopic}
            </p>
          </div>

          <div className="heritage-card p-5 space-y-2 bg-white hover:shadow-hover transition-all border border-slate-300">
            <div className="flex items-center justify-between text-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-slate-800 tracking-wider">Offline Sync Health</span>
              <CheckCircle2 size={18} className="text-emerald-700" />
            </div>
            <p className="text-3xl font-serif font-bold text-slate-950">
              {currentCadre.offlineSyncHealth}
            </p>
            <p className="text-xs text-slate-600 font-mono font-medium">
              {currentCadre.collisionErrors} reconciliation collision errors
            </p>
          </div>
        </div>

        {/* 2. Directorate Intervention Banner (if dispatched for this cadre) */}
        {isInterventionDispatched && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">
                  Intervention Group Active for {currentCadre.name}!
                </p>
                <p className="text-xs text-emerald-700">
                  Targeted NSSTA TPAC & iGOT micro-modules dispatched to {currentCadre.priorityGapsCount} officers. Projected post-remediation mastery: <strong>{currentCadre.misconception.projectedGain}</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDispatchedCadres(prev => ({ ...prev, [selectedCadreKey]: false }))}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
            >
              Reset Status
            </button>
          </div>
        )}

        {/* 3. Detailed Officer Roster Table (Collapsible) */}
        {showRoster && (
          <div className="heritage-card bg-white p-6 shadow-sm space-y-4 animate-fade-in border-l-4 border-l-[#2B4C7E]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck size={18} className="text-[#2B4C7E]" />
                  <span>Cadre Officer Roster & Diagnostics ({currentCadre.name})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Direct item-response diagnostic scores for monitored officers in this cadre cohort.
                </p>
              </div>

              <div className="relative w-full sm:w-64 flex items-center">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter officer or office..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="input-field text-xs !pl-9 py-1.5 w-full"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-[11px] font-mono text-slate-800 font-bold uppercase bg-slate-100">
                    <th className="py-2.5 px-3">Officer Name & Cadre ID</th>
                    <th className="py-2.5 px-3">Designation</th>
                    <th className="py-2.5 px-3">MoSPI Directorate Office</th>
                    <th className="py-2.5 px-3 text-center">Sampling</th>
                    <th className="py-2.5 px-3 text-center">National Accts</th>
                    <th className="py-2.5 px-3 text-center">AI/ML</th>
                    <th className="py-2.5 px-3 text-center">CAPI</th>
                    <th className="py-2.5 px-3">Diagnosed Misconception</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredOfficers.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block font-sans text-xs">{off.name}</span>
                        <span className="text-[10px] text-slate-400">{off.id}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-sans text-xs">{off.designation}</td>
                      <td className="py-2.5 px-3 font-sans text-xs">
                        <span className="font-semibold text-slate-800">{off.office}</span>
                        <span className="block text-[10px] text-slate-400">{off.state}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[11px] ${getScoreColor(off.samp)}`}>
                          {off.samp}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[11px] ${getScoreColor(off.nac)}`}>
                          {off.nac}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[11px] ${getScoreColor(off.aiml)}`}>
                          {off.aiml}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[11px] ${getScoreColor(off.capi)}`}>
                          {off.capi}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-xs text-red-700 font-medium">
                        {off.misconception}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Regional Cadre Competency Heatmap (Legit Real-World Offices) */}
        <div className="heritage-card bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={20} className="text-[#9F3E07]" />
                <span>Regional Cadre Competency Heatmap</span>
              </h2>
              <p className="text-xs text-slate-500">
                Aggregated mastery scores across {currentCadre.heatmap.length} verified MoSPI Field Operations Division (FOD) directorates for {currentCadre.name}.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> ≥80% Benchmark</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> 50-79% Developing</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> &lt;50% Critical</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-xs font-mono text-slate-800 font-bold uppercase bg-slate-100">
                  <th className="py-3 px-4">MoSPI Regional Office & Location</th>
                  <th className="py-3 px-4">Sampling (STAT-SAMP)</th>
                  <th className="py-3 px-4">National Accounts (STAT-NAC)</th>
                  <th className="py-3 px-4">AI/ML Survey Validation (STAT-AIML)</th>
                  <th className="py-3 px-4">CAPI Tablet Operations (STAT-CAPI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {currentCadre.heatmap.map((row) => (
                  <tr key={row.office} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#9F3E07]" />
                        <span>{row.office}</span>
                      </div>
                      <span className="text-[11px] font-normal text-slate-400 ml-5">{row.state}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-mono ${getScoreColor(row.samp)}`}>
                        {row.samp}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-mono ${getScoreColor(row.nac)}`}>
                        {row.nac}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-mono ${getScoreColor(row.aiml)}`}>
                        {row.aiml}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-mono ${getScoreColor(row.capi)}`}>
                        {row.capi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Cadre Misconception Cluster & 1-Click Action */}
        <div className="heritage-card border-l-4 border-l-red-600 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="badge-mono badge-support text-[10px]">
                  <AlertTriangle size={11} className="inline mr-1" />
                  Critical Misconception Cluster
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  Affected: {currentCadre.misconception.affectedPercent}% Cadre Cohort ({currentCadre.misconception.affectedCount} Officers)
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {currentCadre.misconception.title}
              </h3>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                {currentCadre.misconception.explanation}
              </p>
            </div>

            <button
              onClick={() => setShowInterventionModal(true)}
              className="btn btn-primary text-xs shrink-0 py-2.5 px-4 shadow-sm flex items-center gap-2"
            >
              <Sparkles size={15} />
              <span>Dispatch 1-Click Intervention Group</span>
            </button>
          </div>
        </div>

        {/* 6. Intervention Group Modal */}
        {showInterventionModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
            data-lenis-prevent
          >
            <div 
              className="heritage-card max-w-lg w-full space-y-5 shadow-2xl bg-white border border-slate-200"
              data-lenis-prevent
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#9F3E07] text-white">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      Dispatch Targeted Intervention Group
                    </h3>
                    <p className="text-[11px] text-slate-500">NSSTA Training Committee Protocol • {currentCadre.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInterventionModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                    Target Cohort
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentCadre.misconception.affectedCount} Officers struggling with ${currentCadre.priorityGapsTopic}`}
                    className="input-field bg-slate-50 text-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                    Assigned Resource (iGOT Karmayogi / NSSTA TPAC)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentCadre.misconception.recommendedModule}
                    className="input-field bg-slate-50 text-slate-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                      Delivery Languages
                    </label>
                    <select className="input-field">
                      <option>Telugu & English (Bilingual)</option>
                      <option>Hindi & English (Bilingual)</option>
                      <option>Tamil & English (Bilingual)</option>
                      <option>Marathi & English (Bilingual)</option>
                      <option>All 5 Scheduled Languages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                      Completion Deadline
                    </label>
                    <input type="date" defaultValue="2026-09-14" className="input-field" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#9F3E07]" />
                    <span>Projected Outcome:</span>
                  </p>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    Adaptive reassessment automatically unlocks after completion. Projected cohort mastery score improves from <strong>{currentCadre.misconception.projectedGain}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="btn btn-outline text-xs h-9"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateIntervention}
                  className="btn btn-primary text-xs h-9 shadow-sm"
                >
                  Confirm & Dispatch Group
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
