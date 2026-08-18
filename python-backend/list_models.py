import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

try:
    models = genai.list_models()
    for m in models:
        print(f"Model Name: {m.name}")
        print(f"Supported methods: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error: {e}")
