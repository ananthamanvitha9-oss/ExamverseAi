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
