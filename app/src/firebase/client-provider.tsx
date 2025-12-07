'use client';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { ReactNode } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// Initialize Firebase on the client-side. This will only run once.
const firebaseInstances = initializeFirebase();

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  if (!firebaseInstances) {
    // This can happen during server-side rendering or if initialization fails.
    // We render null to prevent children from trying to access Firebase prematurely.
    return null;
  }

  return (
    <FirebaseProvider value={firebaseInstances}>
      {children}
    </FirebaseProvider>
  );
}
