from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from email_parser import analyze_headers

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Manually handle OPTIONS requests for /analyze
@app.options("/analyze")
async def preflight():
    return {"message": "CORS preflight handled"}

class EmailHeaders(BaseModel):
    headers: dict

@app.post("/analyze")
async def analyze(email: EmailHeaders):
    result = analyze_headers(email.headers)
    return {"analysis": result}
