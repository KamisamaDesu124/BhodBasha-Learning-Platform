'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Play,
  Layers, 
  ChevronRight, 
  RefreshCw, 
  Eye,
  ShieldCheck,
  Sparkles,
  FileCheck,
  DownloadCloud,
  Check,
  AlertCircle,
  X,
  BookOpen,
  Video,
  Plus,
  ArrowRight,
  Database
} from 'lucide-react';

export interface LearningAssetItem {
  id: number;
  title: string;
  format: string;
  duration: string;
  status: string;
  stageLabel: string;
  conceptsExtracted: number;
  questionsGenerated: number;
  languages: string[];
  packageSize: string;
  date: string;
  sourceDoc: string;
}

const DEFAULT_ASSETS: LearningAssetItem[] = [
  {
    id: 1,
    title: "Modern Statistical Methodologies: Sampling, National Accounts & AI in Official Statistics",
    format: "MP4 Video Lecture",
    duration: "42:15 Mins",
    status: "ready",
    stageLabel: "Ready for Cadre Review",
    conceptsExtracted: 3,
    questionsGenerated: 5,
    languages: ["Telugu (తెలుగు)", "Hindi (हिन्दी)", "English", "Tamil (தமிழ்)", "Marathi (मराठी)"],
    packageSize: "14.2 MB",
    date: "2026-09-07",
    sourceDoc: "MoSPI Technical Lecture Series 2026 / NSSO 77th Round Calibration"
  },
  {
    id: 2,
    title: "Annual Survey of Unincorporated Enterprises (ASUSE) - Field Supervisory Manual",
    format: "PDF Document (48 Pages)",
    duration: "48 Pages Handbook",
    status: "ready",
    stageLabel: "Ready for In-Service Study",
    conceptsExtracted: 6,
    questionsGenerated: 12,
    languages: ["Telugu (తెలుగు)", "Hindi (हिन्दी)", "English", "Tamil (தமிழ்)", "Marathi (मराठी)"],
    packageSize: "6.8 MB",
    date: "2026-09-06",
    sourceDoc: "MoSPI ASUSE 2026 Operational Guidelines, Chapter 4 (Enterprise Classification)"
  }
];

const OFFICIAL_STANDARDS = [
  {
    id: 'plfs',
    title: "Periodic Labour Force Survey (PLFS): Weighting & Multi-Stage Sampling",
    filename: "PLFS_Sampling_Weighting_Calibration_Guide.mp4",
    format: "MP4 Video Lecture",
    duration: "38:20 Mins",
    sourceDoc: "MoSPI PLFS Methodology & NSS 77th Round Standard",
    size: "12.4 MB",
    concepts: 5,
    questions: 8
  },
  {
    id: 'nic',
    title: "National Industrial Classification (NIC-2008) Enterprise Code Standardization",
    filename: "National_Industrial_Classification_NIC_2008.pdf",
    format: "PDF Technical Handbook (64 Pages)",
    duration: "64 Pages Handbook",
    sourceDoc: "MoSPI Economic Statistics Division & CSO Guidelines",
    size: "8.2 MB",
    concepts: 4,
    questions: 10
  },
  {
    id: 'iip',
    title: "Index of Industrial Production (IIP): Factory Data Imputation & Outlier Trapping",
    filename: "MoSPI_IIP_Imputation_Protocol_2026.pdf",
    format: "PDF Technical Handbook (36 Pages)",
    duration: "36 Pages Handbook",
    sourceDoc: "MoSPI Industrial Statistics Wing (ISW), Kolkata",
    size: "5.5 MB",
    concepts: 4,
    questions: 6
  }
];

export default function TeacherAssetsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<LearningAssetItem[]>(DEFAULT_ASSETS);
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [modalTab, setModalTab] = useState<'standard' | 'upload'>('standard');
  const [customTitle, setCustomTitle] = useState('');
  const [customFormat, setCustomFormat] = useState('MP4 Video Lecture');
  const [customSource, setCustomSource] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Pipeline Execution State
  const [uploading, setUploading] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [activeProcessingTitle, setActiveProcessingTitle] = useState('');

  const pipelineStages = [
    "Stage 1/19: Validating MoSPI Statistical Document Integrity & Checksum...",
    "Stage 3/19: Running OCR & Parsing Mathematical Formulations (Horvitz-Thompson & Paasche)...",
    "Stage 6/19: Semantic Chunking & Indic-Whisper Acoustic Diarization...",
    "Stage 9/19: Extracting Official Cadre Competencies (STAT-SAMP, STAT-NAC, STAT-AIML)...",
    "Stage 12/19: IndicTrans2 Translation to Telugu, Hindi, Tamil & Marathi...",
    "Stage 15/19: Generating Time-Synchronized WebVTT Subtitle Tracks & Statistical Glossaries...",
    "Stage 18/19: AI Synthesizing Source-Grounded Checkpoint MCQs with Manual Page Citations...",
    "Stage 19/19: Packaging Encrypted Offline Bundle & Publishing to Directorate Cadre!"
  ];

  // Load persisted assets if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bhodbasha_learning_assets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setAssets(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveAssets = (newAssets: LearningAssetItem[]) => {
    setAssets(newAssets);
    try {
      localStorage.setItem('bhodbasha_learning_assets', JSON.stringify(newAssets));
    } catch (e) {
      console.error(e);
    }
  };

  const startPipeline = (title: string, format: string, sourceDoc: string, duration: string, size: string, concepts: number, questions: number) => {
    setShowIngestModal(false);
    setUploading(true);
    setActiveProcessingTitle(title);
    setPipelineProgress(10);
    setCurrentStageIndex(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < pipelineStages.length) {
        setCurrentStageIndex(stage);
        setPipelineProgress(Math.round(((stage + 1) / pipelineStages.length) * 100));
      } else {
        clearInterval(interval);
        setPipelineProgress(100);

        const newId = assets.length > 0 ? Math.max(...assets.map(a => a.id)) + 1 : 1;
        const newAsset: LearningAssetItem = {
          id: newId,
          title,
          format,
          duration,
          status: "ready",
          stageLabel: format.includes("Video") ? "Ready for Cadre Review" : "Ready for In-Service Study",
          conceptsExtracted: concepts,
          questionsGenerated: questions,
          languages: ["Telugu (తెలుగు)", "Hindi (हिन्दी)", "English", "Tamil (தமிழ்)", "Marathi (मराठी)"],
          packageSize: size,
          date: new Date().toISOString().split('T')[0],
          sourceDoc
        };

        const updated = [newAsset, ...assets];
        saveAssets(updated);

        setTimeout(() => {
          setUploading(false);
          setPipelineProgress(0);
        }, 1200);
      }
    }, 550);
  };

  const handleStandardIngest = (std: typeof OFFICIAL_STANDARDS[0]) => {
    startPipeline(
      std.title,
      std.format,
      std.sourceDoc,
      std.duration,
      std.size,
      std.concepts,
      std.questions
    );
  };

  const handleCustomIngest = () => {
    const title = customTitle.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ") : "New MoSPI Statistical Asset");
    const format = customFormat;
    const sourceDoc = customSource.trim() || "MoSPI Verified Field Training Material";
    const duration = format.includes("Video") ? "32:00 Mins" : "40 Pages Handbook";
    const size = format.includes("Video") ? "11.8 MB" : "5.4 MB";
    startPipeline(title, format, sourceDoc, duration, size, 4, 8);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCustomTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      setCustomFormat(file.name.endsWith(".mp4") ? "MP4 Video Lecture" : "PDF Document Handbook");
      setCustomSource(`Uploaded File: ${file.name} (MoSPI Verified)`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBFC] py-10">
      <div className="heritage-container max-w-5xl space-y-8 animate-fade-in">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2B4C7E] border border-blue-200 mb-2">
              <ShieldCheck size={13} className="text-[#2B4C7E]" />
              <span>MoSPI Content Ingestion Engine</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Curriculum Assets & AI Localization Pipeline
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-1">
              Upload statistical training materials (MP4, PDF, DOCX). The 19-stage pipeline automatically extracts competencies, produces multilingual audio/subtitles in 5 scheduled languages, and synthesizes source-grounded quizzes.
            </p>
          </div>

          <Link href="/teacher/insights" className="btn btn-outline text-xs h-9 shadow-xs flex items-center gap-1.5">
            <span>View Cadre Insights</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Real File Input (Hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".mp4,.pdf,.docx,.pptx"
          className="hidden"
        />

        {/* Primary Interactive Upload Box */}
        <div className="heritage-card border-2 border-dashed border-slate-300 bg-white p-8 text-center space-y-4 shadow-sm hover:border-[#9F3E07] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#9F3E07] mx-auto flex items-center justify-center shadow-xs">
            <UploadCloud size={28} />
          </div>
          
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-xl text-slate-900">
              Upload New MoSPI Statistical Training Material
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Supports video lectures (MP4), survey manuals (PDF), or presentations (PPTX). Automatically grounded in official statistical guidelines.
            </p>
          </div>

          {/* Action Button: Opens Interactive Modal */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowIngestModal(true)}
              disabled={uploading}
              className="btn btn-primary text-xs py-3 px-6 shadow-sm flex items-center gap-2 text-sm font-semibold"
            >
              <Sparkles size={16} />
              <span>Select & Ingest Statistical Asset</span>
            </button>
          </div>

          {/* 19-Stage Progress Bar Overlay */}
          {uploading && (
            <div className="mt-6 p-5 rounded-xl border border-orange-200 bg-orange-50/60 text-left space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#9F3E07] flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-[#9F3E07]" />
                  <span>AI Ingestion: {activeProcessingTitle}</span>
                </span>
                <span className="font-bold text-slate-700">{pipelineProgress}%</span>
              </div>

              <div className="h-2.5 bg-white rounded-full overflow-hidden border border-orange-200 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#9F3E07] rounded-full transition-all duration-300"
                  style={{ width: `${pipelineProgress}%` }}
                />
              </div>

              <p className="text-xs font-mono text-slate-700 font-medium">
                {pipelineStages[currentStageIndex]}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-orange-200/60">
                <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                  <Check size={13} className="text-emerald-600" /> MoSPI Schema Validated
                </span>
                <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                  <Check size={13} className="text-emerald-600" /> IndicTrans2 (5 Langs)
                </span>
                <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                  <Check size={13} className="text-emerald-600" /> Horvitz-Thompson Parsed
                </span>
                <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                  <Check size={13} className="text-emerald-600" /> Source MCQs Generated
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Ingest Studio Modal */}
        {showIngestModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
            data-lenis-prevent
          >
            <div 
              className="heritage-card max-w-2xl w-full space-y-5 shadow-2xl bg-white border border-slate-200"
              data-lenis-prevent
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#9F3E07] text-white">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      MoSPI Curriculum Ingestion Studio
                    </h3>
                    <p className="text-[11px] text-slate-500">19-Stage Grounding & Localization Pipeline</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIngestModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalTab('standard')}
                  className={`flex-1 py-2.5 text-xs font-mono font-bold transition-all border-b-2 ${
                    modalTab === 'standard'
                      ? 'border-[#9F3E07] text-[#9F3E07] bg-orange-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1-Click MoSPI Standard Ingestion
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('upload')}
                  className={`flex-1 py-2.5 text-xs font-mono font-bold transition-all border-b-2 ${
                    modalTab === 'upload'
                      ? 'border-[#9F3E07] text-[#9F3E07] bg-orange-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Upload Custom Local File (MP4/PDF)
                </button>
              </div>

              {/* Modal Content */}
              {modalTab === 'standard' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Select an official National Statistical System curriculum manual ready for automated AI grounding and multi-language synthesis:
                  </p>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {OFFICIAL_STANDARDS.map((std) => (
                      <div
                        key={std.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-orange-50/40 hover:border-orange-200 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="badge-mono badge-online text-[9px]">{std.format}</span>
                            <span className="text-[10px] font-mono text-slate-500">{std.size}</span>
                          </div>
                          <h4 className="text-sm font-serif font-bold text-slate-900 leading-snug">
                            {std.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 italic">
                            Source: {std.sourceDoc}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStandardIngest(std)}
                          className="btn btn-primary text-xs py-2 px-3 shrink-0 shadow-xs flex items-center gap-1.5"
                        >
                          <Plus size={13} />
                          <span>Ingest Asset</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'upload' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                      Choose File (MP4 Video, PDF Document, PPTX)
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center cursor-pointer hover:border-[#9F3E07] transition-all bg-slate-50"
                    >
                      <UploadCloud size={24} className="mx-auto text-[#9F3E07] mb-1" />
                      <p className="font-semibold text-slate-700">
                        {selectedFile ? selectedFile.name : "Click to browse local file from device"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">MP4, PDF, DOCX, PPTX (Max 150 MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                        Asset Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sampling Weighting Guide"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                        Format
                      </label>
                      <select
                        value={customFormat}
                        onChange={(e) => setCustomFormat(e.target.value)}
                        className="input-field"
                      >
                        <option>MP4 Video Lecture</option>
                        <option>PDF Document Handbook</option>
                        <option>Interactive Survey Manual</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                      Official Source Citation / Division
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MoSPI FOD Field Operational Guidelines 2026"
                      value={customSource}
                      onChange={(e) => setCustomSource(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <Sparkles size={12} className="text-[#9F3E07]" />
                      <span>Pipeline will synthesize:</span>
                    </p>
                    <p className="text-[11px]">
                      • 5 Scheduled Languages (Telugu, Hindi, English, Tamil, Marathi)
                      <br />• OCR Mathematical Formulations (LaTeX)
                      <br />• AI Source-Grounded Test Assessment Questions
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowIngestModal(false)}
                      className="btn btn-outline text-xs h-9"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCustomIngest}
                      className="btn btn-primary text-xs h-9 shadow-sm"
                    >
                      Start 19-Stage AI Ingestion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Processed Learning Assets List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Processed Learning Assets ({assets.length})
              </h2>
              <span className="badge-mono badge-online text-[10px]">
                All Packages Verified
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Each asset has distinct curriculum, quizzes, and localized tracks
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="heritage-card border-l-4 border-l-[#2B4C7E] bg-white p-5 shadow-sm hover:shadow-hover transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge-mono badge-online text-[10px]">
                        <CheckCircle2 size={11} className="inline mr-1" />
                        {asset.stageLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
                        {asset.format}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2B4C7E] font-mono text-[10px] font-semibold">
                        {asset.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                      {asset.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 italic">
                      {asset.sourceDoc}
                    </p>
                  </div>

                  {/* Distinct Learner Link per Asset */}
                  <Link
                    href={`/student/learn/${asset.id}`}
                    className="btn btn-outline text-xs py-2 px-3.5 shadow-xs flex items-center gap-1.5 shrink-0 hover:border-[#9F3E07] hover:text-[#9F3E07]"
                  >
                    <Eye size={13} />
                    <span>Preview as Learner</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Extracted Concepts</span>
                    <span className="font-bold text-slate-800">{asset.conceptsExtracted} Core Topics</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Generated MCQs</span>
                    <span className="font-bold text-slate-800">{asset.questionsGenerated} Source-Grounded</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Available Languages</span>
                    <span className="font-bold text-[#9F3E07]">
                      {asset.languages.slice(0, 2).join(', ')}, English
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Offline Package Size</span>
                    <span className="font-bold text-emerald-700">{asset.packageSize}</span>
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
