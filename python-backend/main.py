from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter, UploadFile, File
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

import models
import schemas
from database import engine, get_db
from ml_service import predict_score
from ai_service import generate_ai_response, generate_ai_tutor_response, generate_ai_mock_test, generate_flashcards, extract_text_from_pdf
from auth_service import oauth, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user, get_password_hash, verify_password
from datetime import timedelta
import os
import json
import uuid
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
    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "target_exam": current_user.target_exam,
        "avatar_url": current_user.avatar_url,
        "preferred_language": current_user.preferred_language,
        "study_goals": current_user.study_goals,
        "education_level": current_user.education_level,
        "preferred_subjects": current_user.preferred_subjects,
        "daily_study_hours": current_user.daily_study_hours
    }

@api_router.put("/user")
def update_profile(user_update: schemas.UserUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.name:
        current_user.full_name = user_update.name
    if user_update.phone:
        current_user.phone = user_update.phone
    if user_update.target_exam:
        current_user.target_exam = user_update.target_exam
    if user_update.preferred_language:
        current_user.preferred_language = user_update.preferred_language
    if user_update.study_goals:
        current_user.study_goals = user_update.study_goals
    if user_update.education_level:
        current_user.education_level = user_update.education_level
    if user_update.preferred_subjects:
        current_user.preferred_subjects = user_update.preferred_subjects
    if user_update.daily_study_hours is not None:
        current_user.daily_study_hours = user_update.daily_study_hours
        
    db.commit()
    db.refresh(current_user)
    return {
        "message": "Profile updated successfully",
        "user": {
            "name": current_user.full_name,
            "email": current_user.email,
            "phone": current_user.phone,
            "target_exam": current_user.target_exam,
            "avatar_url": current_user.avatar_url,
            "preferred_language": current_user.preferred_language,
            "study_goals": current_user.study_goals,
            "education_level": current_user.education_level,
            "preferred_subjects": current_user.preferred_subjects,
            "daily_study_hours": current_user.daily_study_hours
        }
    }

@api_router.post("/user/avatar")
def update_avatar(avatar: UploadFile = File(...), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Use DiceBear avatars as a reliable mock for now
    avatar_url = f"https://api.dicebear.com/7.x/initials/svg?seed={current_user.email}"
    current_user.avatar_url = avatar_url
    db.commit()
    return {"avatar_url": avatar_url}

@api_router.post("/ai/tutor")
def ai_tutor(request: schemas.AiTutorRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Generate AI response
        bot_response = generate_ai_tutor_response(request.message, request.subject, request.exam, request.language)
        
        # Save to history
        chat_entry = models.AiChatHistory(user_id=current_user.id, prompt=request.message, response=bot_response)
        db.add(chat_entry)
        db.commit()
        
        return {
            "success": True,
            "answer": bot_response,
            "conversationId": str(uuid.uuid4())
        }
    except ValueError as ve:
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/mock-test")
def ai_mock_test(request: schemas.MockTestGenerateRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        raw_json_str = generate_ai_mock_test(
            exam=request.exam, 
            subject=request.subject, 
            topic=request.topic, 
            difficulty=request.difficulty, 
            question_count=request.questionCount, 
            language=request.language
        )
        
        test_data = json.loads(raw_json_str)
        
        # Save mock test
        new_test = models.MockTest(
            title=test_data.get("title", f"Mock Test on {request.topic}"),
            subject=request.subject,
            total_questions=request.questionCount,
            questions_json=json.dumps(test_data.get("questions", []))
        )
        db.add(new_test)
        db.commit()
        
        return {
            "success": True,
            "test": test_data
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned malformed JSON. Please try again.")
    except ValueError as ve:
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
def leaderboard(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    users = db.query(models.User).limit(10).all()
    leaderboard_data = []
    for i, u in enumerate(users):
        leaderboard_data.append({
            "id": u.id,
            "full_name": u.full_name or "Anonymous",
            "points": max(100 - i*10, 0),
            "avatar": None
        })
    return {
        "leaderboard": leaderboard_data,
        "current_user": {
            "rank": 1,
            "points": 100
        }
    }

@api_router.post("/flashcards/generate")
def create_flashcards(req: schemas.FlashcardRequest):
    """
    Generates flashcards based on a topic string.
    """
    flashcards_json_str = generate_flashcards(req.topic)
    try:
        flashcards = json.loads(flashcards_json_str)
        return flashcards
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response into JSON format.", "raw_response": flashcards_json_str}

@api_router.post("/flashcards/upload-pdf")
async def upload_pdf_flashcards(file: UploadFile = File(...)):
    """
    Generates flashcards directly from an uploaded PDF file.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)
    
    if text.startswith("Error"):
        raise HTTPException(status_code=500, detail=text)
        
    # Limit text to avoid exceeding token limits (Gemini 1.5 flash has huge context, but this is safe)
    text = text[:15000] 
    
    flashcards_json_str = generate_flashcards(f"Here are the study notes from a PDF: {text}")
    try:
        return json.loads(flashcards_json_str)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response.", "raw": flashcards_json_str}

@api_router.get("/analytics")
def get_analytics():
    """
    Returns analytics data for the dashboard charts.
    """
    # Returning high-quality mock data structure matching the frontend Recharts requirements
    return {
        "summary": {
            "total_tests": 15,
            "avg_score": 82,
            "hours_studied": 38.5,
            "current_trend": "+5.2%"
        },
        "test_scores": [
            {"date": "Mon", "score": 65},
            {"date": "Tue", "score": 70},
            {"date": "Wed", "score": 75},
            {"date": "Thu", "score": 78},
            {"date": "Fri", "score": 85},
            {"date": "Sat", "score": 88},
            {"date": "Sun", "score": 92}
        ],
        "subject_performance": [
            {"subject": "Math", "score": 88},
            {"subject": "Physics", "score": 80},
            {"subject": "Chemistry", "score": 72},
            {"subject": "Biology", "score": 95}
        ],
        "time_spent": [
            {"day": "Mon", "hours": 2},
            {"day": "Tue", "hours": 2.5},
            {"day": "Wed", "hours": 3},
            {"day": "Thu", "hours": 2},
            {"day": "Fri", "hours": 4},
            {"day": "Sat", "hours": 6},
            {"day": "Sun", "hours": 5.5}
        ]
    }

# Finally, include the router
@api_router.get("/news", response_model=List[schemas.NewsSchema])
def get_news(db: Session = Depends(get_db)):
    return db.query(models.NewsArticle).filter(models.NewsArticle.is_active == True).order_by(models.NewsArticle.id.desc()).all()

@api_router.post("/admin/news", response_model=schemas.NewsSchema)
def create_news(req: schemas.NewsCreateSchema, db: Session = Depends(get_db)):
    # In a real app, verify if current_user is admin
    new_article = models.NewsArticle(
        category=req.category,
        title=req.title,
        content=req.content
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return new_article

import razorpay
import os

# Initialize razorpay client
# Using dummy keys if env variables aren't set
rzp_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID", "rzp_test_dummykey123"), 
          os.getenv("RAZORPAY_KEY_SECRET", "dummysecret123"))
)

@api_router.post("/payment/create-order")
def create_order(req: schemas.PaymentCreateRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    amount_in_paise = int(req.amount * 100)
    
    # Create Razorpay order
    order_data = {
        "amount": amount_in_paise,
        "currency": "INR",
        "receipt": f"receipt_{current_user.id}_{int(datetime.now().timestamp())}",
        "notes": {
            "user_email": current_user.email
        }
    }
    
    try:
        order = rzp_client.order.create(data=order_data)
        
        # Save payment record in DB
        payment_record = models.Payment(
            user_id=current_user.id,
            razorpay_order_id=order['id'],
            amount=req.amount,
            status="created"
        )
        db.add(payment_record)
        db.commit()
        
        return {
            "order_id": order['id'],
            "amount": order['amount'],
            "currency": order['currency'],
            "key_id": os.getenv("RAZORPAY_KEY_ID", "rzp_test_dummykey123")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/payment/verify")
def verify_payment(req: schemas.PaymentVerifyRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': req.razorpay_order_id,
            'razorpay_payment_id': req.razorpay_payment_id,
            'razorpay_signature': req.razorpay_signature
        }
        
        # In production this will throw SignatureVerificationError if invalid
        # rzp_client.utility.verify_payment_signature(params_dict)
        
        # Update DB
        payment = db.query(models.Payment).filter(models.Payment.razorpay_order_id == req.razorpay_order_id).first()
        if payment:
            payment.status = "paid"
            payment.razorpay_payment_id = req.razorpay_payment_id
            db.commit()
            
        return {"success": True, "message": "Payment verified successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Signature verification failed")

@api_router.get("/study-plan")
def get_study_plan(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(models.StudyPlan).filter(models.StudyPlan.user_id == current_user.id).order_by(models.StudyPlan.id.desc()).first()
    if plan:
        return {
            "exam_date": plan.exam_date,
            "weak_subjects": plan.weak_subjects,
            "plan_data": json.loads(plan.plan_data_json)
        }
    return None

@api_router.post("/study-plan/generate")
def generate_study_plan(req: schemas.StudyPlanRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    prompt = f"Generate a 7-day study plan for a student taking an exam on {req.exam_date}. They are weak in {req.weak_subjects}. Return ONLY a valid JSON array of 7 objects. Each object MUST have: 'day' (e.g., 'Day 1'), 'date' (e.g., '2023-11-01'), 'focus_subject', 'topics_to_cover', and 'estimated_hours' (a number)."
    try:
        raw_json_str = generate_ai_response(prompt)
        raw_json_str = raw_json_str.replace("```json", "").replace("```", "").strip()
        plan_data = json.loads(raw_json_str)
        
        # Save to DB
        plan = models.StudyPlan(
            user_id=current_user.id,
            exam_date=req.exam_date,
            weak_subjects=req.weak_subjects,
            plan_data_json=json.dumps(plan_data)
        )
        db.add(plan)
        db.commit()
        
        return {"plan": plan_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(api_router)

# MOCK COURSES DATA
MOCK_COURSES = [
    {
        "id": 1,
        "name": "UPSC Civil Services Complete Foundation",
        "description": "Comprehensive coverage of Prelims and Mains with daily answer writing practice and weekly current affairs.",
        "category": "UPSC",
        "duration": 365,
        "status": "active",
        "subjects": [
            {"id": 101, "name": "Indian Polity", "chapters": [{"id": 1001, "name": "Historical Background"}]},
            {"id": 102, "name": "Modern History", "chapters": [{"id": 1002, "name": "Advent of Europeans"}]}
        ]
    },
    {
        "id": 2,
        "name": "SSC CGL Tier 1 & 2 Crash Course",
        "description": "Intensive 90-day program focusing on Quantitative Aptitude, Reasoning, English, and General Awareness.",
        "category": "SSC",
        "duration": 90,
        "status": "active",
        "subjects": [
            {"id": 201, "name": "Quantitative Aptitude", "chapters": [{"id": 2001, "name": "Number System"}]}
        ]
    },
    {
        "id": 3,
        "name": "Banking PO Masterclass",
        "description": "Master Data Interpretation, Puzzles, and English Comprehension for IBPS and SBI PO exams.",
        "category": "Banking",
        "duration": 120,
        "status": "active",
        "subjects": [
            {"id": 301, "name": "Reasoning Ability", "chapters": [{"id": 3001, "name": "Seating Arrangement"}]}
        ]
    }
]

@app.get("/api/courses")
@app.get("/api/admin/courses")
def get_courses():
    return MOCK_COURSES

@app.get("/api/courses/{course_id}")
def get_course_details(course_id: int):
    for c in MOCK_COURSES:
        if c["id"] == course_id:
            return c
    raise HTTPException(status_code=404, detail="Course not found")

# --- PHASE 2: SYLLABUS ENGINE ROUTES ---
from typing import List

@app.get("/api/exams", response_model=List[schemas.ExamSchema])
def get_all_exams(db: Session = Depends(get_db)):
    """Returns a list of all active exams."""
    return db.query(models.Exam).filter(models.Exam.is_active == True).order_by(models.Exam.order).all()

@app.get("/api/hierarchy/{exam_id}", response_model=schemas.ExamSchema)
def get_exam_hierarchy(exam_id: int, db: Session = Depends(get_db)):
    """Returns the complete nested syllabus tree for a specific exam."""
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam curriculum not found")
    return exam
