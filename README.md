# COLLEXA: Autonomous AI Career Intelligence & Multimodal Telemetry Mock Interview Simulator

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash%20AI-8E75B2.svg?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **COLLEXA** is a production-grade, full-stack AI career intelligence platform and live mock interview simulator engineered to bridge the gap between academic preparation and high-bar industry technical hiring. It couples multimodal client-side telemetry (speech cadence, verbal filler-word tracking, posture/gaze heuristics) with Google Gemini generative models, an automated Google XYZ resume auditor, and verifiable proof-of-work skill roadmaps.

---

## 🌟 Key Features

### 1. 🎙️ Autonomous AI Mock Interview Simulator with Live Telemetry
- **Multi-Track & Adaptive Difficulty**: Conducts rigorous interviews across **Software Engineering**, **Generative AI & LLMs**, **Product Design**, and **Product Management** with *Easy*, *Medium*, and *Hard* progression.
- **Multimodal Real-Time Telemetry**:
  - **Speech Cadence**: Calculates speech rate in **Words Per Minute (WPM)** using browser-native Web Speech API.
  - **Lexical Filler Detection**: Real-time counter capturing verbal crutches (*"um"*, *"like"*, *"basically"*).
  - **Presence & Posture Scoring**: Heuristic computer vision assessing camera gaze stability and physical posture alignment.
  - **Audio Waveform Canvas**: Real-time decibel amplitude visualization using the Web Audio API.
- **Multi-Dimensional Diagnostics**: Generates granular post-interview rubrics assessing Technical Depth, Communication Delivery, and Physical Presence.

### 2. 📄 Intelligent Resume & ATS Auditor (Google XYZ Formula)
- Evaluates raw resume bullet points against modern enterprise Applicant Tracking Systems (ATS).
- Automatically rewrites passive bullet points into high-impact accomplishments using **Google's XYZ framework**:
  > *"Accomplished [X] as measured by [Y] by doing [Z]"*
- Recommends power action verbs and flags high-frequency industry keyword gaps.

### 3. 🧭 AI Career Counselor & Mentorship Copilot
- Context-aware advisory covering leveling progressions (**Junior → Senior → Staff → Principal**).
- Salary, compensation bands, and equity/RSU negotiation frameworks for domestic (INR) and global (USD) markets.
- Generates dynamic, milestone-driven **30-60-90 Day Strategic Placement Sprints**.

### 4. 🗺️ Unified Skill Roadmaps & Proof-of-Work Verification
- Structured pathways covering Full-Stack Architecture, Data Science & AI, and Cloud Infrastructure.
- Requires candidates to submit verifiable **Proof-of-Work** deliverables (GitHub repositories, deployment URLs) before unlocking subsequent milestones.

### 5. 🎓 Verified Free Industry Certification Directory
- Curated catalog indexing zero-cost, recognized credentials from **AWS**, **Google Cloud**, **Meta**, and **DeepLearning.AI**.
- Built-in credential claim tracking and verification badge showcase.

---

## 🛠️ Architecture & Tech Stack

```
+-------------------------------------------------------------------------+
|                         PRESENTATION TIER                               |
|   React 19 + TypeScript + Tailwind CSS 4 + Motion + Web Audio API       |
|   [Live Interview UI]   [Resume Auditor]   [Career Chat]   [Roadmaps]   |
+------------------------------------+------------------------------------+
                                     |  HTTPS / REST / JSON
+------------------------------------v------------------------------------+
|                         APPLICATION TIER                                |
|              Node.js + Express 4 + Google Gemini SDK Engine             |
|   - Multi-Tier Model Fallback (gemini-2.5-flash -> flash-lite -> 3.8)  |
|   - Real-time Telemetry Normalizer & Lexical Filler Analyzer            |
+------------------------------------+------------------------------------+
                                     |  PostgreSQL Wire / RLS
+------------------------------------v------------------------------------+
|                      DATA & STORAGE TIER (Supabase)                     |
|   - PostgreSQL 15+ (profiles, interview_sessions, user_roadmap_progress)|
|   - Strict Row Level Security (RLS) Policies on all tables              |
|   - Ephemeral S3 Bucket for Media Recordings (14-day auto-purge)        |
+-------------------------------------------------------------------------+
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Motion (`motion/react` v12), Lucide React, Sonner, Canvas Confetti |
| **Backend** | Node.js, Express 4.21, TypeScript, `tsx`, `esbuild` |
| **AI / LLM Engine** | Google Gemini API (`@google/genai` v2.4.0) with multi-tier model fallback |
| **Database & Auth** | Supabase (PostgreSQL 15+, Google OAuth, Row Level Security, Triggers) |
| **Media & Telemetry**| Web Audio API, Web Speech API, MediaStream API, Supabase Storage |

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.x or v20.x LTS) — [Download Node.js](https://nodejs.org/)
- **npm** (bundled with Node.js)
- A modern web browser (**Google Chrome** or **Microsoft Edge** recommended for Web Audio/Speech APIs)

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/COLLEXA.git
cd COLLEXA
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000

# Google Gemini API Key (Optional: project includes intelligent offline fallback generators)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (Optional for local mock mode, required for cloud sync)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application
Start the unified Express + Vite development server:
```bash
npm run dev
```

### 5. Access the Web App
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 📦 Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Express server with Vite middleware on port 3000 in development mode |
| `npm run build` | Compiles TypeScript, builds the Vite production bundle, and packages `server.ts` via esbuild |
| `npm start` | Executes the production-bundled server (`dist/server.cjs`) |
| `npm run lint` | Runs TypeScript compiler checks without emitting code |
| `npm run clean` | Cleans up the `dist` directory |

---

## 🔒 Security & Privacy Architecture
- **Row-Level Security (RLS)**: Enforced across all Supabase PostgreSQL tables; users can only read and write their own profile, sessions, and transcripts.
- **Ephemeral Media Storage**: Audio and video telemetry recordings are isolated in private storage buckets and subjected to an automated 14-day purge cycle.
- **Cascading Account Deletion**: Users maintain full data autonomy with a one-click cascading delete option that purges their profile, interview recordings, and counseling transcripts.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
