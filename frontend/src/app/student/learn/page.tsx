'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LearnIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/student/learn/1');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm font-mono text-[var(--text-muted)]">Loading Statistical Learning Module...</p>
    </div>
  );
}
