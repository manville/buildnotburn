
# Firebase Configuration Guide

## Enabling Authentication Providers

To use Firebase Authentication, you must enable the sign-in providers you want to support in your application. The `auth/configuration-not-found` error indicates that a provider (like Google, Email/Password, etc.) has not been enabled yet.

### Steps to Enable Google Sign-In (and others):

1.  **Open your Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Select the project you are using for this application (your project ID is `studio-7548244915-aa0e7`).

2.  **Navigate to the Authentication Section:**
    *   In the left-hand navigation menu, click on **Build > Authentication**.

3.  **Go to the "Sign-in method" Tab:**
    *   Click the **Sign-in method** tab from the top navigation bar.

4.  **Enable Your Chosen Providers:**
    *   You will see a list of available sign-in providers.
    *   **For Google:** Click on **Google** in the list, toggle the **Enable** switch, provide a project support email, and click **Save**.
    *   **For Email/Password:** Click on **Email/Password**, toggle the **Enable** switch, and click **Save**. This is required for email link (passwordless) sign-in.

Once you enable these providers in the Firebase Console, the `auth/configuration-not-found` error will be resolved, and your users will be able to sign in.
