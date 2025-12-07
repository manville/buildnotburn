
'use client';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // Initialize Firebase on the client and update state
    const firebaseInstances = initializeFirebase();
    setInstances(firebaseInstances);
  }, []);

  // Don't render children until Firebase is initialized.
  // This renders a safe, static loading state on the server.
  if (!instances) {
    return (
       <div className="w-full min-h-screen flex items-center justify-center font-code text-muted-foreground">
          INITIALIZING SYSTEMS...
       </div>
    );
  }

  return (
    <FirebaseProvider value={instances}>
      {children}
    </FirebaseProvider>
  );
}
