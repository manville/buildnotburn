# BuildNotBurn: System Roadmap

This document outlines the planned features and strategic initiatives for the BuildNotBurn application. It serves as a blueprint for evolving the system, focusing on features that enhance the core philosophy of sustainable productivity for creators.

---

## Phase 1: Core System & Brand Identity

*High-Impact, Low-Burn features that are foundational to the user experience.*

### 1. "I Can, I Will, I Do" First Brick Email
*   **Concept:** An automated, celebratory email that is triggered the very first time a user lays a brick. Reinforces the core concept: a single brick is the start of a great wall.
*   **Ideation:** This is a top-priority "Build" activity. The email validates the user's first real step and connects them to the philosophy. The message should be powerful and concise: "A wall is built one brick at a time. You just laid your first. Welcome, Builder."
*   **Implementation:** We can trigger this using a Firebase Cloud Function that listens for the creation of the first completed brick for a user. The function would then call a transactional email service (like Lemon Squeezy's API) to send the email.

### 2. User Notes on Bricks
*   **Concept:** Allow users to add private notes or details to each brick.
*   **Ideation:** This adds a crucial layer of "care" and context without the complexity of a full timer. It turns a simple task into a container for private thoughts, links, or reminders.
*   **Implementation:** Add an optional `notes: string` field to the `Brick` entity in Firestore. In the UI, a small, unobtrusive icon on the `BrickItem` would toggle a `<textarea>` that appears below it. The save would happen automatically on blur, providing a seamless experience.

### 3. Branding Page (`/branding`)
*   **Concept:** A single, public-facing page that centralizes all BuildNotBurn brand assets.
*   **Ideation:** A classic "Build" asset. It makes the brand feel solid, professional, and provides a utility for any future marketing or collaboration.
*   **Implementation:** A simple, static Next.js page at the `/branding` route. It would display the color palette (pulled from the Tailwind config), showcase the Oswald and Roboto Mono fonts, and provide downloadable SVG and PNG logo assets.

---

## Phase 2: User Insights & Engagement

*Medium-Impact, Medium-Burn features focused on sustainable growth and retention.*

### 1. User Context & Personas
*   **Concept:** Allow users to add personal context to their profile, which is then reflected visually on their wall.
*   **Ideation:** This personalizes the experience and helps users see themselves in the tool. Personas like "Founder," "Writer," "Developer," or "Designer" could add a small icon or a subtle color tint to tooltips on the Wall.
*   **Implementation:** Add a `persona: string` field to the `User` profile in Firestore. Users can select this from a predefined list in their account settings. The `Wall.tsx` component would then use this data to conditionally render an icon or apply a specific style.

### 2. Administrator Wall & Nudge Email System
*   **Concept:** An internal dashboard for administrators to view user activity and a system to re-engage users who are falling off.
*   **Ideation:** This is a powerful two-part system to proactively reduce churn. The key is to make the "nudge" feel like a supportive tap on the shoulder, not a nagging notification. A pre-written array of positive, on-brand messages is a great way to ensure consistency.
*   **Implementation:**
    *   **Admin Wall:** Create a new, protected route (e.g., `/admin`) that requires admin-level permissions. This page would fetch data on all users (requiring secure Firebase Admin rules) and highlight users who haven't laid a brick in over 7 days.
    *   **Nudge System:** The simplest MVP is manual. An admin could export a list of inactive user emails from the Admin Wall and use a broadcast service like Lemon Squeezy. The user must have a clear opt-in/opt-out toggle for "Motivational Emails" in their settings.

---

## Phase 3: Advanced Features & Growth

*High-Impact, High-Burn initiatives for a later stage, once the core system is thriving.*

### 1. "Care" Timer (Time Tracking)
*   **Concept:** A non-intrusive way for users to track the time and focus spent on each brick.
*   **Ideation:** This feature is powerful but must not add pressure. It should encourage focused work, not just track time. The best approach is a Pomodoro-style timer. A "Focus" button on a brick could start a 25-minute timer, reinforcing the idea of dedicating a solid block of energy to a task.
*   **Implementation:** A brick could have states like "Queued," "In Progress," and "Completed." The timer would run during the "In Progress" state. We would track "focus sessions" per brick in Firestore rather than tracking every second.

### 2. Affiliate Program
*   **Concept:** A growth-focused initiative to incentivize others to promote BuildNotBurn.
*   **Ideation:** A classic growth lever for when the product has strong word-of-mouth. This empowers evangelists to share the system.
*   **Implementation:** Lemon Squeezy has this functionality built-in, which is a significant advantage. The primary "work" is not technical but strategic: creating the marketing assets and guidelines for affiliates. This is a business "build" activity more than a code "build" activity at the start.
