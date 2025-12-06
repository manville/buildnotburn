
'use client';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `${window.location.origin}/login`,
  // This must be true.
  handleCodeInApp: true,
};

export const sendSignInLink = async (email: string) => {
    const auth = getAuth();
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};
