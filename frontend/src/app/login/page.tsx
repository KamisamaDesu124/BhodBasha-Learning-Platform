'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Mail, 
  Lock, 
  Building2, 
  CheckCircle2, 
  Cloud,
  FileText
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { 
    login, 
    loginWithSupabase, 
    signupWithSupabase, 
    quickLogin, 
    isSupabaseConfigured 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'quick' | 'supabase' | 'signup'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const user = await loginWithSupabase(email, password);
      setSuccessMsg('Authentication successful! Redirecting...');
      setTimeout(() => {
        if (user.role === 'teacher' || user.role === 'admin') {
          router.push('/teacher/insights');
        } else {
          router.push('/student/progress');
        }
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Supabase authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const user = await signupWithSupabase(email, password, fullName, role);
      setSuccessMsg('Account registered with Supabase! Redirecting to workspace...');
      setTimeout(() => {
        if (user.role === 'teacher') {
          router.push('/teacher/insights');
        } else {
          router.push('/student/progress');
        }
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Check password requirements.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (selectedRole: 'student' | 'teacher') => {
    setLoading(true);
    try {
      const u = quickLogin(selectedRole);
      if (u.role === 'teacher') {
        router.push('/teacher/insights');
      } else {
        router.push('/student/progress');
      }
    } catch (e: any) {
      setError(e?.message || 'Quick login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-[#FBFBFC]">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>Official Statistical Cadre • MoSPI & NSSTA</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#9F3E07] tracking-tight">
            BhodBasha Portal
          </h1>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            AI Skill Intelligence & Offline Learning System integrated with iGOT Karmayogi
          </p>
        </div>
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setActiveTab('quick'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-white text-[#9F3E07] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={14} />
            <span>1-Click Demo</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('supabase'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'bg-white text-[#2B4C7E] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud size={14} />
            <span>Supabase Login</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound size={14} />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Status Alerts */}
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

        {/* TAB 1: 1-Click Prototype Demo Roles */}
        {activeTab === 'quick' && (
          <div className="heritage-card space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono font-semibold uppercase text-slate-500 tracking-wider">
                Select Official Cadre Persona:
              </p>
              <span className="badge-mono badge-online">Instant Access</span>
            </div>

            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={loading}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#9F3E07] hover:shadow-hover transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-orange-100 text-[#9F3E07]">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Sunil Sharma (SSO)</p>
                  <p className="text-xs text-slate-500">Senior Statistical Officer · MoSPI FOD Hyderabad</p>
                  <p className="text-[11px] text-amber-700 font-mono mt-0.5">Learner: Progress, Offline Player, Quizzes</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-[#9F3E07] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('teacher')}
              disabled={loading}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#2B4C7E] hover:shadow-hover transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 text-[#2B4C7E]">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Dr. Ananya Rao (Director)</p>
                  <p className="text-xs text-slate-500">Training Directorate · NSSTA Greater Noida</p>
                  <p className="text-[11px] text-blue-700 font-mono mt-0.5">Supervisor: Cadre Heatmap, Interventions</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-[#2B4C7E] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Ideal for judge presentations: pre-populated with 24 Cadre officers and active misconception data.
            </div>
          </div>
        )}

        {/* TAB 2: Supabase Email/Password Login */}
        {activeTab === 'supabase' && (
          <form onSubmit={handleSupabaseLogin} className="heritage-card space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                Supabase Cloud Auth
              </span>
              <span className={`badge-mono ${isSupabaseConfigured ? 'badge-online' : 'badge-waiting'}`}>
                {isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Email (gov.in or registered)
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@mospi.gov.in"
                  className="input-field !pl-11"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field !pl-11"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 font-semibold text-sm"
            >
              {loading ? 'Authenticating with Supabase...' : 'Sign In via Supabase'}
            </button>

            <div className="text-center text-xs text-slate-500">
              Secured with Supabase JWT & Row-Level Security.
            </div>
          </form>
        )}

        {/* TAB 3: Supabase New User Sign Up */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSupabaseSignup} className="heritage-card space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                New Cadre Registration
              </span>
              <span className="badge-mono badge-developing">Supabase Cloud</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name & Cadre Title
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ravi Varma, Senior Statistical Officer"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ravi.varma@mospi.gov.in"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cadre Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="input-field text-sm"
              >
                <option value="student">Statistical Cadre Officer (Learner / Field Enumerator)</option>
                <option value="teacher">Training Directorate / Supervisor (NSSTA / MoSPI)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 font-semibold text-sm"
            >
              {loading ? 'Creating Supabase Account...' : 'Register with Supabase'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link href="/" className="text-xs text-[#9F3E07] hover:underline font-medium">
            ← Return to MoSPI Official Landing Portal
          </Link>
        </div>

      </div>
    </div>
  );
}
