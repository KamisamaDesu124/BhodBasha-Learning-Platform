'use client';

import { useEffect, useState } from 'react';
import { syncManager } from '@/lib/sync';
import type { SyncStatus } from '@/lib/types';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export function SyncIndicator() {
  const [status, setStatus] = useState<SyncStatus>({ state: 'online', pending_count: 0 });

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsubscribe();
  }, []);

  const handleManualSync = () => {
    syncManager.triggerSync();
  };

  if (status.state === 'syncing') {
    return (
      <div className="badge-mono badge-waiting" title="Syncing pending changes...">
        <RefreshCw size={14} className="animate-spin" />
        <span>Syncing...</span>
      </div>
    );
  }

  if (status.pending_count > 0) {
    return (
      <button 
        onClick={handleManualSync}
        className="badge-mono badge-waiting cursor-pointer hover:opacity-80"
        title="Click to sync offline changes"
      >
        <CloudOff size={14} />
        <span>Saved offline ({status.pending_count})</span>
      </button>
    );
  }

  if (status.state === 'offline') {
    return (
      <div className="badge-mono badge-offline" title="Operating offline">
        <CloudOff size={14} />
        <span>Offline Mode</span>
      </div>
    );
  }

  if (status.state === 'synced') {
    return (
      <div className="badge-mono badge-online" title="All changes synced">
        <CheckCircle2 size={14} />
        <span>Synced</span>
      </div>
    );
  }

  return (
    <div className="badge-mono badge-online" title="Online connection active">
      <Cloud size={14} />
      <span>Online</span>
    </div>
  );
}
