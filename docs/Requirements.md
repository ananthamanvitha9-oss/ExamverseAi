# ExamVerse AI - Requirements

This document outlines the functional and non-functional requirements for the platform.

## Functional Requirements

### 1. User & Student Management
- **Registration**: Students can register with name, email, phone, and target exam.
- **Onboarding**: Students must specify target competitive exams.
- **Waitlist**: Basic waitlist capture for early access.

### 2. Exam Content & Directory
- **Exam Repository**: Database must store exam metadata (category, question counts, timings).
- **Mock Tests**: System must support multiple mock tests per exam.
- **Syllabus Hierarchy**: Support tags linking questions to specific syllabus chapters.

### 3. Study Helper Tools
- **Doubt Solver**: AI-backed chat interface to explain topics.
- **Study Planner**: Day-to-day task listings.

---

## Non-Functional Requirements

### 1. Technology Stack
- **Frontend**: React + Vite + CSS (Vanilla/Tailwind).
- **Backend**: PHP (Laravel or lightweight MVC structure) + API Routing.
- **Database**: MySQL (hosted on localhost/XAMPP or production server).

### 2. Performance & Security
- **API Response**: Average API latency under 200ms.
- **Sanitization**: All database queries must be sanitized/parameterized to prevent SQL Injection.
- **CORS Handling**: Backend must allow requests from local client development servers (Vite ports, etc.) with preflight `OPTIONS` support.
- **Responsive Layout**: Platform must support mobile, tablet, and desktop views.
