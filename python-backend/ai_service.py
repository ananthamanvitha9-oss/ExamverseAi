import google.generativeai as genai
import os
from dotenv import load_dotenv
import PyPDF2
from io import BytesIO

load_dotenv()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file using PyPDF2."""
    try:
        pdf_file = BytesIO(file_bytes)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def generate_ai_response(prompt: str) -> str:
    """
    Calls the Gemini API to generate text based on the prompt.
    """
    if not GEMINI_API_KEY:
        return "Error: GEMINI_API_KEY not configured in backend."
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Generation Error: {str(e)}"

def generate_flashcards(topic: str) -> str:
    """
    Calls Gemini API to generate 5-10 flashcards on a given topic in JSON format.
    """
    if not GEMINI_API_KEY:
        import json
        return json.dumps([{"front": "Error", "back": "GEMINI_API_KEY not configured"}])
    
    prompt = f"""
    You are an expert tutor. Create a set of 5 to 10 highly effective study flashcards about the following topic or notes.
    Return ONLY a raw JSON array of objects. Each object must have exactly two keys: "front" (the question or concept) and "back" (the answer or definition).
    Do not use markdown blocks like ```json. Just return the JSON array directly.
    
    Topic/Notes: {topic}
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()
    except Exception as e:
        import json
        return json.dumps([{"front": "Error generating flashcards", "back": str(e)}])
