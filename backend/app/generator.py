import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SYSTEM_PROMPT = """
You are a factual FAQ assistant for ICICI Prudential mutual fund 
schemes: Bluechip (Large Cap), ELSS, Flexicap, Midcap, and Smallcap.

STRICT EXTRACTION RULES:
1. Answer ONLY using the provided CONTEXT. Ignore outside knowledge.
2. If the context contains specific numeric values (e.g., "NAV: ₹354.62", 
   "Expense ratio: 1.05%"), use that exact number in your answer.
3. Treat "Bluechip Fund" and "Large Cap Fund" as the same scheme.
4. Keep answers brief (max 3 sentences).
5. Always end with:
   Source: [url] | Last updated: [scraped_at]
6. If the specific fact (e.g., NAV) is not present in the context 
   for the specific fund requested, say:
   "This information is not in my current sources. Please visit 
   icicipruamc.com or amfiindia.com for the latest details."
   Then still include the source URL of the most relevant chunk.
7. Look specifically for numeric strings like "Expense ratio", "NAV", 
   or "Exit Load". If multiple values exist, prioritize the one 
   matching the fund in the QUERY.
""".strip()

def generate_answer(query: str, chunks: list[dict]) -> str:
    """
    Generate an answer using xAI (Grok) based on retrieved context chunks.
    """
    # 1. Build the context string from the provided chunks
    context_parts = []
    for chunk in chunks:
        text = chunk.get("text", "").strip()
        url = chunk.get("url", "").strip()
        scraped_at = chunk.get("scraped_at", "").strip()
        
        context_parts.append(f"Text: {text}\nURL: {url}\nScraped At: {scraped_at}")
    
    context_block = "\n\n---\n\n".join(context_parts)
    
    # 2. Construct the final user message
    user_message = f"CONTEXT:\n{context_block}\n\nQUERY:\n{query}"
    
    try:
        api_key_to_use = os.environ.get("GROQ_API_KEY") or os.environ.get("GROK_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        
        client = OpenAI(
            api_key=api_key_to_use,
            base_url="https://api.groq.com/openai/v1"
        )
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling Grok: {e}")
        return f"API_ERROR: {str(e)}"
