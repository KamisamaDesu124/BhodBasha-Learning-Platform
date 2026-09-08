'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { LanguageCode } from '@/lib/types';
import { Languages, WifiOff, CheckCircle2, Building2, Briefcase } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updatePreferences } = useAuth();

  const [selectedLang, setSelectedLang] = useState<LanguageCode>(user?.preferred_language || 'te');
  const [designation, setDesignation] = useState('Senior Statistical Officer (SSO)');
  const [department, setDepartment] = useState('Field Operations Division (FOD), MoSPI');
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePreferences({
        preferred_language: selectedLang,
        low_bandwidth_mode: lowBandwidth,
      });
      router.push('/student/progress');
    } catch (err) {
      console.error(err);
      router.push('/student/progress');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-[var(--bg-parchment)]">
      <div className="heritage-container max-w-2xl">
        <div className="text-center space-y-3 mb-8">
          <span className="badge-mono badge-developing">MoSPI Cadre Onboarding</span>
          <h1 className="text-3xl font-bold font-serif text-[var(--text-charcoal)]">
            Official Profile & Language Setup
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Configure your official capacity-building preferences. Your selections personalize your iGOT Karmayogi learning path and offline subtitle tracks.
          </p>
        </div>

        <form onSubmit={handleSave} className="heritage-card space-y-8">
          {/* Language Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-serif font-bold text-[var(--text-charcoal)]">
              <Languages size={18} className="text-[var(--primary-terracotta)]" />
              1. Preferred Instruction & Subtitle Language
            </label>
            <p className="text-xs text-[var(--text-muted)]">
              All statistical lectures, quizzes, and concept cards will be localized into this language while preserving standard technical formulas and statistical notation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {([
                { id: 'te' as LanguageCode, label: 'Telugu', local: 'తెలుగు', badge: 'Active Regional Cadre' },
                { id: 'hi' as LanguageCode, label: 'Hindi', local: 'हिन्दी', badge: 'Official Language' },
                { id: 'en' as LanguageCode, label: 'English', local: 'English', badge: 'Source Standard' },
              ]).map((lang) => (
                <button
                  type="button"
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    selectedLang === lang.id
                      ? 'border-[var(--primary-terracotta)] bg-[var(--surface-low)] ring-2 ring-[var(--primary-terracotta)]/20'
                      : 'border-[var(--border-line)] bg-[var(--surface-lowest)] hover:border-[var(--border-active)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-lg text-[var(--text-charcoal)]">
                      {lang.label}
                    </span>
                    {selectedLang === lang.id && (
                      <CheckCircle2 size={18} className="text-[var(--primary-terracotta)]" />
                    )}
                  </div>
                  <p className="font-serif text-sm text-[var(--primary-terracotta)]">{lang.local}</p>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-2">
                    {lang.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cadre & Assignment Details */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-line)]">
            <label className="flex items-center gap-2 text-sm font-serif font-bold text-[var(--text-charcoal)]">
              <Briefcase size={18} className="text-[var(--secondary-indigo)]" />
              2. Designation & Statistical Cadre
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="input-field bg-[var(--surface-lowest)]"
                >
                  <option>Senior Statistical Officer (SSO)</option>
                  <option>Junior Statistical Officer (JSO)</option>
                  <option>Field Investigator (FI)</option>
                  <option>Assistant Director (AD)</option>
                  <option>Deputy Director (DD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1">
                  Department / Division
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field bg-[var(--surface-lowest)]"
                >
                  <option>Field Operations Division (FOD), MoSPI</option>
                  <option>National Accounts Division (NAD)</option>
                  <option>Data Quality & Survey Division (DQAD)</option>
                  <option>Economic Statistics Division (ESD)</option>
                  <option>State DES (Directorate of Economics & Statistics)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Low Bandwidth Mode */}
          <div className="p-4 rounded-xl border border-[var(--border-line)] bg-[var(--surface-low)] flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="p-2 rounded bg-[var(--secondary-indigo)] text-white shrink-0 mt-0.5">
                <WifiOff size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-charcoal)]">
                  Low-Bandwidth & Offline Mode
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Prefers lightweight WebVTT transcripts and compressed audio packages for field surveys with limited 2G/3G connectivity.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={lowBandwidth}
                onChange={(e) => setLowBandwidth(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--border-line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-terracotta)]"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full text-base py-3"
          >
            {saving ? 'Saving Profile...' : 'Save & Open Competency Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
