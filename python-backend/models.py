from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    phone = Column(String, nullable=True)
    target_exam = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    preferred_language = Column(String, nullable=True)
    study_goals = Column(Text, nullable=True)
    education_level = Column(String, nullable=True)
    preferred_subjects = Column(String, nullable=True)
    daily_study_hours = Column(Float, nullable=True)

    scores = relationship("Score", back_populates="owner")

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    score_value = Column(Float)
    study_hours = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="scores")

class MockTest(Base):
    __tablename__ = "mock_tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subject = Column(String)
    total_questions = Column(Integer)
    questions_json = Column(Text) # Store generated questions
    is_active = Column(Boolean, default=True)

class AiChatHistory(Base):
    __tablename__ = "ai_chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    prompt = Column(Text)
    response = Column(Text)

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exam_date = Column(String)
    weak_subjects = Column(String)
    plan_data_json = Column(Text)

# --- SYLLABUS ENGINE MODELS ---

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    
    stages = relationship("Stage", back_populates="exam", order_by="Stage.order")

class Stage(Base):
    __tablename__ = "stages"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    name = Column(String) # e.g., Prelims, Mains
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    
    exam = relationship("Exam", back_populates="stages")
    papers = relationship("Paper", back_populates="stage", order_by="Paper.order")

class Paper(Base):
    __tablename__ = "papers"
    id = Column(Integer, primary_key=True, index=True)
    stage_id = Column(Integer, ForeignKey("stages.id"))
    name = Column(String) # e.g., GS Paper I
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    
    stage = relationship("Stage", back_populates="papers")
    subjects = relationship("Subject", back_populates="paper", order_by="Subject.order")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"))
    name = Column(String) # e.g., History
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    
    paper = relationship("Paper", back_populates="subjects")
    topics = relationship("Topic", back_populates="subject", order_by="Topic.order")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    name = Column(String) # e.g., Modern Indian History
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    
    subject = relationship("Subject", back_populates="topics")
    subtopics = relationship("SubTopic", back_populates="topic", order_by="SubTopic.order")

class SubTopic(Base):
    __tablename__ = "subtopics"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    name = Column(String) # e.g., Freedom Movement
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    
    topic = relationship("Topic", back_populates="subtopics")

# --- PHASE 3: NEWS & PAYMENTS MODELS ---
from datetime import datetime

class NewsArticle(Base):
    __tablename__ = "news_articles"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String) # Daily, Weekly, Monthly
    title = Column(String)
    content = Column(Text)
    created_at = Column(String, default=lambda: datetime.now().isoformat())
    is_active = Column(Boolean, default=True)

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    razorpay_order_id = Column(String, unique=True, index=True)
    razorpay_payment_id = Column(String, nullable=True, unique=True)
    amount = Column(Float)
    status = Column(String, default="created") # created, paid, failed
    created_at = Column(String, default=lambda: datetime.now().isoformat())

# --- PHASE 5: NOTES & RESOURCES MODELS ---

class Note(Base):
    __tablename__ = "notes"
    id = Column(String, primary_key=True, index=True) # UUID string to match frontend Date.now().toString() logic easily
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(Text)
    updated_at = Column(String, default=lambda: datetime.now().isoformat())

class StudyResource(Base):
    __tablename__ = "study_resources"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    icon = Column(String)
    description = Column(Text, nullable=True)
    topics_json = Column(Text, nullable=True) # List of topics as JSON string
    channels_json = Column(Text, nullable=True) # List of channels as JSON string

# --- PHASE 6: PROFESSIONAL ANALYTICS MODELS ---

class StudyLog(Base):
    __tablename__ = "study_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    hours_logged = Column(Float)
    date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d"))
    notes = Column(Text, nullable=True)

class UserSyllabusProgress(Base):
    __tablename__ = "user_syllabus_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subtopic_id = Column(Integer, ForeignKey("subtopics.id"))
    status = Column(String, default="pending") # pending, completed

class MockTestResult(Base):
    __tablename__ = "mock_test_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exam_type = Column(String)
    topic = Column(String)
    score = Column(Float)
    accuracy = Column(Float)
    timestamp = Column(String, default=lambda: datetime.now().isoformat())
