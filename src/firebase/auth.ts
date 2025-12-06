
'use client';
import { getAuth, sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup, UserCredential, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { initializeFirebase } from ".";


export const sendSignInLink = async (email: string) => {
    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: `${window.location.origin}/login`,
        // This must be true.
        handleCodeInApp: true,
    };
    const auth = getAuth();
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
}

export const getOrCreateUser = async (user: User) => {
    const { db } = initializeFirebase();
    const userRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        // User is new, create a document for them.
        await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            plan: 'trial' // Default to trial on first login
        }, { merge: true });
    }
    // If user exists, we don't need to do anything.
    // The main page logic will load their existing plan.
}
