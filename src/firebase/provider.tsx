
'use client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initializeFirebase } from '.';

type FirebaseContextValue = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
};

const FirebaseContext = createContext<FirebaseContextValue>({ app: null, auth: null, db: null });

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    const firebaseInstances = initializeFirebase();
    setInstances(firebaseInstances);
  }, []);

  const contextValue = useMemo(() => {
    if (!instances) return { app: null, auth: null, db: null };
    return instances;
  }, [instances]);
  
  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext)?.app;
export const useAuth = () => useContext(FirebaseContext)?.auth;
export const useFirestore = () => useContext(FirebaseContext)?.db;
