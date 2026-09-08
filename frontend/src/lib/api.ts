import type { AuthResponse, LearningPackage, AttemptSubmission, CompetencyScore, MisconceptionCluster, InterventionPlan } from './types';
import { db } from './db';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bhodbasha_token');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errBody;
      try {
        errBody = await res.json();
      } catch {
        errBody = { detail: res.statusText };
      }
      throw new ApiError(res.status, errBody.detail || 'API request failed', errBody);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    // Network failure / Offline fallback
    throw new ApiError(0, err.message || 'Network unreachable. Operating in offline mode.');
  }
}

// API functions with offline fallbacks
export const api = {
  // Auth
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const data = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('bhodbasha_token', data.access_token);
        localStorage.setItem('bhodbasha_user', JSON.stringify(data.user));
        await db.userCache.put({
          id: data.user.id,
          user: data.user,
          token: data.access_token,
          cached_at: new Date().toISOString()
        });
      }
      return data;
    } catch (err) {
      // Check offline cache
      const cached = await db.userCache.toCollection().first();
      if (cached && cached.user.email === credentials.email) {
        return { access_token: cached.token, token_type: 'bearer', user: cached.user };
      }
      throw err;
    }
  },

  async getCurrentUser() {
    try {
      return await apiRequest<any>('/auth/me');
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bhodbasha_user');
        if (stored) return JSON.parse(stored);
      }
      throw err;
    }
  },

  // Learning Packages & Offline Downloads
  async getPackage(assetId: string): Promise<LearningPackage> {
    // 1. Check local IndexedDB first
    const localPkg = await db.packages.where('asset_id').equals(assetId).first();
    if (localPkg) return localPkg;

    // 2. Fetch from backend if available
    const data = await apiRequest<LearningPackage>(`/assets/${assetId}/package`);
    return data;
  },

  async downloadAndStorePackage(assetId: string): Promise<LearningPackage> {
    const pkg = await apiRequest<LearningPackage>(`/assets/${assetId}/package`);
    pkg.downloaded_at = new Date().toISOString();
    await db.packages.put(pkg);
    return pkg;
  },

  async getStoredPackages(): Promise<LearningPackage[]> {
    return await db.packages.toArray();
  },

  async removeStoredPackage(id: string): Promise<void> {
    await db.packages.delete(id);
  },

  // Submit attempt (offline-first)
  async submitQuizAttempt(submission: AttemptSubmission): Promise<{ success: boolean; queued: boolean }> {
    // Save to IndexedDB immediately
    await db.attempts.put(submission);

    try {
      await apiRequest('/attempts/submit', {
        method: 'POST',
        body: JSON.stringify(submission),
      });
      // Mark synced locally
      submission.synced = true;
      await db.attempts.put(submission);
      return { success: true, queued: false };
    } catch {
      // Queue in sync queue for background reconciliation
      await db.syncQueue.add({
        idempotency_key: submission.idempotency_key,
        endpoint: '/attempts/submit',
        payload: submission,
        created_at: new Date().toISOString(),
        retries: 0
      });
      return { success: true, queued: true };
    }
  },

  // Teacher Endpoints
  async getTeacherOverview(): Promise<{
    active_students: number;
    competencies: CompetencyScore[];
    misconceptions: MisconceptionCluster[];
  }> {
    return await apiRequest('/analytics/teacher/overview');
  },

  async createIntervention(intervention: Partial<InterventionPlan>): Promise<InterventionPlan> {
    return await apiRequest('/interventions/create', {
      method: 'POST',
      body: JSON.stringify(intervention),
    });
  }
};
