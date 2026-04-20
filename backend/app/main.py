from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import os
import sys
from pathlib import Path

# Ensure the parent directory is in sys.path so 'app' and other modules are found
# This handles the case where Render runs from the 'backend' folder.
sys.path.append(str(Path(__file__).parent.parent))

from app.pipeline import run_pipeline

app = FastAPI(title="Groww MF FAQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    id: str
    role: str
    text: str
    source_url: Optional[str] = None
    scraped_at: Optional[str] = None
    timestamp: str

@app.get("/")
def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        query = request.query.strip()
        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")
            
        # Call the existing RAG pipeline
        response_text = run_pipeline(query)
        
        # Parse output for sources if present
        source_url = None
        scraped_at = None
        
        import re
        source_match = re.search(r"Source:\s*([^\s|]+)", response_text)
        if source_match:
            source_url = source_match.group(1).strip()
            
        update_match = re.search(r"Last updated:\s*([^\s|]+)", response_text)
        if update_match:
            scraped_at = update_match.group(1).strip()

        # Clean display text for the UI
        display_text = response_text.split("Source:")[0].strip()
        
        role = "bot"
        if "advisory" in response_text.lower() or "amfiindia.com/investor-corner" in response_text.lower():
            role = "refusal"

        return ChatResponse(
            id=os.urandom(4).hex(),
            role=role,
            text=display_text,
            source_url=source_url,
            scraped_at=scraped_at,
            timestamp=datetime.now(timezone.utc).isoformat()
        )
    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)