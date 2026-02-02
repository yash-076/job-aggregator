import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.resume_parser import ResumeParser

# Test text extraction
sample_text = """
John Doe
Software Engineer

Skills: Python, FastAPI, PostgreSQL, React, Docker, AWS
Experience: 5 years in backend development
Education: BS Computer Science

Work Experience:
- Built REST APIs using FastAPI and PostgreSQL
- Deployed applications on AWS using Docker
- Developed React frontends with TypeScript
"""

print("Testing keyword extraction...")
keywords = ResumeParser.extract_keywords(sample_text)
print(f"Extracted {len(keywords)} keywords:")
print(sorted(keywords)[:20])

print("\n" + "="*60)
print("To test with a real PDF:")
print("1. Place a PDF resume in the project root")
print("2. Run: python backend/tests/test_resume_match.py path/to/resume.pdf")
print("="*60)

if __name__ == "__main__" and len(sys.argv) > 1:
    pdf_path = sys.argv[1]
    print(f"\nExtracting text from: {pdf_path}")
    text = ResumeParser.extract_text(pdf_path)
    print(f"Extracted {len(text)} characters")
    print("\nFirst 500 characters:")
    print(text[:1000])
    print("\nKeywords:")
    keywords = ResumeParser.extract_keywords(text)
    print(f"Found {len(keywords)} keywords")
    print(sorted(keywords)[:])
