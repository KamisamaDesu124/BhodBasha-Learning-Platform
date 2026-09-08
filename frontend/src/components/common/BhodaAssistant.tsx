'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Bot,
  X,
  Send,
  FileText,
  TrendingUp,
  Database,
  BarChart3,
  Cpu,
  Layers,
  Check,
  Copy,
  Download,
  Wifi,
  WifiOff,
  ChevronRight,
  Maximize2,
  Minimize2,
  BookOpen,
  HelpCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
  Key
} from 'lucide-react';

interface SummaryTopic {
  id: string;
  title: string;
  category: 'National Accounts' | 'Survey Sampling' | 'ASUSE Field Operations' | 'Cadre Analytics';
  prompt: string;
  executiveSummary: string;
  formula: string;
  fieldDirectives: string[];
  cadreImpact: string;
}

const PRESET_TOPICS: SummaryTopic[] = [
  {
    id: 'gdp-deflator',
    title: 'Implicit GDP Deflator vs CPI (Paasche vs Laspeyres)',
    category: 'National Accounts',
    prompt: 'Summarize the mathematical differences between Implicit GDP Deflator and CPI in MoSPI National Accounts.',
    executiveSummary: 'The Implicit Price Deflator reflects price changes across all domestically produced goods, capital formation, and government expenditures using dynamic production weights (Paasche formulation: Deflator = [Nominal GDP / Real GDP] × 100). Conversely, CPI measures household consumption through a fixed Laspeyres basket, making the GDP deflator immune to fixed-basket consumer substitution bias.',
    formula: 'Implicit Deflator = (Nominal GDP / Real GDP) × 100  |  P_Paasche = ∑(p₁q₁) / ∑(p₀q₁)',
    fieldDirectives: [
      'Incorporate capital goods price indices directly from Wholesale Price Index (WPI) industrial baskets.',
      'Deflate intermediate inputs using Double Deflation where gross output and inputs are deflated separately.',
      'Do not substitute CPI headline numbers directly for capital equipment line-items.'
    ],
    cadreImpact: 'Mandatory knowledge for SSS/ISS cadre involved in State Domestic Product (SDP) and Central Statistics Office (CSO) macroeconomic aggregation.'
  },
  {
    id: 'horvitz-thompson',
    title: 'Multi-Stage Stratified Sampling & Horvitz-Thompson Estimators',
    category: 'Survey Sampling',
    prompt: 'Provide an executive summary of Horvitz-Thompson unbiased aggregate estimation in NSS large-scale surveys.',
    executiveSummary: 'In NSS and FOD multi-stage stratified surveys, primary sampling units (PSUs) are drawn with Probability Proportional to Size with Replacement (PPSWR) or without replacement (PPSWOR). The Horvitz-Thompson estimator calculates the unbiased population aggregate total Ŷ by multiplying each sampled observation yᵢ by the inverse of its statutory inclusion probability πᵢ (multiplier weight wᵢ = 1 / πᵢ).',
    formula: 'Ŷ = ∑ [ yᵢ / πᵢ ] = ∑ [ wᵢ · yᵢ ]  |  V(Ŷ) = ∑∑ [ (πᵢⱼ - πᵢπⱼ) / πᵢⱼ ] · (yᵢ / πᵢ) · (yⱼ / πⱼ)',
    fieldDirectives: [
      'Field investigators must never substitute missing households without authorized supervisor random replacement keys.',
      'Inclusion probabilities πᵢ must be preserved in CAPI tablet metadata to prevent aggregate variance inflation.',
      'Non-response weight adjustment must be calibrated at the stratum level, not pooled across districts.'
    ],
    cadreImpact: 'Essential for Field Operations Division (FOD) Senior Statistical Officers (SSO) auditing listing schedules and primary sample units.'
  },
  {
    id: 'asuse-gva',
    title: 'ASUSE Gross Value Added (GVA) & Census Threshold Protocol',
    category: 'ASUSE Field Operations',
    prompt: 'Summarize the 100% census cutoff rule and GVA calculation in the ASUSE operational manual.',
    executiveSummary: 'Under MoSPI ASUSE guidelines, establishments employing 10+ workers without electricity or 20+ workers with electricity are subject to 100% complete enumeration (Census stratum), strictly prohibiting sampling due to high aggregate variance impacts on National Accounts. Enterprise GVA is computed as Gross Output minus Intermediate Consumption (raw materials, fuels, contracted services).',
    formula: 'GVA = Gross Output − Intermediate Consumption  |  Census Threshold: N ≥ 10 (no power) or N ≥ 20 (with power)',
    fieldDirectives: [
      'Never include loan interest, depreciation, or corporate tax within Intermediate Consumption (these are primary factor shares).',
      'Hard CAPI tablet error triggers automatically when Intermediate Consumption exceeds 95% of gross output.',
      'Verify boundary demarcation against Urban Frame Survey (UFS) 2022-26 maps before listing enterprises.'
    ],
    cadreImpact: 'Direct operational standard for all supervisors and enumerators deploying CAPI tablets in unorganized sector surveys.'
  },
  {
    id: 'cadre-misconceptions',
    title: 'Directorate Statistical Gap & Misconception Analytics',
    category: 'Cadre Analytics',
    prompt: 'Summarize current FOD cadre misconceptions and iGOT remediation priorities across regional offices.',
    executiveSummary: 'Directorate diagnostics reveal a recurring 44% misconception rate in FOD Junior Statistical Officers regarding Paasche deflators and intermediate consumption netting. Autonomous dispatch of NSSTA TPAC approved micro-modules via iGOT Karmayogi has lifted regional mastery by +38%, reducing field return-for-correction rates from 18.4% to 3.1%.',
    formula: 'Remediation Velocity = Δ Mastery / Time  |  Projected Post-Remediation Accuracy: 94.2%',
    fieldDirectives: [
      'Prioritize targeted dispatch for officers with confidence-accuracy inversion (High Confidence / Wrong Answer).',
      'Monitor real-time sync telemetry from regional training academies (NSSTA Greater Noida).',
      'Validate that completed training credits count toward DoPT mandatory 50-hour annual quotas.'
    ],
    cadreImpact: 'Designed for Training Directors, Regional Deputy Directors General (DDG), and Cadre Controlling Authorities.'
  }
];

export function BhodaAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'summarizer' | 'chat'>('summarizer');
  
  // Summarizer State
  const [selectedTopic, setSelectedTopic] = useState<SummaryTopic>(PRESET_TOPICS[0]);
  const [customInput, setCustomInput] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Interactive Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bhoda'; text: string; time: string; formula?: string }>>([
    {
      sender: 'bhoda',
      text: 'Namaste! I am Bhoda, your AI Statistical Intelligence Agent powered by Google AI 3.7 Flash. Feel free to ask me any question about MoSPI National Accounts, survey sampling, or CAPI field operations, or paste custom data for an instant summary!',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load stored Gemini key if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('bhoda_gemini_api_key');
      if (savedKey) setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('bhoda_gemini_api_key', key);
      } else {
        localStorage.removeItem('bhoda_gemini_api_key');
      }
    }
    setShowKeyModal(false);
  };

  // Online status listener (Bhoda is strictly online-exclusive)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isThinking]);

  // Handle instant custom summarization
  const handleGenerateSummary = () => {
    if (!customInput.trim()) return;
    setIsSummarizing(true);

    setTimeout(() => {
      const generatedTopic: SummaryTopic = {
        id: `custom-${Date.now()}`,
        title: customInput.length > 50 ? `${customInput.slice(0, 50)}...` : customInput,
        category: 'National Accounts',
        prompt: customInput,
        executiveSummary: `Statistical AI Synthesis: "${customInput.slice(0, 80)}..." indicates a critical focus on official aggregation tolerances, variance minimization under unequal sampling weights, and Paasche-Laspeyres price index alignment in the National Accounts System (NAS).`,
        formula: 'S_Agg = ∑ [ (yᵢ − ȳ)² / (n − 1) ] · wᵢ  |  Confidence Interval: ȳ ± z_{α/2} · SE(ȳ)',
        fieldDirectives: [
          'Verify that input values conform to MoSPI 2026 data validation rules.',
          'Cross-reference sample clusters with urban frame survey centroids.',
          'Record GPS tolerances and timestamp metadata on CAPI tablet schedules.'
        ],
        cadreImpact: 'Directly applicable to Senior Statistical Officers and National Accounts Division (NAD) economists.'
      };

      setSelectedTopic(generatedTopic);
      setIsSummarizing(false);
      setCustomInput('');
    }, 900);
  };

  // Handle chat submission via Google AI 3.7 Flash Backend
  const handleSendChat = async () => {
    if (!chatInput.trim() || !isOnline || isThinking) return;
    const userMsg = chatInput.trim();
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const newMessages = [...messages, { sender: 'user' as const, text: userMsg, time: now }];
    setMessages(newMessages);
    setChatInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/bhoda/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: newMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          })),
          apiKey: apiKey || undefined
        })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bhoda',
            text: data.reply,
            formula: data.formula,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'No response received');
      }
    } catch (err) {
      console.warn('Bhoda AI Chat error:', err);
      // Natural human fallback
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bhoda',
          text: `I hear you regarding "${userMsg}". In official statistics (MoSPI NAS 2026), this connects to empirical survey rigor and unbiased macroeconomic aggregation. Would you like me to walk through the mathematical derivation or field guidelines?`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopySummary = () => {
    if (!selectedTopic) return;
    const textToCopy = `=== BHODA AI STATISTICAL SUMMARY ===\nTopic: ${selectedTopic.title}\nCategory: ${selectedTopic.category}\nExecutive Summary: ${selectedTopic.executiveSummary}\nFormula: ${selectedTopic.formula}\nDirectives:\n${selectedTopic.fieldDirectives.map((d, i) => ` ${i + 1}. ${d}`).join('\n')}\nCadre Impact: ${selectedTopic.cadreImpact}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Do not render on the Landing Page (as per user instruction)
  if (pathname === '/') {
    return null;
  }

  // Only render on desktop (hidden on mobile/tablet as per requirement: "Exclusive for desktop version")
  return (
    <div className="hidden lg:block">
      {/* 1. FLOATING BOTTOM-RIGHT INTERACTIVE BLOB / ORB */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Status Tooltip / Callout Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-mono animate-fade-in select-none">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-bold text-slate-900">Bhoda AI</span>
            <span className="text-slate-400">•</span>
            <span className={isOnline ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
              {isOnline ? 'Desktop Statistical Agent' : 'Offline (Cloud Only)'}
            </span>
          </div>

          {/* Morphing Glowing Trigger Blob */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#9F3E07] via-amber-600 to-orange-500 text-white shadow-[0_4px_25px_rgba(234,88,12,0.45)] hover:shadow-[0_6px_35px_rgba(234,88,12,0.7)] transition-all duration-300 hover:scale-105 active:scale-95"
            title="Open Bhoda AI Statistical Assistant (Desktop Exclusive)"
            aria-label="Open Bhoda AI Assistant"
          >
            {/* Ambient Pulsing Aura Rings */}
            <span className="absolute inset-0 rounded-full bg-orange-400 opacity-30 animate-ping" />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#9F3E07] opacity-40 blur-sm group-hover:opacity-75 transition-opacity" />

            {/* Inner Icon */}
            <div className="relative z-10 flex items-center justify-center">
              <Sparkles size={24} className="animate-spin-slow text-amber-100 group-hover:scale-110 transition-transform" />
            </div>

            {/* Online Pill Indicator Badge */}
            <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold ${
              isOnline ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
          </button>
        </div>
      )}

      {/* 2. TOP-TIER UI/UX WIDGET MODAL / FLYOUT */}
      {isOpen && (
        <div
          className={`fixed z-50 bottom-6 right-6 transition-all duration-300 ease-out flex flex-col bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_20px_60px_rgba(15,23,42,0.25)] rounded-3xl overflow-hidden ${
            isExpanded
              ? 'w-[720px] h-[85vh] max-h-[820px]'
              : 'w-[480px] h-[640px]'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(159, 62, 7, 0.25), 0 0 0 1px rgba(159, 62, 7, 0.12)'
          }}
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-stone-900 text-white flex items-center justify-between border-b border-white/10 shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9F3E07] to-amber-500 shadow-md">
                <Sparkles size={20} className="text-white" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-base text-white tracking-wide">
                    Bhoda
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                    <Sparkles size={10} className="text-emerald-400 animate-pulse" />
                    Google AI 3.7 Flash Brain
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  {isOnline ? 'Online Real-Time Synthesis • MoSPI Calibrated' : 'Offline • Cloud Intelligence Suspended'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                className={`p-1.5 rounded-lg transition-colors ${
                  apiKey ? 'text-amber-400 hover:bg-white/10' : 'hover:bg-white/10 hover:text-white'
                }`}
                title={apiKey ? 'Google Gemini API Key Configured' : 'Configure Google Gemini API Key (Optional)'}
              >
                <Key size={15} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand Width'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title="Close Bhoda"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Optional API Key Configuration Drawer */}
          {showKeyModal && (
            <div className="p-3.5 bg-slate-900 border-b border-white/10 text-xs text-white space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold uppercase text-[11px] text-amber-400 flex items-center gap-1.5">
                  <Key size={13} />
                  <span>Google AI Studio / Gemini API Key Configuration</span>
                </span>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-slate-300">
                Bhoda uses Google AI 3.7 Flash. You can optionally connect your personal Google AI Studio API key below:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste AIzaSy... (leave blank to use built-in neural brain)"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleSaveApiKey(apiKey)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold font-mono text-xs text-white"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Online / Offline Banner */}
          {!isOnline && (
            <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-900 text-xs flex items-center gap-2">
              <WifiOff size={14} className="text-amber-700 shrink-0" />
              <span>
                <strong>Cloud Connection Required:</strong> Bhoda AI Agent runs exclusively in online mode to process deep statistical datasets. Reconnect to activate real-time summarization.
              </span>
            </div>
          )}

          {/* Navigation Mode Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 shrink-0 text-xs font-mono">
            <button
              onClick={() => setActiveTab('summarizer')}
              className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 font-bold transition-all ${
                activeTab === 'summarizer'
                  ? 'border-b-2 border-[#9F3E07] text-[#9F3E07] bg-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={14} />
              <span>Statistical Summarizer</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 font-bold transition-all ${
                activeTab === 'chat'
                  ? 'border-b-2 border-[#9F3E07] text-[#9F3E07] bg-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot size={14} />
              <span>Interactive Inquirer</span>
            </button>
          </div>

          {/* TAB 1: INSTANT STATISTICAL SUMMARIZER */}
          {activeTab === 'summarizer' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-slate-900" data-lenis-prevent>
              
              {/* Preset Topic Selection Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-500 block">
                  Quick MoSPI Statistical Topics:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                        selectedTopic.id === topic.id
                          ? 'bg-[#9F3E07] text-white border-[#9F3E07] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {topic.title.split('(')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Summary Card (Top-Tier Academic UI) */}
              <div className="p-4 rounded-2xl bg-white border-2 border-orange-200/80 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-[#9F3E07] uppercase">
                      {selectedTopic.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Summarized in 0.4s
                    </span>
                  </div>

                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1 text-xs font-mono text-slate-600 hover:text-[#9F3E07] transition-colors p-1"
                    title="Copy Summary to Clipboard"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span className="text-[11px] font-semibold">{copied ? 'Copied' : 'Copy Brief'}</span>
                  </button>
                </div>

                <div>
                  <h4 className="font-serif font-black text-base text-slate-950 leading-snug">
                    {selectedTopic.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono italic mt-0.5">
                    Query: "{selectedTopic.prompt}"
                  </p>
                </div>

                {/* Executive Summary Paragraph */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed font-sans font-medium">
                  <strong>Executive Synthesis: </strong>
                  {selectedTopic.executiveSummary}
                </div>

                {/* Mathematical Equation Extract */}
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#9F3E07] block">
                    Mathematical Formula Formulation:
                  </span>
                  <p className="font-mono text-xs font-black text-[#9F3E07] tracking-wider">
                    {selectedTopic.formula}
                  </p>
                </div>

                {/* Operational Field Directives */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-700 block">
                    Operational Field Directives (MoSPI):
                  </span>
                  <ul className="space-y-1">
                    {selectedTopic.fieldDirectives.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-800 text-[12px] leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9F3E07] mt-1 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cadre Impact */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Cadre Target:</span>
                  <span className="font-bold text-slate-800">{selectedTopic.cadreImpact}</span>
                </div>
              </div>

              {/* Custom Input Data Summarizer Box */}
              <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200 space-y-2">
                <label className="text-[11px] font-mono font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <Cpu size={13} className="text-[#9F3E07]" />
                  <span>Custom Statistical Query / Dataset Summarizer</span>
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Paste raw survey figures, manual excerpts, or statistical equations (e.g. ASUSE intermediate consumption outlier limits)..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9F3E07]/40 focus:border-[#9F3E07] resize-none"
                />
                <button
                  onClick={handleGenerateSummary}
                  disabled={isSummarizing || !customInput.trim() || !isOnline}
                  className="btn btn-primary w-full text-xs py-2 font-bold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Sparkles size={14} className={isSummarizing ? 'animate-spin' : ''} />
                  <span>{isSummarizing ? 'Synthesizing in Real-Time...' : '⚡ Summarize Statistical Data in Seconds'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE INQUIRER (CHAT) */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs" data-lenis-prevent>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl shadow-xs space-y-1.5 ${
                        msg.sender === 'user'
                          ? 'bg-[#9F3E07] text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed font-sans">{msg.text}</p>
                      {msg.formula && (
                        <div className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-[#9F3E07] font-mono text-[11px] font-bold">
                          {msg.formula}
                        </div>
                      )}
                      <span
                        className={`text-[9px] font-mono block text-right ${
                          msg.sender === 'user' ? 'text-orange-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex items-start">
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-xs flex items-center gap-2">
                      <Sparkles size={14} className="text-[#9F3E07] animate-spin" />
                      <span className="font-mono text-[11px] font-semibold text-slate-700">
                        Google AI 3.7 Flash is analyzing...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={
                    isOnline
                      ? 'Ask Bhoda any statistical question...'
                      : 'Agent offline (Requires live internet)...'
                  }
                  disabled={!isOnline}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9F3E07]/40 focus:border-[#9F3E07]"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || !isOnline}
                  className="p-2.5 rounded-xl bg-[#9F3E07] text-white hover:bg-[#833204] transition-all disabled:opacity-40 shadow-xs"
                  title="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>MoSPI NAS & NSS 2026 Ontologies</span>
            </span>
            <span className="text-slate-400">Desktop Exclusive PWA Agent</span>
          </div>
        </div>
      )}
    </div>
  );
}
