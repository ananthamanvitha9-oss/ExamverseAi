from database import SessionLocal
import models
from datetime import datetime, timedelta

def seed_news():
    db = SessionLocal()
    
    # Check if we already have news
    if db.query(models.NewsArticle).first():
        print("News already seeded.")
        db.close()
        return

    today = datetime.now()
    
    news_items = [
        {
            "category": "Daily",
            "title": "ISRO Successfully Launches New Communication Satellite",
            "content": "The Indian Space Research Organisation (ISRO) has successfully placed its latest communication satellite into orbit. This mission marks a significant milestone in India's space program, enhancing telecommunication and broadcasting services across the subcontinent. The satellite is equipped with advanced transponders.",
            "created_at": today.isoformat()
        },
        {
            "category": "Daily",
            "title": "RBI Announces New Monetary Policy Updates",
            "content": "The Reserve Bank of India has maintained the repo rate at 6.5% for the fifth consecutive time, focusing on withdrawing accommodation to align inflation with the target. The central bank raised its GDP growth forecast for the current fiscal year, citing strong domestic demand and robust investment activity.",
            "created_at": (today - timedelta(days=1)).isoformat()
        },
        {
            "category": "Weekly",
            "title": "G20 Summit 2023: Key Takeaways and Global Impact",
            "content": "The G20 Summit concluded with the historic adoption of the New Delhi Leaders' Declaration. Key highlights include the inclusion of the African Union as a permanent member, consensus on the Ukraine conflict language, and major announcements like the India-Middle East-Europe Economic Corridor (IMEC).",
            "created_at": (today - timedelta(days=3)).isoformat()
        },
        {
            "category": "Monthly",
            "title": "Economic Survey Review: India's Growth Trajectory",
            "content": "The latest economic survey highlights India's resilience amidst global headwinds. The service sector continues to be the primary driver of growth, while manufacturing shows signs of robust recovery. The survey projects a steady 7% growth rate for the upcoming financial year, emphasizing infrastructure and digital public goods.",
            "created_at": (today - timedelta(days=15)).isoformat()
        }
    ]
    
    for item in news_items:
        article = models.NewsArticle(**item)
        db.add(article)
        
    db.commit()
    print("Successfully seeded news articles!")
    db.close()

if __name__ == "__main__":
    seed_news()
