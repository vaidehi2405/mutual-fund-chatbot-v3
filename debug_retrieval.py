import os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from dotenv import load_dotenv; load_dotenv()
from app.pipeline import get_collection, get_embedder
from app.retriever import retrieve_chunks

def debug_retrieval():
    q = "What is the NAV of the Midcap fund?"
    s = "midcap"
    t = "nav"
    chunks = retrieve_chunks(q, s, t, get_collection(), get_embedder())
    print(f"Query: {q}")
    print(f"Total chunks found: {len(chunks)}")
    for i, c in enumerate(chunks):
        print(f"--- CHUNK {i+1} ---")
        found = "354.62" in c['text']
        print(f"Contains '354.62': {found}")
        print(f"URL: {c['url']}")
        print(f"Text Snippet: {c['text'][:300]}...")
        print("-" * 20)

if __name__ == "__main__":
    debug_retrieval()
