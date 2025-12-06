
'use client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { ReactNode, createContext, useContext } from 'react';

type FirebaseContextValue = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
};

const FirebaseContext = createContext<FirebaseContextValue>({ app: null, auth: null, db: null });

export function FirebaseProvider({ children, value }: { children: ReactNode, value: FirebaseContextValue }) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext)?.app;
export const useAuth = () => useContext(FirebaseContext)?.auth;
export const useFirestore = () => useContext(FirebaseContext)?.db;
