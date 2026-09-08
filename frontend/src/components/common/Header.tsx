'use client';

import Link from 'next/link';
import { SyncIndicator } from './SyncIndicator';
import { useAuth } from '@/lib/auth';
import { LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-[var(--border-line)] bg-white/95 backdrop-blur-md sticky top-0 z-40 w-full transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Left-most corner: BhodBasha Logo & Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 text-decoration-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9F3E07] to-amber-600 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              బో
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-[#9F3E07] tracking-tight leading-none">
                BhodBasha
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                బోధభాష • Official Statistics
              </span>
            </div>
          </Link>

          {/* Navigation links for logged-in users */}
          {user && (
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
              {user.role === 'student' ? (
                <>
                  <Link href="/student/learn" className="text-[var(--text-charcoal)] hover:text-[#9F3E07] transition-colors">
                    Learn
                  </Link>
                  <Link href="/student/downloads" className="text-[var(--text-charcoal)] hover:text-[#9F3E07] transition-colors">
                    Offline Packages
                  </Link>
                  <Link href="/student/progress" className="text-[var(--text-charcoal)] hover:text-[#9F3E07] transition-colors">
                    Progress
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/teacher/insights" className="text-[var(--text-charcoal)] hover:text-[#9F3E07] transition-colors">
                    Cadre Insights
                  </Link>
                  <Link href="/teacher/assets" className="text-[var(--text-charcoal)] hover:text-[#9F3E07] transition-colors">
                    Curriculum Assets
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>

        {/* Right side: Sync Indicator + Log In / Register Buttons in the present right place */}
        <div className="flex items-center gap-3">
          <SyncIndicator />

          {/* User Profile or Login/Register Buttons */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-[var(--border-line)]">
              <span className="text-xs font-mono text-[var(--text-muted)] hidden md:inline">
                {user.full_name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="btn btn-outline text-xs p-2 min-h-0 h-8 hover:text-red-600"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-outline text-xs h-8 min-h-0 px-3 font-semibold hover:border-[#9F3E07]">
                Log In
              </Link>
              <Link href="/register" className="btn btn-primary text-xs h-8 min-h-0 px-3 font-semibold shadow-xs">
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
