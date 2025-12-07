
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

  // Don't render children until Firebase is initialized on the client.
  // This renders a safe, static loading state on the server.
  if (!instances) {
    return (
       <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
          <div className="w-full flex-grow flex items-center justify-center">
             <div className="text-center font-code text-muted-foreground">INITIALIZING SYSTEMS...</div>
          </div>
        </main>
    );
  }

  return (
    <FirebaseProvider value={instances}>
      {children}
    </FirebaseProvider>
  );
}
