
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';

// Store the instances in a module-level variable to ensure they are singletons.
let firebaseInstances: { app: FirebaseApp; auth: Auth; db: Firestore } | null = null;

export function initializeFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  // Return the existing instances if they have already been initialized.
  if (firebaseInstances) {
    return firebaseInstances;
  }
  
  const firebaseConfig = getFirebaseConfig();

  // On the server, Next.js might try to execute this code. If the env vars aren't
  // available during the build, we don't want to throw an error and crash the build.
  // The actual initialization will happen on the client.
  if (!firebaseConfig.apiKey) {
    // This is a graceful fallback for the server-side build process.
    // The client-side will have the env vars and initialize correctly.
    if (typeof window === 'undefined') {
      return null as any; // Prevent server build crash
    }
    // If we are on the client and config is still missing, then it's a real error.
    throw new Error('Missing Firebase config on the client. Please check your .env file.');
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  firebaseInstances = { app, auth, db };
  return firebaseInstances;
}

export { useUser } from './use-user';
export { FirebaseProvider, useFirebaseApp, useAuth, useFirestore, useFirebase } from './provider';
