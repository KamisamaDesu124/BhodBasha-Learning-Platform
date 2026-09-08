'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import type { LearningPackage } from '@/lib/types';
import { syncManager } from '@/lib/sync';
import { 
  Download, 
  Trash2, 
  Play, 
  HardDrive, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  WifiOff,
  Database,
  ShieldCheck,
  Languages,
  Clock,
  Sparkles,
  BookOpen,
  Eye,
  X,
  FileCheck,
  Check
} from 'lucide-react';

export default function DownloadsPage() {
  const [packages, setPackages] = useState<LearningPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [reviewPackage, setReviewPackage] = useState<LearningPackage | null>(null);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const allPkgs = await db.packages.toArray();
      setPackages(allPkgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleDelete = async (assetId: string) => {
    await db.packages.delete(assetId);
    await loadPackages();
  };

  const handleSimulateDownload = async (pkgType: 'stat' | 'asuse') => {
    setLoading(true);
    if (pkgType === 'stat') {
      await db.packages.put({
        id: '1',
        asset_id: '1',
        title: "Modern Statistical Methodologies: Sampling, National Accounts & AI in Official Statistics",
        subject: "Official Statistics & MoSPI Methodologies",
        grade_level: "Senior Statistical Officer Cadre",
        duration_seconds: 2535,
        media_url: 'media/statistical_methodologies_demo.mp4',
        transcript_chunks: [
          { id: '1', start_time: 0, end_time: 25, text_en: "Foundational methodologies in India's official statistical system.", text_te: "భారతదేశ అధికారిక గణాంక వ్యవస్థలోని ప్రాథమిక పద్ధతులు.", text_hi: "भारत की आधिकारिक सांख्यिकीय प्रणाली की मूलभूत पद्धतियां।" },
          { id: '2', start_time: 842, end_time: 868, text_en: "Horvitz-Thompson estimator ensures unbiased total via inverse probability.", text_te: "హార్విట్జ్-థాంప్సన్ అంచనా విలోమ-సంభావ్యత ద్వారా నిష్పాక్షికమైన మొత్తాన్ని నిర్ధారిస్తుంది.", text_hi: "हॉर्विट्ज़-थॉम्पसन अनुमानक व्युत्क्रम-प्रायिकता के माध्यम से निष्पक्ष कुल सुनिश्चित करता है।" },
          { id: '3', start_time: 868, end_time: 910, text_en: "Implicit GDP Deflator operates as a Paasche index reflecting dynamic production weights.", text_te: "అంతర్గత జీడీపీ డిఫ్లేటర్ పాచే సూచికగా పనిచేస్తుంది.", text_hi: "अंतर्निहित जीडीपी डिफ्लेटर पाशे सूचकांक के रूप में कार्य करता है।" }
        ],
        subtitles: { en: [], te: [], hi: [] },
        concepts: [
          { id: "1", name: "Horvitz-Thompson Estimator", definition: "Ŷ = ∑ [ yᵢ / πᵢ ] weighted by inclusion probability πᵢ.", formula: "Ŷ = ∑ [ yᵢ / πᵢ ]" },
          { id: "2", name: "Implicit GDP Deflator", definition: "Ratio of Nominal GDP to Real GDP using Paasche dynamic weights.", formula: "Deflator = (Nominal GDP / Real GDP) × 100" }
        ],
        questions: [
          {
            id: "1",
            text: "What mathematically differentiates the Implicit GDP Deflator from the Consumer Price Index (CPI)?",
            options: [
              { id: "0", text: "A) CPI covers all capital goods." },
              { id: "1", text: "B) Deflator uses Paasche dynamic production weights, while CPI uses fixed Laspeyres basket." }
            ],
            correct_option_id: "1",
            explanation: "Deflator uses dynamic production weights (Paasche) whereas CPI uses a fixed basket (Laspeyres).",
            competency_id: "STAT-NAC-02"
          }
        ],
        downloaded_at: new Date().toISOString(),
        size_bytes: 14200000
      });
    } else {
      await db.packages.put({
        id: '2',
        asset_id: '2',
        title: "Annual Survey of Unincorporated Enterprises (ASUSE) - Field Supervisory Manual",
        subject: "ASUSE Field Operational Guidelines",
        grade_level: "Senior Statistical Officer Cadre",
        duration_seconds: 1980,
        media_url: 'media/asuse_field_manual_2026.pdf',
        transcript_chunks: [
          { id: '1', start_time: 0, end_time: 30, text_en: "ASUSE Field Manual: Unincorporated non-agricultural sector enumeration.", text_te: "ASUSE ఫీల్డ్ మాన్యువల్: అసంఘటిత వ్యవసాయేతర రంగ ఎన్యూమరేషన్.", text_hi: "ASUSE फील्ड मैनुअल: अनिगमित गैर-कृषि क्षेत्र गणना।" }
        ],
        subtitles: { en: [], te: [], hi: [] },
        concepts: [
          { id: "1", name: "Enterprise Gross Value Added", definition: "GVA = Gross Output − Intermediate Consumption." },
          { id: "2", name: "100% Upper Stratum Census Cutoff", definition: "Mandatory complete enumeration for units with 10+ workers (without power) or 20+ (with power)." }
        ],
        questions: [
          {
            id: "1",
            text: "Which establishment threshold mandates complete enumeration (census) in ASUSE?",
            options: [
              { id: "0", text: "A) Single-proprietor OAEs." },
              { id: "1", text: "B) 10+ workers without power or 20+ with power." }
            ],
            correct_option_id: "1",
            explanation: "Units with 10+ workers without power or 20+ with power must be 100% enumerated in the upper stratum.",
            competency_id: "STAT-SAMP-01"
          }
        ],
        downloaded_at: new Date().toISOString(),
        size_bytes: 6800000
      });
    }
    await loadPackages();
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    await syncManager.triggerManualSync();
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  const totalBytes = packages.reduce((sum, p) => sum + (p.size_bytes || 0), 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);
  const storagePercentage = ((totalBytes / (500 * 1024 * 1024)) * 100).toFixed(2);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBFC] py-10">
      <div className="heritage-container max-w-5xl space-y-8 animate-fade-in">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              <Database size={13} className="text-emerald-600" />
              <span>PWA IndexedDB Edge Persistence</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Offline Download Center
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Encrypted statistical training packages saved on this device. Fully reviewable and accessible in zero-connectivity field survey zones with automatic idempotent reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="btn btn-outline text-xs h-9 shadow-xs flex items-center gap-1.5 font-mono"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin text-[#9F3E07]' : ''} />
              <span>{isSyncing ? 'Reconciling...' : 'Force Sync Queue'}</span>
            </button>
            <Link
              href="/student/learn/1"
              className="btn btn-primary text-xs h-9 shadow-xs flex items-center gap-1.5"
            >
              <Play size={13} />
              <span>Open Player</span>
            </Link>
          </div>
        </div>

        {/* Quota & Storage Gauge Card */}
        <div className="heritage-card bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/90 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-[#2B4C7E] text-white shadow-xs">
                <HardDrive size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase text-slate-500 tracking-wider">
                    Browser Offline Cache Quota
                  </span>
                  <span className="badge-mono badge-online text-[10px]">IndexedDB Active</span>
                </div>
                <p className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                  {totalMb} MB{' '}
                  <span className="text-xs font-normal text-slate-500 font-mono">
                    of 500 MB Allocated
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-xs font-mono font-semibold text-slate-600">
                <span>Storage Utilization</span>
                <span className="text-[#9F3E07]">{storagePercentage}%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#9F3E07] rounded-full transition-all duration-500"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-right font-mono">
                {(500 - Number(totalMb)).toFixed(1)} MB available for field caching
              </p>
            </div>

          </div>
        </div>

        {/* Locally Cached Packages Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Locally Cached Packages ({packages.length})
              </h2>
              <span className="badge-mono badge-online text-[10px]">
                Encrypted & Persisted
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateDownload('stat')}
                className="text-xs text-[#9F3E07] hover:underline font-semibold flex items-center gap-1 font-mono"
              >
                <Download size={13} />
                <span>+ Cache Asset 1 (14.2 MB)</span>
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleSimulateDownload('asuse')}
                className="text-xs text-[#9F3E07] hover:underline font-semibold flex items-center gap-1 font-mono"
              >
                <Download size={13} />
                <span>+ Cache Asset 2 (6.8 MB)</span>
              </button>
            </div>
          </div>

          {packages.length === 0 ? (
            <div className="heritage-card text-center py-12 border-dashed border-2 border-slate-200 bg-white">
              <WifiOff size={36} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Packages Saved Offline Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Download official MoSPI modules to study during field survey assignments when mobile networks are unavailable.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleSimulateDownload('stat')}
                  className="btn btn-primary text-xs"
                >
                  <Download size={14} /> Download Asset 1 (14.2 MB)
                </button>
                <button
                  onClick={() => handleSimulateDownload('asuse')}
                  className="btn btn-outline text-xs"
                >
                  <Download size={14} /> Download Asset 2 (6.8 MB)
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="heritage-card border-l-4 border-l-emerald-600 bg-white hover:shadow-hover transition-all p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge-mono badge-online text-[10px]">
                          <CheckCircle2 size={11} className="inline mr-1" />
                          Ready Offline (Verified)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
                          {(pkg.size_bytes / (1024 * 1024)).toFixed(1)} MB
                        </span>
                        <span className="px-2 py-0.5 rounded bg-orange-50 text-[#9F3E07] font-mono text-[10px] font-semibold border border-orange-200">
                          {pkg.grade_level}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                        {pkg.title}
                      </h3>

                      <p className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Languages size={13} className="text-slate-400" />
                          <span>Telugu, Hindi, English, Tamil, Marathi Tracks</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          <span>{Math.floor(pkg.duration_seconds / 60)} Mins Content</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          Cached: {new Date(pkg.downloaded_at || Date.now()).toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                      <button
                        onClick={() => setReviewPackage(pkg)}
                        className="btn btn-outline text-xs py-2 px-3 shadow-xs flex items-center gap-1.5 text-slate-700"
                      >
                        <Eye size={13} />
                        <span>Review Offline</span>
                      </button>

                      <Link
                        href={`/student/learn/${pkg.asset_id}`}
                        className="btn btn-primary text-xs py-2 px-3.5 shadow-xs flex items-center gap-1.5"
                      >
                        <Play size={13} />
                        <span>Launch Player</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Delete from local cache"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Offline Review Modal */}
        {reviewPackage && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
            data-lenis-prevent
          >
            <div 
              className="heritage-card max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl bg-white border border-slate-200"
              data-lenis-prevent
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-600 text-white">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      Offline Package Review
                    </h3>
                    <p className="text-[11px] text-slate-500">IndexedDB Local Cache • Zero-Network Mode</p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewPackage(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">Package Title:</span>
                  <p className="font-serif font-bold text-base text-slate-900">{reviewPackage.title}</p>
                </div>

                {/* Cached Concepts */}
                {reviewPackage.concepts && reviewPackage.concepts.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <span className="font-mono uppercase text-[10px] text-[#2B4C7E] font-bold block">
                      Cached Formulas & Core Concepts:
                    </span>
                    {reviewPackage.concepts.map((c, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="font-bold text-slate-800">{c.name}</p>
                        <p className="text-slate-600 font-mono text-[11px]">{c.definition}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cached Transcripts */}
                {reviewPackage.transcript_chunks && reviewPackage.transcript_chunks.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
                      Cached Multilingual Transcripts ({reviewPackage.transcript_chunks.length} cues):
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {reviewPackage.transcript_chunks.map((t, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-mono text-[#9F3E07] font-bold">
                            Cue #{idx + 1} ({t.start_time}s)
                          </span>
                          <p className="text-slate-800">{t.text_en}</p>
                          {t.text_te && <p className="text-slate-600 italic">[TE]: {t.text_te}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cached Assessment */}
                {reviewPackage.questions && reviewPackage.questions.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2">
                    <span className="font-mono uppercase text-[10px] text-[#9F3E07] font-bold block">
                      Cached Offline Assessment Question:
                    </span>
                    <p className="font-bold text-slate-900">{reviewPackage.questions[0].text}</p>
                    <p className="text-[11px] text-slate-600">{reviewPackage.questions[0].explanation}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <Check size={14} /> 100% Validated Offline
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReviewPackage(null)}
                    className="btn btn-outline text-xs h-9"
                  >
                    Close Review
                  </button>
                  <Link
                    href={`/student/learn/${reviewPackage.asset_id}`}
                    className="btn btn-primary text-xs h-9 shadow-xs"
                  >
                    Launch Player
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
