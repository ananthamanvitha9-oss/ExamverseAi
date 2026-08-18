import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

resourcesData = [
    {
        "category": "Complete UPSC Strategy",
        "icon": "🎯",
        "channels": [
            { "name": "Vision IAS", "desc": "Exam strategy, current affairs, Mains answer writing, mock discussions." },
            { "name": "Drishti IAS (English)", "desc": "Concept classes, current affairs, editorials, answer writing." },
            { "name": "Next IAS", "desc": "Subject-wise lectures and strategy sessions." },
            { "name": "ForumIAS", "desc": "Mains guidance, interview guidance, PYQ analysis." }
        ]
    },
    {
        "category": "Indian Polity",
        "icon": "🏛️",
        "topics": ["Constitution", "Fundamental Rights & Duties", "Parliament", "President & Prime Minister", "Judiciary", "Local Government"],
        "channels": [{ "name": "StudyIQ IAS" }, { "name": "Drishti IAS (English)" }, { "name": "Vision IAS" }]
    },
    {
        "category": "History",
        "icon": "📜",
        "topics": ["Ancient India", "Medieval India", "Modern India", "Freedom Struggle", "Art & Culture"],
        "channels": [{ "name": "StudyIQ IAS" }, { "name": "Vision IAS" }, { "name": "Drishti IAS" }]
    },
    {
        "category": "Geography",
        "icon": "🌍",
        "topics": ["Physical Geography", "Indian Geography", "World Geography", "Environment basics"],
        "channels": [{ "name": "PMF IAS" }, { "name": "StudyIQ IAS" }, { "name": "Vision IAS" }]
    },
    {
        "category": "Economy",
        "icon": "📈",
        "topics": ["GDP", "Inflation", "Budget", "Banking", "RBI", "Fiscal & Monetary Policy"],
        "channels": [{ "name": "Mrunal Patel" }, { "name": "StudyIQ IAS" }, { "name": "Vision IAS" }]
    },
    {
        "category": "Environment & Ecology",
        "icon": "🌱",
        "topics": [],
        "channels": [{ "name": "PMF IAS" }, { "name": "StudyIQ IAS" }, { "name": "Vision IAS" }]
    },
    {
        "category": "Science & Technology",
        "icon": "🔬",
        "topics": ["Space", "Biotechnology", "AI", "Robotics", "Defence Technology"],
        "channels": [{ "name": "StudyIQ IAS" }, { "name": "Drishti IAS" }, { "name": "Vision IAS" }]
    },
    {
        "category": "Ethics (GS Paper IV)",
        "icon": "⚖️",
        "topics": [],
        "channels": [{ "name": "Vision IAS" }, { "name": "ForumIAS" }, { "name": "Drishti IAS" }]
    },
    {
        "category": "Current Affairs (Daily)",
        "icon": "📰",
        "description": "Spend 45–60 minutes daily",
        "channels": [
            { "name": "Vision IAS Daily Current Affairs" },
            { "name": "StudyIQ IAS Daily News" },
            { "name": "Drishti IAS Current Affairs" },
            { "name": "The Hindu Editorial Analysis" }
        ]
    },
    {
        "category": "CSAT (Qualifying Paper)",
        "icon": "🧮",
        "topics": ["Aptitude", "Reasoning", "Comprehension", "Basic Mathematics"],
        "channels": [{ "name": "Unacademy UPSC" }, { "name": "StudyIQ IAS" }, { "name": "BYJU'S Exam Prep UPSC" }]
    }
]

def seed():
    db: Session = SessionLocal()
    try:
        if db.query(models.StudyResource).count() == 0:
            print("Seeding Study Resources...")
            for res in resourcesData:
                new_res = models.StudyResource(
                    category=res.get("category"),
                    icon=res.get("icon"),
                    description=res.get("description"),
                    topics_json=json.dumps(res.get("topics", [])),
                    channels_json=json.dumps(res.get("channels", []))
                )
                db.add(new_res)
            db.commit()
            print("Successfully seeded Study Resources!")
        else:
            print("Study Resources already exist. Skipping seed.")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
