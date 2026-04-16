import os, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from dotenv import load_dotenv; load_dotenv()
from app.pipeline import run_pipeline

FUNDS = [
    "ICICI Prudential Bluechip Fund",
    "ICICI Prudential Flexicap Fund",
    "ICICI Prudential Midcap Fund",
    "ICICI Prudential Smallcap Fund",
    "ICICI Prudential ELSS Tax Saver Fund"
]

TOPICS = [
    "expense ratio",
    "exit load",
    "minimum SIP amount",
    "lock-in period",
    "current NAV"
]

def run_audit():
    print("# RAG System Comprehensive Audit Report\n")
    print(f"Generated at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    total_tests = 0
    passed_tests = 0
    failures = []

    for fund in FUNDS:
        print(f"## {fund}")
        for topic in TOPICS:
            query = f"What is the {topic} of {fund}?"
            total_tests += 1
            print(f"### Query: {query}")
            
            try:
                response = run_pipeline(query)
                success = "not in my current sources" not in response.lower()
                
                if success:
                    passed_tests += 1
                    print(f"**Result**: ✅ PASS")
                else:
                    print(f"**Result**: ❌ FAIL (Data Missing message)")
                    failures.append((query, response))
                
                print(f"**Response**: {response}\n")
            except Exception as e:
                print(f"**Result**: 💥 ERROR: {e}\n")
                failures.append((query, f"ERROR: {e}"))
            
            # Rate limiting sleep
            time.sleep(2)

    print("---")
    print(f"## Summary")
    print(f"- Total Queries: {total_tests}")
    print(f"- Success Rate: {passed_tests}/{total_tests} ({(passed_tests/total_tests)*100:.1f}%)")
    
    if failures:
        print("\n## Failed Queries Detail")
        for q, r in failures:
            print(f"- **{q}**: {r}")

if __name__ == "__main__":
    run_audit()
