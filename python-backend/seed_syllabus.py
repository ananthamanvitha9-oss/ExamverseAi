import os
from sqlalchemy.orm import Session
from database import engine, get_db
import models

def seed_syllabus():
    db = Session(bind=engine)
    
    # Check if we already have exams seeded to avoid duplication
    if db.query(models.Exam).first():
        print("Syllabus data already exists. Skipping seed.")
        db.close()
        return

    print("Seeding syllabus database...")

    # ================= UPSC CIVIL SERVICES =================
    upsc = models.Exam(name="UPSC Civil Services", slug="upsc-cse", description="Civil Services Examination conducted by Union Public Service Commission", order=1)
    db.add(upsc)
    db.flush()

    # UPSC Stages
    prelims = models.Stage(exam_id=upsc.id, name="Prelims", description="Objective Type", order=1)
    mains = models.Stage(exam_id=upsc.id, name="Mains", description="Written & Interview", order=2)
    db.add_all([prelims, mains])
    db.flush()

    # Prelims Papers
    gs1 = models.Paper(stage_id=prelims.id, name="General Studies Paper I", order=1)
    csat = models.Paper(stage_id=prelims.id, name="CSAT (Paper II)", order=2)
    db.add_all([gs1, csat])
    db.flush()

    # GS1 Subjects
    history = models.Subject(paper_id=gs1.id, name="History of India and Indian National Movement", order=1)
    geography = models.Subject(paper_id=gs1.id, name="Indian and World Geography", order=2)
    polity = models.Subject(paper_id=gs1.id, name="Indian Polity and Governance", order=3)
    economy = models.Subject(paper_id=gs1.id, name="Economic and Social Development", order=4)
    db.add_all([history, geography, polity, economy])
    db.flush()

    # History Topics
    ancient = models.Topic(subject_id=history.id, name="Ancient Indian History", order=1)
    medieval = models.Topic(subject_id=history.id, name="Medieval Indian History", order=2)
    modern = models.Topic(subject_id=history.id, name="Modern Indian History", order=3)
    art_culture = models.Topic(subject_id=history.id, name="Art and Culture", order=4)
    db.add_all([ancient, medieval, modern, art_culture])
    db.flush()

    # Modern History SubTopics
    st1 = models.SubTopic(topic_id=modern.id, name="The Revolt of 1857", order=1)
    st2 = models.SubTopic(topic_id=modern.id, name="Socio-Religious Reform Movements", order=2)
    st3 = models.SubTopic(topic_id=modern.id, name="Indian National Congress Foundation", order=3)
    st4 = models.SubTopic(topic_id=modern.id, name="Gandhian Era (1915-1947)", order=4)
    db.add_all([st1, st2, st3, st4])
    db.flush()

    # ================= SSC CGL =================
    ssc = models.Exam(name="SSC CGL", slug="ssc-cgl", description="Staff Selection Commission Combined Graduate Level", order=2)
    db.add(ssc)
    db.flush()

    tier1 = models.Stage(exam_id=ssc.id, name="Tier-I", description="Computer Based Examination", order=1)
    db.add(tier1)
    db.flush()

    ssc_paper1 = models.Paper(stage_id=tier1.id, name="Tier-I Comprehensive Paper", order=1)
    db.add(ssc_paper1)
    db.flush()

    quant = models.Subject(paper_id=ssc_paper1.id, name="Quantitative Aptitude", order=1)
    reasoning = models.Subject(paper_id=ssc_paper1.id, name="General Intelligence and Reasoning", order=2)
    english = models.Subject(paper_id=ssc_paper1.id, name="English Comprehension", order=3)
    gk = models.Subject(paper_id=ssc_paper1.id, name="General Awareness", order=4)
    db.add_all([quant, reasoning, english, gk])
    db.flush()

    # Quant Topics
    arithmetic = models.Topic(subject_id=quant.id, name="Arithmetic", order=1)
    advance_maths = models.Topic(subject_id=quant.id, name="Advance Maths", order=2)
    db.add_all([arithmetic, advance_maths])
    db.flush()

    # Arithmetic Subtopics
    ast1 = models.SubTopic(topic_id=arithmetic.id, name="Percentages", order=1)
    ast2 = models.SubTopic(topic_id=arithmetic.id, name="Ratio and Proportion", order=2)
    ast3 = models.SubTopic(topic_id=arithmetic.id, name="Time and Work", order=3)
    db.add_all([ast1, ast2, ast3])
    db.flush()

    db.commit()
    print("Database seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_syllabus()
