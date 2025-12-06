'use client';
import { getAuth, sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup, UserCredential, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { initializeFirebase } from ".";


export const sendSignInLink = async (email: string) => {
    const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
    };
    const { auth } = initializeFirebase();
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
    const { auth } = initializeFirebase();
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
}

export const getOrCreateUser = async (user: User) => {
    const { db } = initializeFirebase();
    const userRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            plan: 'trial'
        }, { merge: true });
    }
}
