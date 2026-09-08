'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  Building,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signupWithSupabase, isSupabaseConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [preferredLanguage, setPreferredLanguage] = useState('te');
  const [department, setDepartment] = useState('Field Operations Division (FOD), MoSPI');
  const [designation, setDesignation] = useState('Senior Statistical Officer (SSO)');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const user = await signupWithSupabase(email, password, fullName, role, preferredLanguage);
      setSuccessMsg('Registration successful! Enrolling in MoSPI Cadre Intelligence...');
      setTimeout(() => {
        if (user.role === 'teacher') {
          router.push('/teacher/insights');
        } else {
          router.push('/student/progress');
        }
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-[#FBFBFC]">
      <div className="max-w-lg w-full space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#9F3E07] border border-orange-200">
            <ShieldCheck size={14} className="text-[#9F3E07]" />
            <span>Official Cadre Onboarding • MoSPI & NSSTA</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#9F3E07] tracking-tight">
            Register Cadre Profile
          </h1>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Create your official credential for the AI-Enabled Statistical Skill Intelligence Platform.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="heritage-card space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
              Supabase Identity Provider
            </span>
            <span className={`badge-mono ${isSupabaseConfigured ? 'badge-online' : 'badge-waiting'}`}>
              {isSupabaseConfigured ? 'Cloud Connected' : 'Demo Mode Active'}
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-mono">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-mono flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Full Name
              </label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sunil Sharma"
                  className="input-field !pl-11 text-sm"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cadre Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="s.sharma@mospi.gov.in"
                  className="input-field !pl-11 text-sm"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Password
              </label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 chars"
                  className="input-field !pl-11 text-sm"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cadre Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="input-field text-sm"
              >
                <option value="student">Statistical Cadre (Learner / SSO / JSO)</option>
                <option value="teacher">Training Directorate / Supervisor (NSSTA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department / Regional Office
              </label>
              <div className="relative flex items-center">
                <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field !pl-11 text-sm"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Indic Subtitle Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="input-field text-sm"
              >
                <option value="te">Telugu (తెలుగు)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="en">English (Official)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="bn">Bengali (বাংলা)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              By enrolling, your profile will be provisioned in the offline IndexedDB cache and synced with the NSSTA Competency Directory for personalized iGOT Karmayogi course recommendations.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 font-semibold text-sm shadow-card"
          >
            {loading ? 'Creating Official Account...' : 'Complete Cadre Registration'}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link href="/login" className="text-xs text-[#9F3E07] font-semibold hover:underline">
              Log in to your workspace →
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
