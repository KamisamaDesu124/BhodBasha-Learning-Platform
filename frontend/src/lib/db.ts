import Dexie, { type EntityTable } from 'dexie';
import type { LearningPackage, AttemptSubmission, User } from './types';

export interface SyncQueueItem {
  id?: number;
  idempotency_key: string;
  endpoint: string;
  payload: any;
  created_at: string;
  retries: number;
  last_attempt?: string;
  error?: string;
}

const db = new Dexie('BhodBashaOfflineDB') as Dexie & {
  packages: EntityTable<LearningPackage, 'id'>;
  attempts: EntityTable<AttemptSubmission, 'idempotency_key'>;
  syncQueue: EntityTable<SyncQueueItem, 'id'>;
  userCache: EntityTable<{ id: string; user: User; token: string; cached_at: string }, 'id'>;
};

// Schema versioning
db.version(1).stores({
  packages: 'id, asset_id, subject, grade_level, downloaded_at',
  attempts: 'idempotency_key, student_id, asset_id, question_id, synced, timestamp',
  syncQueue: '++id, idempotency_key, endpoint, created_at, retries',
  userCache: 'id, cached_at'
});

export { db };
