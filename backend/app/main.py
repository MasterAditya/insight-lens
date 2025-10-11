from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .ai_evaluator import evaluate_resume

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type not in ["application/pdf", "text/plain"]:
        return JSONResponse(content={"error": "Invalid file type. Only PDF and TXT files are allowed."}, status_code=400)

    contents = await file.read()
    result = evaluate_resume(contents, file.content_type)
    return JSONResponse(content={
        "filename": file.filename,
        "score": result["score"],
        "keywords": result["keywords"],
        "summary": result["summary"]
    })
