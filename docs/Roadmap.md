# ExamVerse AI - Roadmap

This roadmap outlines the key developmental phases of ExamVerse AI.

## Phase 1: Foundation & Setup (Current)
- [x] Configure workspace directories.
- [x] Set up local database server (MySQL) and seed base competitive exam data.
- [x] Establish backend router and models (`Student`, `Exam`, `MockTest`).
- [x] Integrate HTML/React Frontends with PHP/MySQL backend APIs.
- [x] Set up baseline documentation files.

## Phase 2: User Authentication & Onboarding
- [ ] Implement secure authentication using Laravel Sanctum / JWT.
- [ ] Create detailed onboarding questionnaire to identify student targets (targeted exam, study hours per day, strengths, weaknesses).
- [ ] Connect profile dashboard to custom goals.

## Phase 3: AI Doubt Solver & Tutor
- [ ] Integrate Gemini API for intelligent, contextual doubt solving.
- [ ] Implement OCR (Optical Character Recognition) so students can upload photos of textbook questions.
- [ ] Build a vector database (RAG) containing key NCERT, Laxmikanth, and standard textbooks for high accuracy.

## Phase 4: Mock Test Runner & Analytics
- [ ] Build interactive Mock Test Interface with timer controls and progress saving.
- [ ] Develop comprehensive analytics module mapping performance back to syllabus topics (e.g., Polity -> Fundamental Rights).
- [ ] Generate personal practice sheets focusing on weak areas.

## Phase 5: Voice Assistant & Premium Scale
- [ ] Create voice-led daily quizzes for hands-free study.
- [ ] Package web platform into mobile applications (Android/iOS).
- [ ] Set up performance monitoring and scale backend.
