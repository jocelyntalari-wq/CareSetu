"""
CareSetu FastAPI Application Server
Async backend providing REST endpoints for Patients, Doctors, Nurses, and Support Staff,
abstracted persistence (Supabase with SQLite fallback), and secure cloud AI integrations
(Bhashini, Azure Document Intelligence, Gemini).
"""

import os
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from storage.factory import get_storage_repository
from integrations.bhashini_service import get_bhashini_service
from integrations.azure_doc_service import get_azure_doc_service
from integrations.gemini_service import get_gemini_service

app = FastAPI(
    title="CareSetu API",
    description="Your health story, ready for your doctor.",
    version="2.0.0"
)

# CORS Middleware allowing Flutter Web, Chrome, and mobile access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

repository = get_storage_repository()
bhashini = get_bhashini_service()
azure_doc = get_azure_doc_service()
gemini = get_gemini_service()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend')
FLUTTER_WEB_DIR = os.path.join(os.path.dirname(BASE_DIR), 'flutter_app', 'build', 'web')

# -----------------------------------------------------------------------------
# Pydantic Schemas
# -----------------------------------------------------------------------------
class PatientSchema(BaseModel):
    name: str
    age: int
    gender: str = "Other"
    phone: Optional[str] = ""
    abha_id: Optional[str] = ""
    blood_group: Optional[str] = "B+"
    chronic_conditions: Optional[str] = ""

class HealthStorySchema(BaseModel):
    chief_complaints: str
    symptom_duration: Optional[str] = "2 weeks"
    history_present_illness: Optional[str] = ""
    past_medical_history: Optional[str] = ""
    current_medications: Optional[str] = ""
    allergies: Optional[str] = "None"
    surgical_history: Optional[str] = "None"
    family_history: Optional[str] = ""
    lifestyle_notes: Optional[str] = ""

class AyurvedaProfileSchema(BaseModel):
    prakriti_vata: int = 33
    prakriti_pitta: int = 33
    prakriti_kapha: int = 34
    vikriti_notes: Optional[str] = ""
    agni_type: Optional[str] = "Sama Agni"
    koshtha_type: Optional[str] = "Madhyama"
    sleep_pattern: Optional[str] = "6-7 hours"
    dietary_habits: Optional[str] = ""
    stress_level: Optional[str] = "Moderate"

class CreateConsultationRequest(BaseModel):
    specialty: str = "General Medicine" # 'General Medicine' or 'Ayurveda'
    department: Optional[str] = "Internal Medicine"
    doctor_name: Optional[str] = None
    created_by_role: str = "Patient"
    patient: PatientSchema
    health_story: HealthStorySchema
    ayurveda_profile: Optional[AyurvedaProfileSchema] = None
    documents: Optional[List[Dict[str, Any]]] = []

class VitalsUpdateRequest(BaseModel):
    bp_sys: Optional[int] = 120
    bp_dia: Optional[int] = 80
    pulse: Optional[int] = 74
    spo2: Optional[int] = 98
    temp_f: Optional[float] = 98.6
    blood_sugar: Optional[int] = 110
    weight_kg: Optional[float] = 70.0
    height_cm: Optional[float] = 170.0
    priority: str = "Routine"
    triage_notes: Optional[str] = "Vitals recorded and verified"
    recorded_by: Optional[str] = "Staff Nurse, RN"

class DoctorCorrectionRequest(BaseModel):
    health_story: Optional[Dict[str, Any]] = None
    correction_summary: Optional[str] = "Doctor clinical revisions"

class DoctorApprovalRequest(BaseModel):
    doctor_name: str
    diagnosis: str
    ayurvedic_nidana: Optional[str] = ""
    doctor_corrections: Optional[Dict[str, Any]] = {}
    prescriptions: Optional[List[Dict[str, Any]]] = []
    ayurvedic_medicines: Optional[List[Dict[str, Any]]] = []
    pathya_apathya: Optional[Dict[str, Any]] = {}
    investigations_ordered: Optional[str] = ""
    follow_up_advice: Optional[str] = "Follow up in 2 weeks or SOS"
    digital_signature: Optional[str] = ""

class BhashiniASRRequest(BaseModel):
    audio_base64: str
    language: str = "hi"

class GeminiOrganizeRequest(BaseModel):
    raw_complaint: str
    voice_transcript: Optional[str] = ""
    document_insights: Optional[str] = ""
    specialty: Optional[str] = "General Medicine"
    ayurveda_inputs: Optional[Dict[str, Any]] = None

# -----------------------------------------------------------------------------
# System & Core Consultation Routes
# -----------------------------------------------------------------------------
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "app": "CareSetu",
        "stack": "FastAPI + Flutter",
        "storage": os.getenv("STORAGE_BACKEND", "sqlite")
    }

@app.get("/api/stats")
async def get_stats():
    return await repository.get_stats()

@app.get("/api/consultations")
async def list_consultations(
    specialty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    consultations = await repository.get_consultations(specialty, status, search)
    return {"consultations": consultations, "count": len(consultations)}

@app.get("/api/consultations/{id_or_token}")
async def get_consultation(id_or_token: str):
    record = await repository.get_consultation(id_or_token)
    if not record:
        raise HTTPException(status_code=404, detail="Consultation record not found")
    return record

@app.post("/api/consultations", status_code=status.HTTP_201_CREATED)
async def create_consultation(req: CreateConsultationRequest):
    return await repository.create_consultation(req.dict())

@app.patch("/api/consultations/{consultation_id}/vitals")
async def update_vitals(consultation_id: int, req: VitalsUpdateRequest):
    return await repository.update_vitals(consultation_id, req.dict())

@app.patch("/api/consultations/{consultation_id}/correct")
async def correct_draft(consultation_id: int, req: DoctorCorrectionRequest):
    return await repository.correct_draft(consultation_id, req.dict())

@app.post("/api/consultations/{consultation_id}/approve")
async def approve_consultation(consultation_id: int, req: DoctorApprovalRequest):
    return await repository.approve_consultation(consultation_id, req.dict())

@app.post("/api/consultations/{consultation_id}/documents", status_code=status.HTTP_201_CREATED)
async def upload_document(
    consultation_id: int,
    file_name: str = Form("Medical_Record.pdf"),
    file_type: str = Form("Lab Report"),
    extracted_summary: Optional[str] = Form("Parsed clinical report."),
    file: Optional[UploadFile] = File(None)
):
    file_bytes = await file.read() if file else None
    doc_insights = await azure_doc.extract_document_insights(file_name, file_bytes)
    return await repository.save_document(
        consultation_id=consultation_id,
        file_name=file_name,
        file_type=file_type,
        extracted_summary=doc_insights.get("extracted_summary", extracted_summary),
        extracted_values=doc_insights.get("extracted_values", {}),
        file_bytes=file_bytes
    )

# -----------------------------------------------------------------------------
# Cloud AI Integration Endpoints (Bhashini, Azure, Gemini)
# -----------------------------------------------------------------------------
@app.post("/api/integrations/bhashini/asr")
async def bhashini_asr(req: BhashiniASRRequest):
    """Speech-to-Text in Indian languages for voice-driven health intake."""
    return await bhashini.speech_to_text(req.audio_base64, req.language)

@app.get("/api/integrations/bhashini/prompts")
async def bhashini_prompts(language: str = "hi"):
    """Localized spoken intake prompts for patients."""
    prompts = await bhashini.get_spoken_prompts(language)
    return {"language": language, "prompts": prompts}

@app.post("/api/integrations/azure-doc/extract")
async def azure_doc_extract(
    file_name: str = Form("Blood_Report.pdf"),
    file: Optional[UploadFile] = File(None)
):
    """Extracts biomarkers & tables from lab reports via Azure Document Intelligence."""
    file_bytes = await file.read() if file else None
    return await azure_doc.extract_document_insights(file_name, file_bytes)

@app.post("/api/integrations/gemini/organize")
async def gemini_organize_story(req: GeminiOrganizeRequest):
    """Gemini AI synthesizes voice, documents, and inputs into an organized clinical draft."""
    return await gemini.organize_health_story(
        raw_complaint=req.raw_complaint,
        voice_transcript=req.voice_transcript,
        document_insights=req.document_insights,
        specialty=req.specialty,
        ayurveda_inputs=req.ayurveda_inputs
    )

# -----------------------------------------------------------------------------
# Static Web App Mount (Runs in Chrome)
# -----------------------------------------------------------------------------
# Serve compiled Flutter Web if available; otherwise serve responsive web frontend
active_web_dir = FLUTTER_WEB_DIR if os.path.exists(FLUTTER_WEB_DIR) else FRONTEND_DIR
if os.path.exists(active_web_dir):
    app.mount("/", StaticFiles(directory=active_web_dir, html=True), name="static_web")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
