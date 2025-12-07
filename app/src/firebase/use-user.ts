
'use client';

import { useEffect, useState } from 'react';
import { type User } from 'firebase/auth';
import { useAuth } from './provider';

export const useUser = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only subscribe if auth has been initialized by the provider.
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(userState => {
        setUser(userState);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      // If auth is not ready, we are still in a loading state.
      setLoading(true);
    }
  }, [auth]); // Rerun effect if auth instance changes

  return { user, loading };
};
