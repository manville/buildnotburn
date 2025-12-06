'use client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

type FirebaseContextValue = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
};

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    // Initialize Firebase on the client
    const firebaseInstances = initializeFirebase();
    setInstances(firebaseInstances);
  }, []);

  const contextValue = useMemo(() => {
    if (!instances) return { app: null, auth: null, db: null };
    return instances;
  }, [instances]);
  
  return (
    <FirebaseProvider value={contextValue}>
      {children}
    </FirebaseProvider>
  );
}
