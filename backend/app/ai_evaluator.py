import io
import re
from typing import Dict, List
from sentence_transformers import SentenceTransformer, util
from PyPDF2 import PdfReader

GENERIC_JOB_DESC = """
We are seeking a candidate with strong skills in Python, data analysis, machine learning, communication, teamwork, and problem-solving.
"""

KEYWORDS = ["Python", "data analysis", "machine learning", "communication", "teamwork", "problem-solving"]

model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text(contents: bytes, content_type: str) -> str:
    if content_type == "application/pdf":
        reader = PdfReader(io.BytesIO(contents))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    else:
        return contents.decode("utf-8", errors="ignore")

def evaluate_resume(contents: bytes, content_type: str) -> Dict:
    text = extract_text(contents, content_type)
    resume_emb = model.encode(text, convert_to_tensor=True)
    job_emb = model.encode(GENERIC_JOB_DESC, convert_to_tensor=True)
    score = util.cos_sim(resume_emb, job_emb).item()
    score_scaled = int(score * 100)

    found_keywords = [kw for kw in KEYWORDS if re.search(kw, text, re.IGNORECASE)]
    missing = [kw for kw in KEYWORDS if kw not in found_keywords]

    summary = (
        f"Your resume matches {len(found_keywords)} out of {len(KEYWORDS)} key skills. "
        f"Consider adding: {', '.join(missing)}." if missing else "Great match!"
    )

    return {
        "score": score_scaled,
        "keywords": found_keywords,
        "summary": summary
    }