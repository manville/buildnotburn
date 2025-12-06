# BuildNotBurn

This is the Next.js application for BuildNotBurn, the sustainable system for long-term creators. It's built with Next.js, Firebase, and Lemon Squeezy.

## The Philosophy

This application is the tool that powers the BuildNotBurn system. It's designed to help you focus on "building" tasks (Bricks) that create long-term assets, while mindfully managing "burning" tasks that drain your energy without creating lasting value.

## Getting Started

### 1. Configure Your Services

This project requires Firebase and Lemon Squeezy to function correctly. All the necessary setup steps, including creating products in Lemon Squeezy and generating Firebase service account credentials, are detailed in a single guide.

**Please follow the `LEMONSQUEEZY_SETUP_GUIDE.md` file in the root of this project.**

This will walk you through setting up all the required environment variables in your `.env` file.

### 2. Run the Development Server

Once your `.env` file is configured, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) with App Router
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
*   **Payments**: [Lemon Squeezy](https://lemonsqueezy.com/)
*   **AI/Flows**: [Genkit](https://firebase.google.com/docs/genkit)
*   **UI**: [React](https://react.dev/), [ShadCN/UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
