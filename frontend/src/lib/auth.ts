'use client';

import { useState, useEffect } from 'react';
import type { User, Role } from './types';
import { api } from './api';
import { supabase, isSupabaseConfigured } from './supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabase, setIsSupabase] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    setIsSupabase(isSupabaseConfigured());

    // Check local storage first
    const stored = localStorage.getItem('bhodbasha_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('bhodbasha_user');
      }
    }

    // Also check active Supabase session if configured
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const supaUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: meta.full_name || session.user.email?.split('@')[0] || 'MoSPI Officer',
            role: (meta.role as Role) || 'student',
            preferred_language: meta.preferred_language || 'te',
            low_bandwidth_mode: false,
            created_at: session.user.created_at || new Date().toISOString(),
          };
          setUser(supaUser);
          localStorage.setItem('bhodbasha_user', JSON.stringify(supaUser));
        }
      }).catch(console.error);

      // Listen for auth state changes from Supabase
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const meta = session.user.user_metadata || {};
            const supaUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: meta.full_name || session.user.email?.split('@')[0] || 'MoSPI Officer',
              role: (meta.role as Role) || 'student',
              preferred_language: meta.preferred_language || 'te',
              low_bandwidth_mode: false,
              created_at: session.user.created_at || new Date().toISOString(),
            };
            setUser(supaUser);
            localStorage.setItem('bhodbasha_user', JSON.stringify(supaUser));
          } else if (_event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('bhodbasha_user');
            localStorage.removeItem('bhodbasha_token');
          }
        }
      );

      setLoading(false);
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithSupabase = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Supabase did not return user credentials');
    }

    const meta = data.user.user_metadata || {};
    const supaUser: User = {
      id: data.user.id,
      email: data.user.email || email,
      full_name: meta.full_name || email.split('@')[0] || 'Statistical Officer',
      role: (meta.role as Role) || 'student',
      preferred_language: meta.preferred_language || 'te',
      low_bandwidth_mode: false,
      created_at: data.user.created_at || new Date().toISOString(),
    };

    localStorage.setItem('bhodbasha_token', data.session?.access_token || 'supa_token');
    localStorage.setItem('bhodbasha_user', JSON.stringify(supaUser));
    setUser(supaUser);
    return supaUser;
  };

  const signupWithSupabase = async (
    email: string,
    password: string,
    fullName: string,
    role: Role = 'student',
    preferredLanguage: string = 'te'
  ): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          preferred_language: preferredLanguage,
        },
      },
    });

    if (error) {
      throw error;
    }

    const supaUser: User = {
      id: data.user?.id || `supa_${Date.now()}`,
      email,
      full_name: fullName,
      role,
      preferred_language: preferredLanguage as any,
      low_bandwidth_mode: false,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem('bhodbasha_token', data.session?.access_token || 'supa_token');
    localStorage.setItem('bhodbasha_user', JSON.stringify(supaUser));
    setUser(supaUser);
    return supaUser;
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      return res.user;
    } catch (err) {
      // If local server unreachable or offline, attempt Supabase if configured
      if (isSupabaseConfigured()) {
        return await loginWithSupabase(email, password);
      }
      throw err;
    }
  };

  const quickLogin = (role: 'student' | 'teacher'): User => {
    let mockUser: User;
    if (role === 'student') {
      mockUser = {
        id: '1',
        email: 'sunil.sharma@mospi.gov.in',
        full_name: 'Sunil Sharma (SSO)',
        role: 'student',
        preferred_language: 'te',
        low_bandwidth_mode: false,
        created_at: new Date().toISOString(),
      };
    } else {
      mockUser = {
        id: '2',
        email: 'ananya.rao@nssta.gov.in',
        full_name: 'Dr. Ananya Rao (NSSTA Director)',
        role: 'teacher',
        preferred_language: 'te',
        low_bandwidth_mode: false,
        created_at: new Date().toISOString(),
      };
    }

    localStorage.setItem('bhodbasha_token', 'demo_jwt_token_2026');
    localStorage.setItem('bhodbasha_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signout notice:', e);
    }
    localStorage.removeItem('bhodbasha_token');
    localStorage.removeItem('bhodbasha_user');
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const updatePreferences = async (prefs: Partial<User>): Promise<User | null> => {
    if (!user) return null;
    const updated = { ...user, ...prefs };
    localStorage.setItem('bhodbasha_user', JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  return {
    user,
    loading,
    login,
    loginWithSupabase,
    signupWithSupabase,
    quickLogin,
    logout,
    updatePreferences,
    isAuthenticated: !!user,
    isSupabaseConfigured: isSupabase,
  };
}
