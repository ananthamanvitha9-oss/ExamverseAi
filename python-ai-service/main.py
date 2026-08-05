from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="Examverse AI Python Service",
    description="Microservice for handling advanced AI tasks using Python.",
    version="1.0.0"
)

class ChatRequest(BaseModel):
    message: str
    history: list = []

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def read_root():
    return {"status": "Python AI Microservice is running!"}

@app.post("/api/generate", response_model=ChatResponse)
def generate_response(request: ChatRequest):
    """
    This is a basic endpoint that Laravel will call.
    You can replace this logic with ANY custom Python AI model 
    (e.g., PyTorch, Transformers, OpenAI, LangChain, etc.)
    """
    user_message = request.message

    # --- YOUR CUSTOM AI LOGIC GOES HERE ---
    
    # For now, we return a smart placeholder response
    ai_reply = f"[Python AI Service] I received your message: '{user_message}'. I am ready to be upgraded with real ML models!"

    return ChatResponse(response=ai_reply)

if __name__ == "__main__":
    # Run the server on port 8001 so it doesn't conflict with Laravel (8000) or Vite (5173)
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
