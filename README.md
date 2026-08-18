# ExamVerse AI

ExamVerse AI is a comprehensive, database-backed Learning Management System (LMS) and AI Tutor platform designed to help students prepare for competitive exams like UPSC, SSC, and Banking.

## Features

### 1. User Authentication
- Secure JWT-based registration and login system.
- User profile management.

### 2. Dashboard & Analytics
- Personalized student dashboard tracking mock test scores, predicted scores, and study hours.
- Machine Learning (Scikit-learn) prediction engine to forecast future scores based on study habits.

### 3. AI Tutor & Study Assistant
- Integrated with Google Gemini 3.6-flash API.
- **AI Chat**: General conversational interface for asking questions.
- **Highlight-to-Explain**: Users can highlight text in their notes to get instant AI-generated explanations.
- **AI Flashcards**: Automatically generate flashcards from PDF uploads or topic prompts.

### 4. Curriculum & Study Planner
- Complete syllabus engine mapping subjects, topics, and chapters.
- AI-generated personalized study plans based on the user's exam date and weak subjects.

### 5. Mock Tests & Daily Quizzes
- Dynamic generation of mock tests using AI based on selected subjects and difficulty levels.
- Daily current affairs quizzes automatically generated to keep students up-to-date.

### 6. Notes & Resources
- Persistent database storage for user study notes.
- Curated repository of external study resources (e.g., YouTube channels for specific subjects).

### 7. Payments & News
- Razorpay payment gateway integration for purchasing premium courses.
- Dynamic news feed for exam updates and announcements.

### 8. Admin Dashboard
- Super Admin portal to monitor platform metrics.
- Real-time statistics: Total Users, Total Revenue, and Recent Transactions.
- Course management UI for creating and editing available courses.

## Tech Stack

### Frontend
- **React.js** with Vite
- **CSS Modules** for component-scoped styling
- **Axios** for API communication
- **Lucide React** for icons
- **Razorpay Checkout** for payments

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** (ORM) & **PostgreSQL** (Database)
- **Google GenAI SDK** (Gemini Models)
- **Scikit-learn** (Machine Learning predictions)
- **PyPDF2** (PDF parsing for flashcards)
- **Uvicorn** (ASGI server)

## API Structure (`main.py`)

The backend follows a monolithic architecture with the following key routers:

- `/users/`, `/login/`: Authentication and user management.
- `/api/dashboard`, `/api/predict`: Analytics and ML score predictions.
- `/api/ai/tutor`, `/api/chat`: Gemini text generation endpoints.
- `/api/ai/mock-test`, `/api/daily-quiz`: Quiz generation.
- `/api/flashcards/generate`, `/api/flashcards/upload-pdf`: Flashcard generation.
- `/api/study-plan/generate`: AI study schedule generation.
- `/api/notes`, `/api/resources`: Study materials CRUD.
- `/api/payment/create`, `/api/payment/verify`: Razorpay integration.
- `/api/admin/stats`, `/api/admin/courses`: Admin operations.

## Running Locally

### Backend
1. Navigate to the `python-backend` directory.
2. Activate the virtual environment: `venv\Scripts\activate` (Windows)
3. Install requirements (if any new ones): `pip install -r requirements.txt`
4. Start the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to the `Frontend/examverse-ai` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Deployment
- **Frontend**: Hosted on Vercel.
- **Backend**: Hosted on Render.
- **Database**: PostgreSQL (e.g., Supabase or Render DB).
