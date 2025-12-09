
# BuildNotBurn: Brand & Identity Guide

This document is the official guide to the visual identity of the BuildNotBurn system. It ensures consistency and provides a reference for all brand assets.

---

## 1. Logo

The official logo is a vector-based SVG, ensuring it is scalable and sharp on all displays. It represents a brick (the "Build" task) protected within a flame-like shape (the "Burn" element being contained).

- **Primary Logo:** The SVG version should be used wherever possible. The canonical version is located in `src/components/buildnotburn/Logo.tsx`.
- **Usage:** The logo should be used with sufficient clear space and should not be altered, stretched, or recolored without a specific design system exception.

---

## 2. Color Palette

The color palette is designed to be focused, high-contrast, and professional. It uses HSL CSS variables for easy theming and is defined in `src/app/globals.css`.

### Core Colors

| Name                 | HSL Value      | HEX       | Description                                |
| -------------------- | -------------- | --------- | ------------------------------------------ |
| **Primary**          | `26 100% 50%`  | `#ff6b00` | The main action color. Used for buttons, active states, and highlights. |
| **Primary Foreground**| `0 0% 10%`     | `#1a1a1a` | Text color for elements with a primary background. |
| **Background**       | `0 0% 6%`      | `#0f0f0f` | The base background color for the application. |
| **Foreground**       | `0 0% 98%`     | `#fafafa` | The primary text color used on the main background. |

### UI Colors

| Name                 | HSL Value      | HEX       | Description                                |
| -------------------- | -------------- | --------- | ------------------------------------------ |
| **Card**             | `0 0% 10%`     | `#1a1a1a` | The background color for card elements.    |
| **Border**           | `0 0% 18%`     | `#2d2d2d` | The color for borders and separators.      |
| **Secondary**        | `0 0% 18%`     | `#2d2d2d` | A secondary background/UI element color.   |
| **Muted Foreground** | `0 0% 63.9%`   | `#a3a3a3` | For descriptive text and less important info. |
| **Accent**           | `0 0% 18%`     | `#2d2d2d` | Used for hover states and subtle accents.  |

---

## 3. Typography

The typography reinforces the dichotomy between creative vision (headline) and systematic execution (body/code). The fonts are loaded from Google Fonts in `src/app/layout.tsx`.

- **Headline Font:** `Oswald`
  - **Weight:** 700 (Bold)
  - **Style:** Uppercase, wide tracking.
  - **Usage:** Reserved for primary headings (`<h1>`, `<h2>`) and major titles to convey strength and importance.

- **Body & Code Font:** `Roboto Mono`
  - **Weight:** Regular
  - **Style:** Monospaced.
  - **Usage:** Used for all body copy, UI text, labels, and code-like elements to give the app a systematic, engineered feel.

