# ExamVerse AI - Modules Description

The platform's architecture is divided into decoupled, modular components:

## 1. Authentication & Profiling Module
- Handles student signup, login, password recovery, and email validation.
- Collects target exam selection and initial onboarding metrics.
- Exposes tokens (Sanctum/JWT) for API requests.

## 2. Exam & Mock Test Engine Module
- **Exam Repository**: Manages exam meta-information, categories, and syllabus structures.
- **Question Bank**: Manages database of questions, tags, correct answers, and hints.
- **Test Runner**: Manages user test sessions, registers student responses, and tracks timers.

## 3. AI Integrations Hub Module
- **Gemini API Interface**: Orchestrates prompts, temperature configurations, and response parsing.
- **RAG Handler**: Connects standard reference book contents (PDFs/Text) to prompt context windows.
- **OCR Parser**: Accepts photos, crops and processes them for the AI solver.

## 4. Student Analytics Module
- Compiles metrics from mock tests and quizzes.
- Computes percentage performance per syllabus topic.
- Suggests weak-area flashcards to the test generator.

## 5. Daily Notifications & Planning Module
- Tracks streaks and active study days.
- Recalculates planners based on completion status.
- Triggers push notifications/reminders.
