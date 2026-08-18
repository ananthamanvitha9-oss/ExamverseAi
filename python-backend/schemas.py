from pydantic import BaseModel

class FlashcardRequest(BaseModel):
    topic: str

from typing import List, Optional

class ScoreBase(BaseModel):
    subject: str
    score_value: float
    study_hours: float

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    scores: List[Score] = []

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    full_name: str
    password: str

class AiQuizRequest(BaseModel):
    topic: str

class PredictionRequest(BaseModel):
    study_hours: float
    previous_score: float

class AiTutorRequest(BaseModel):
    message: str
    subject: str = "General"
    exam: str = "General"
    language: str = "English"

class MockTestGenerateRequest(BaseModel):
    exam: str
    subject: str
    topic: str
    difficulty: str = "medium"
    questionCount: int = 10
    language: str = "English"

class MockTestBase(BaseModel):
    title: str
    subject: str
    total_questions: int
    questions_json: str
    is_active: bool = True

class MockTest(MockTestBase):
    id: int

    class Config:
        from_attributes = True

class AiChatHistoryBase(BaseModel):
    prompt: str
    response: str

class AiChatHistory(AiChatHistoryBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    target_exam: Optional[str] = None
    preferred_language: Optional[str] = None
    study_goals: Optional[str] = None
    education_level: Optional[str] = None
    preferred_subjects: Optional[str] = None
    daily_study_hours: Optional[float] = None

class StudyPlanRequest(BaseModel):
    exam_date: str
    weak_subjects: str

# --- SYLLABUS ENGINE SCHEMAS ---

class SubTopicSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_active: bool
    order: int
    class Config:
        from_attributes = True

class TopicSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_active: bool
    order: int
    subtopics: List[SubTopicSchema] = []
    class Config:
        from_attributes = True

class SubjectSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_active: bool
    order: int
    topics: List[TopicSchema] = []
    class Config:
        from_attributes = True

class PaperSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_active: bool
    order: int
    subjects: List[SubjectSchema] = []
    class Config:
        from_attributes = True

class StageSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_active: bool
    order: int
    papers: List[PaperSchema] = []
    class Config:
        from_attributes = True

class ExamSchema(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    is_active: bool
    order: int
    stages: List[StageSchema] = []
    class Config:
        from_attributes = True

# --- PHASE 3: NEWS & PAYMENTS SCHEMAS ---

class NewsSchema(BaseModel):
    id: int
    category: str
    title: str
    content: str
    created_at: str
    is_active: bool
    class Config:
        from_attributes = True

class NewsCreateSchema(BaseModel):
    category: str
    title: str
    content: str

class PaymentCreateRequest(BaseModel):
    amount: float

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    amount: float

# --- PHASE 5: NOTES & RESOURCES SCHEMAS ---

class NoteSchema(BaseModel):
    id: str
    title: str
    content: str
    updatedAt: str

class ChatRequest(BaseModel):
    message: str
