from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

import models
import schemas
from database import engine, get_db
from ml_service import predict_score
from ai_service import generate_ai_response, generate_flashcards
from auth_service import oauth, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user, get_password_hash, verify_password
from datetime import timedelta
import os
import json

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ExamVerse AI API (Python)")
api_router = APIRouter(prefix="/api")

# Authlib requires session middleware
app.add_middleware(SessionMiddleware, secret_key=os.getenv("JWT_SECRET", "super-secret-key-change-in-production"))

# Setup CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend domain (e.g., Vercel)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to ExamVerse AI - Python Backend is Running!"}

@app.post("/predict-score/")
def get_score_prediction(req: schemas.PredictionRequest):
    """
    Uses Scikit-learn to predict a mock score based on study hours and previous scores.
    """
    predicted = predict_score(req.study_hours, req.previous_score)
    return {
        "study_hours": req.study_hours,
        "previous_score": req.previous_score,
        "predicted_mock_score": predicted
    }

@app.post("/ai/ask/")
def ask_ai_tutor(req: schemas.AiRequest):
    """
    Uses Google Gemini API to answer student questions.
    """
    response_text = generate_ai_response(req.prompt)
    return {"response": response_text}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=user.password) # normally hash the password
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users/{user_id}/scores/", response_model=schemas.Score)
def create_score_for_user(user_id: int, score: schemas.ScoreCreate, db: Session = Depends(get_db)):
    db_score = models.Score(**score.model_dump(), user_id=user_id)
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@api_router.get("/auth/google/redirect")
async def login_via_google(request: Request):
    # FORCE HARDCODE to prevent environment variable typos
    backend_url = "https://examverseai-mannu.onrender.com"
    redirect_uri = "https://examverseai-mannu.onrender.com/api/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@api_router.get("/auth/google/callback")
async def auth_google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            user_info = await oauth.google.userinfo(token=token)
            
        email = user_info.get("email")
        name = user_info.get("name")
        
        # Check if user exists
        db_user = db.query(models.User).filter(models.User.email == email).first()
        if not db_user:
            # Create user if they don't exist
            db_user = models.User(email=email, full_name=name, hashed_password="oauth_user_no_password")
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
        # Create JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email}, expires_delta=access_token_expires
        )
        
        # Redirect back to React frontend with token
        frontend_url = os.environ.get("FRONTEND_URL", "https://examverse-ai-fli3.vercel.app")
        return RedirectResponse(url=f"{frontend_url}/auth/callback?token={access_token}")
        
    except Exception as e:
        print(f"Auth Error: {e}")
        frontend_url = os.environ.get("FRONTEND_URL", "https://examverse-ai-fli3.vercel.app")
        return RedirectResponse(url=f"{frontend_url}/login?error=oauth_failed")


# --- PHASE 3: MOCK API ENDPOINTS FOR REACT FRONTEND PARITY ---

@api_router.post("/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"token": access_token, "user": {"id": user.id, "name": user.full_name, "email": user.email}}

@api_router.post("/register")
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pwd = get_password_hash(user_data.password)
    new_user = models.User(email=user_data.email, full_name=user_data.full_name, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"token": access_token, "user": {"id": new_user.id, "name": new_user.full_name, "email": new_user.email}}

@api_router.get("/user")
def get_user(current_user: models.User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.full_name, "email": current_user.email}

@api_router.post("/ai/chat")
def ai_chat(request: schemas.AiRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Generate AI response
    bot_response = generate_ai_response(request.prompt)
    
    # Save to history
    chat_entry = models.AiChatHistory(user_id=current_user.id, prompt=request.prompt, response=bot_response)
    db.add(chat_entry)
    db.commit()
    
    return {"response": bot_response}

@api_router.post("/ai/quiz")
def ai_quiz(request: schemas.AiQuizRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Prompt Gemini for a JSON array of 5 questions
    quiz_prompt = f"Generate exactly 5 multiple choice questions about {request.topic}. Return ONLY a valid JSON array where each object has 'id', 'question', 'options' (array of 4 strings), and 'correct' (string matching one of the options)."
    try:
        raw_json_str = generate_ai_response(quiz_prompt)
        # Clean up markdown formatting if Gemini adds it
        raw_json_str = raw_json_str.replace("```json", "").replace("```", "").strip()
        quiz_data = json.loads(raw_json_str)
        
        # Save mock test
        new_test = models.MockTest(title=f"Quiz on {request.topic}", subject=request.topic, total_questions=5, questions_json=raw_json_str)
        db.add(new_test)
        db.commit()
        return quiz_data
    except Exception as e:
        print(f"Quiz Gen Error: {e}")
        # Fallback dummy data if AI fails
        return [{"id": 1, "question": "What is the capital of India?", "options": ["Delhi", "Mumbai", "Chennai", "Kolkata"], "correct": "Delhi"}]

@api_router.get("/progress/dashboard")
def dashboard(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Calculate real stats from scores table
    scores = db.query(models.Score).filter(models.Score.user_id == current_user.id).all()
    total_hours = sum(s.study_hours for s in scores)
    avg_score = sum(s.score_value for s in scores) / len(scores) if scores else 0
    
    return {
        "study_hours": total_hours,
        "mock_score": round(avg_score, 2),
        "streak": 1, # Placeholder logic for streak
        "recent_tests": [{"subject": s.subject, "score": s.score_value} for s in scores[-5:]]
    }

@api_router.post("/gamification/log-study")
def log_study(current_user: models.User = Depends(get_current_user)):
    return {"status": "success", "points_earned": 10}

@api_router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    # Real leaderboard could aggregate scores, returning dummy for now
    users = db.query(models.User).limit(10).all()
    return [{"rank": i+1, "name": u.full_name, "points": (100 - i*10)} for i, u in enumerate(users)]

@api_router.post("/flashcards/generate")
def generate_flashcards_api(request: schemas.FlashcardRequest):
    try:
        raw_json_str = generate_flashcards(request.topic)
        flashcards = json.loads(raw_json_str)
        return flashcards
    except Exception as e:
        print(f"Flashcard Gen Error: {e}")
        return [{"front": "Error generating flashcards", "back": "Please try again later."}]

app.include_router(api_router)

