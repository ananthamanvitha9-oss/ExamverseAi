# Examverse AI - Project Specification

## Project Name
**Examverse AI**

## Purpose
An AI-powered EdTech platform designed to provide highly personalized, scalable, and adaptive learning experiences for competitive exam preparation. The platform will bridge the gap between static study material and dynamic, AI-assisted tutoring and assessment.

## Target Users
Aspirants preparing for competitive examinations in India, including but not limited to:
- UPSC (Union Public Service Commission)
- SSC (Staff Selection Commission)
- Banking (IBPS, SBI)
- Railways (RRB)
- Engineering & Medical (JEE, NEET)
- State PSCs (APPSC, TSPSC)

## Core Features
- **Intelligent Assessment:** Dynamic mock tests with deep analytics, negative marking, and performance tracking.
- **AI Tutoring:** Conversational AI tutor to clarify doubts, explain complex topics, and provide contextual help based on the student's current learning module.
- **Personalized Study Plans:** AI-generated, adaptive study schedules targeting weak subjects based on mock test results.
- **Curriculum Hierarchy:** Deeply nested, modular curriculum structure (Exams > Subjects > Chapters > Lessons).
- **Gamification & Tracking:** Study streaks, progress tracking, and target hours.

## Tech Stack
- **Frontend:** React (Vite), React Router (Vanilla CSS / TailwindCSS for styling)
- **Backend:** Laravel (PHP 8.2+)
- **Database:** MySQL
- **Authentication:** Laravel Sanctum (Token-based)
- **AI Integration:** OpenAI / Gemini APIs

## Folder Structure
```text
ExamverseAi/
│
├── frontend/ (React App)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── assets/
│   │   ├── styles/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│
└── backend/ (Laravel API)
    ├── app/
    │   ├── Http/Controllers/
    │   └── Models/
    ├── routes/ (api.php)
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    ├── config/
    ├── public/
    └── storage/
```
