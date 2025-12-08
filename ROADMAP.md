# BuildNotBurn: System Roadmap

This document outlines the planned features and strategic initiatives for the BuildNotBurn application. It serves as a blueprint for evolving the system, focusing on features that enhance the core philosophy of sustainable productivity for creators.

---

## Phase 1: Core System & Brand Identity

### 1. Branding Page (`/branding`)
*   **Concept:** A single, public-facing page that centralizes all BuildNotBurn brand assets.
*   **Features:**
    *   Display the official color palette (Primary, Background, Accent, etc.) with corresponding HSL and HEX values.
    *   Showcase the application's typography (Oswald for headlines, Roboto Mono for body/code).
    *   Provide downloadable logo assets in both SVG (for scalability) and PNG (for ease of use) formats.
*   **Goal:** Ensure brand consistency and provide a quick reference for any marketing or design efforts.

### 2. "I Can, I Will, I Do" First Brick Email
*   **Concept:** An automated, celebratory email that is triggered the very first time a user lays a brick.
*   **Features:**
    *   A powerful, on-brand message congratulating the user on taking the first step.
    *   Reinforces the core concept: a single brick is the start of a great wall.
    *   Keeps the user engaged and validates their initial effort.
*   **Goal:** Convert initial user action into a feeling of accomplishment and commitment.

### 3. User Notes on Bricks
*   **Concept:** Allow users to add private notes or details to each brick.
*   **Features:**
    *   A small, unobtrusive icon on each brick item that reveals a text area on click.
    *   Notes are saved to the brick's data in Firestore.
    *   These notes could be for private reminders, links, or context that doesn't fit in the main brick title.
*   **Goal:** Add a layer of depth and utility to each task without cluttering the main UI.

---

## Phase 2: User Insights & Engagement

### 1. Administrator Wall
*   **Concept:** An internal dashboard for administrators to view user activity at a glance.
*   **Features:**
    *   A visual representation of all user walls (or a sample).
    *   A system to highlight users who show patterns of inconsistent usage (e.g., long gaps between laying bricks, many abandoned bricks).
*   **Goal:** Provide insights into user engagement and identify users who might benefit from a motivational "nudge."

### 2. Nudge Email System
*   **Concept:** A semi-automated system to re-engage users who are falling off.
*   **Features:**
    *   **User Preference:** A clear opt-in/opt-out toggle in the user's account settings for "Motivational Emails."
    *   **Content:** A pre-written array of positive, on-brand messages that can be used in email campaigns.
    *   **Integration:** Use Lemon Squeezy's email broadcast capabilities to send these messages.
    *   **Targeting:** Manually (at first) use data from the "Administrator Wall" to select a segment of inactive users to receive a nudge email.
*   **Goal:** Proactively combat churn and help users stay consistent.

### 3. User Context & Personas
*   **Concept:** Allow users to add personal context to their profile, which is then reflected visually on their wall.
*   **Features:**
    *   A simple profile setting where a user can select a "focus" or "persona" (e.g., Founder, Writer, Developer, Designer).
    *   This persona could add a small icon or color variation to their bricks or wall tooltips.
*   **Goal:** Personalize the experience and make the wall feel more representative of the user's identity and work.

---

## Phase 3: Advanced Features & Growth

### 1. "Care" Timer (Time Tracking)
*   **Concept:** A non-intrusive way for users to track the time and focus spent on each brick.
*   **Exploration Areas:**
    *   **Manual vs. Automatic:** Should a user manually start/stop a timer, or should we automatically track time when a brick is "active"?
    *   **Pomodoro Technique:** Could we offer optional, built-in Pomodoro timers (e.g., 25-minute focus blocks) that users can start for a specific brick?
    *   **Start/Stop State:** A brick could have states like "Queued," "In Progress," and "Completed," with the timer running during "In Progress."
*   **Goal:** Provide users with valuable data on where their focus is going, without adding stressful time-tracking overhead.

### 2. Affiliate Program
*   **Concept:** A growth-focused initiative to incentivize others to promote BuildNotBurn.
*   **Features:**
    *   Leverage a platform (could be Lemon Squeezy's built-in affiliate tools or a dedicated service) to manage affiliate links and payouts.
    *   Create a simple landing page for affiliates to sign up and get their unique links.
*   **Goal:** Drive organic growth and build momentum by empowering evangelists.
