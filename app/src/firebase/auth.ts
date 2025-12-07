'use client';
import { getAuth, sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup, UserCredential, User, Auth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { initializeFirebase } from ".";

const getFirebaseInstances = () => {
    const { auth, db } = initializeFirebase();
    return { auth, db };
}

export const sendSignInLink = async (email: string) => {
    const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
    };
    const { auth } = getFirebaseInstances();
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
    const { auth } = getFirebaseInstances();
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
}

export const getOrCreateUser = async (user: User) => {
    const { db } = getFirebaseInstances();
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
