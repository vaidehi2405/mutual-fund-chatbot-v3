from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()

# ✅ Groq client (NOT Grok)
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def health():
    return {"status": "running"}

@app.post("/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="llama3-70b-8192",  # ✅ Groq model
        messages=[
            {
                "role": "system",
                "content": "You are a helpful mutual fund assistant for Indian users."
            },
            {
                "role": "user",
                "content": req.message
            }
        ],
        temperature=0.7
    )

    return {
        "response": response.choices[0].message.content
    }