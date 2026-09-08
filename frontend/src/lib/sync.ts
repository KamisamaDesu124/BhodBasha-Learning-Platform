import { db, type SyncQueueItem } from './db';
import { apiRequest } from './api';
import type { SyncStatus } from './types';

type StatusListener = (status: SyncStatus) => void;

class SyncManager {
  private listeners: Set<StatusListener> = new Set();
  private isSyncing = false;
  private currentStatus: SyncStatus = {
    state: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online',
    pending_count: 0,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
      this.refreshPendingCount();
    }
  }

  public subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener);
    listener(this.currentStatus);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.currentStatus }));
  }

  private async handleOnline() {
    this.currentStatus.state = 'online';
    this.notify();
    await this.triggerSync();
  }

  private handleOffline() {
    this.currentStatus.state = 'offline';
    this.notify();
  }

  public async refreshPendingCount() {
    try {
      const count = await db.syncQueue.count();
      this.currentStatus.pending_count = count;
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        this.currentStatus.state = 'offline';
      } else if (count > 0 && this.currentStatus.state !== 'syncing') {
        this.currentStatus.state = 'offline'; // Or 'waiting'
      }
      this.notify();
    } catch {
      // IndexedDB might not be initialized yet
    }
  }

  public async triggerSync(): Promise<void> {
    if (this.isSyncing) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    this.isSyncing = true;
    this.currentStatus.state = 'syncing';
    this.notify();

    try {
      const items = await db.syncQueue.toArray();
      for (const item of items) {
        try {
          await apiRequest(item.endpoint, {
            method: 'POST',
            body: JSON.stringify(item.payload),
            headers: {
              'X-Idempotency-Key': item.idempotency_key,
            },
          });

          // Mark corresponding attempt as synced if applicable
          if (item.endpoint === '/attempts/submit') {
            const attempt = await db.attempts.get(item.idempotency_key);
            if (attempt) {
              attempt.synced = true;
              await db.attempts.put(attempt);
            }
          }

          // Remove from sync queue
          if (item.id) {
            await db.syncQueue.delete(item.id);
          }
        } catch (itemErr: any) {
          // Increment retry count
          if (item.id) {
            await db.syncQueue.update(item.id, {
              retries: (item.retries || 0) + 1,
              last_attempt: new Date().toISOString(),
              error: itemErr.message,
            });
          }
        }
      }

      const remaining = await db.syncQueue.count();
      this.currentStatus.pending_count = remaining;
      this.currentStatus.state = remaining === 0 ? 'synced' : 'offline';
      this.currentStatus.last_synced = new Date().toISOString();
    } catch (err: any) {
      this.currentStatus.state = 'error';
      this.currentStatus.error_message = err.message;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  public async enqueue(endpoint: string, payload: any, idempotency_key?: string): Promise<string> {
    const key = idempotency_key || `key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await db.syncQueue.add({
      idempotency_key: key,
      endpoint,
      payload,
      created_at: new Date().toISOString(),
      retries: 0
    });
    await this.refreshPendingCount();
    return key;
  }

  public async triggerManualSync(): Promise<void> {
    return this.triggerSync();
  }
}

export const syncManager = new SyncManager();
