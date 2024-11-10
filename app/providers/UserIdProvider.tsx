'use client';

import { auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useEffect } from 'react';

export default function UserIdProvider({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Sign in anonymously if no user is present
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initializeAuth();
  }, []);

  return <>{children}</>;
}
