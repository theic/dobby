'use client';

import { getUserId } from '@/lib/localStorage';
import { useEffect } from 'react';

export default function UserIdProvider({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize userId on app start
    getUserId();
  }, []);

  return <>{children}</>;
}
