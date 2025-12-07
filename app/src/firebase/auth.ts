'use client';
import type { Auth, User, UserCredential } from "firebase/auth";
import { GoogleAuthProvider, sendSignInLinkToEmail, signInWithPopup } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const sendSignInLink = async (auth: Auth, email: string) => {
    const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const signInWithGoogle = async (auth: Auth): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
}

export const getOrCreateUser = async (db: Firestore, user: User) => {
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
