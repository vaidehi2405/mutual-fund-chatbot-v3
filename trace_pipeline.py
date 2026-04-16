import os, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from dotenv import load_dotenv; load_dotenv()

print("1. Loading imports...")
from app.pipeline import run_pipeline, get_collection, get_embedder
from app.classify import classify_query, detect_scheme, detect_topic
from app.retriever import retrieve_chunks
from app.generator import generate_answer
from app.validator import validate_response

def trace_pipeline(query):
    print(f"\nTracing query: {query}")
    
    print("2. Classifying...")
    c = classify_query(query)
    print(f"Classification: {c}")
    
    print("3. Detecting scheme/topic...")
    s = detect_scheme(query)
    t = detect_topic(query)
    print(f"Scheme: {s}, Topic: {t}")
    
    print("4. Getting embedder...")
    embedder = get_embedder()
    print("Embedder loaded.")
    
    print("5. Getting collection...")
    col = get_collection()
    print("Collection loaded.")
    
    print("6. Retrieving chunks...")
    chunks = retrieve_chunks(query, s, t, col, embedder)
    print(f"Retrieved {len(chunks)} chunks.")
    
    print("7. Generating answer...")
    ans = generate_answer(query, chunks)
    print(f"Raw answer length: {len(ans)}")
    
    print("8. Validating...")
    val = validate_response(ans)
    print("Validation done.")
    return val

if __name__ == "__main__":
    q = "What is the expense ratio of ICICI Prudential Bluechip Fund?"
    res = trace_pipeline(q)
    print(f"\nFINISH:\n{res}")
