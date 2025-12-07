
'use client';

import { useEffect, useState } from 'react';
import { type User } from 'firebase/auth';
import { useAuth } from './provider';

export const useUser = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Firebase might not be initialized yet by the provider
      setLoading(true);
      return;
    };

    const unsubscribe = auth.onAuthStateChanged(userState => {
      setUser(userState);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
};
