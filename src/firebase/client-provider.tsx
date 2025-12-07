
'use client';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { BuildNotBurnApp } from '@/app/buildnotburn-app';
import { Header } from '@/components/buildnotburn/Header';

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

  // Don't render children until Firebase is initialized
  if (!instances) {
    // Render a static loading shell that matches the app's layout
    // This prevents returning `null` which breaks the Next.js build.
    return (
       <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
        <Header user={null} plan={null} onLogout={() => {}} onOpenGuide={() => {}} onSignIn={() => {}} />
        <div className="w-full flex-grow flex items-center justify-center">
           <div className="text-center font-code text-muted-foreground">INITIALIZING SYSTEMS...</div>
        </div>
      </main>
    )
  }

  return (
    <FirebaseProvider value={instances}>
      {children}
    </FirebaseProvider>
  );
}
