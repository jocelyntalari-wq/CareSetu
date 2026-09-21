# CareSetu (केयरसेतु) — Digital Health Passport & Doctor Summary Bridge

> **“Your health story, connected to better care.”**  
> *CareSetu bridges the gap between patient health histories and doctor consultations through structured draft summaries for General Medicine and Ayurveda.*

---

## 📌 Table of Contents

- [Overview](#overview)
- [App Flow](#app-flow)
- [Installation Dependencies](#how-to-install-dependencies)
- [Running the Backend](#how-to-run-the-backend)
- [Running the App](#how-to-run-the-app)
- [API Keys Configuration](#where-to-add-api-keys)
- [Using the Demo Account](#how-to-use-the-demo-account)
- [Mock Features & Fallbacks](#which-features-are-mock-features)
- [Screen-by-Screen Specifications](#screen-by-screen-specifications)
- [Data Models](#data-models)
- [Safety & Clinical Compliance Rules](#safety--clinical-compliance-rules)
- [Prototype Success Criteria](#prototype-success-criteria)

---

## 🌟 Overview

**CareSetu** (केयरसेतु) is a patient-facing digital health passport application. It empowers patients—especially those with low digital literacy or language barriers—to organize their health complaints, medical histories, daily habits, lifestyle routines (Ayurveda), and uploaded medical documents into a clean, structured 1-page draft summary for their doctor.

CareSetu serves as a visual bridge:
```
[ Patient's Health Story & Documents ]  ───CareSetu Bridge🌉───>  [ Structured Doctor Summary ]
```

---

## 🔄 App Flow

```
Welcome ➔ Language Selection ➔ Consent ➔ Home Passport ➔ Patient Profile ➔ General Medicine or Ayurveda ➔ Questions & Body Map ➔ Upload Reports ➔ Document Processing ➔ AI Draft Summary ➔ Review & Edit ➔ Show to Doctor
```

---

## ⚙️ How to Install Dependencies

CareSetu is designed with modularity, supporting both a **zero-dependency Python standard library server** and an enhanced **FastAPI + Flutter** stack.

### 1. Backend Dependencies

#### Option A: Zero-Dependency Python Server (Recommended for quick demo)
- Requires only **Python 3.8+** (Uses standard library modules `http.server`, `sqlite3`, `json`, `urllib`).
- No `pip install` required!

#### Option B: FastAPI Async Server (For advanced features & live cloud integrations)
```bash
# Navigate to project root
cd CareSetu

# Install required Python packages
pip install fastapi uvicorn pydantic requests python-dotenv
```

### 2. Web Frontend Dependencies
- Standard **Vanilla HTML5 / CSS3 / JavaScript (ES6)**.
- No node packages or npm builds required. Runs directly in any modern web browser.

### 3. Flutter Mobile App Dependencies (Optional)
```bash
# Navigate to flutter_app directory
cd flutter_app

# Fetch Flutter pub packages
flutter pub get
```

---

## 🖥️ How to Run the Backend

### Option A: Standard Library HTTP Server (Zero Dependencies)
Run from the root directory:
```bash
python backend/server.py
```
*The server will initialize `caresetu.db` (SQLite) and host both the REST API and the Frontend on `http://localhost:8000`.*

### Option B: FastAPI Server with Uvicorn
Run from the root directory:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*API documentation will be available at `http://localhost:8000/docs`.*

---

## 📱 How to Run the App

### 1. Web Application (Recommended)
1. Start the backend server using either `python backend/server.py` or `uvicorn backend.main:app`.
2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```
3. Use the desktop frame controls at the top to toggle between **📱 Mobile View** and **🖥️ Expanded View**, or switch demo patient profiles.

### 2. Flutter Mobile / Web App
```bash
cd flutter_app

# Run on Web (Chrome)
flutter run -d chrome

# Run on Android / iOS connected device
flutter run
```

---

## 🔑 Where to Add API Keys

CareSetu is designed to work **100% offline and keyless** using built-in simulators. However, to connect real cloud AI providers, configure your keys in the `.env` file.

1. Copy `.env.example` to create `.env` in the root project folder:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your API credentials:

```ini
# ==============================================================================
# CareSetu API Keys & Cloud Configuration
# ==============================================================================

# Server Settings
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
STORAGE_BACKEND=sqlite # Options: 'sqlite' or 'supabase'

# Google Gemini API (For AI Clinical Summary Formatting & Structuring)
# Get key: https://aistudio.google.com/
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Bhashini ULCA API (For Indian Language Speech-to-Text & Voice Synthesis)
# Get key: https://bhashini.gov.in/
BHASHINI_USER_ID=your_bhashini_user_id
BHASHINI_API_KEY=your_bhashini_api_key
BHASHINI_PIPELINE_ID=your_bhashini_pipeline_id

# Azure Document Intelligence (For Medical Prescription & Lab Report OCR)
# Get key: https://portal.azure.com/
AZURE_DOC_INTEL_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_DOC_INTEL_KEY=your_azure_document_intelligence_key

# Supabase Storage & Database (Optional alternative to local SQLite)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_BUCKET=care_documents
```

> 💡 **Note:** If API keys are omitted or invalid, CareSetu automatically activates its offline fallback engines (Web Speech API + Regex OCR Parser + Mock Summarizer) without throwing runtime errors.

---

## 👤 How to Use the Demo Account

CareSetu includes pre-loaded demo profiles to test the full end-to-end journey immediately:

### 1. Default Demo Patient: **Ananya Rao**
- **Age:** 22
- **Gender:** Female
- **Language:** English
- **Existing Conditions:** None provided
- **Current Medicines:** Not provided
- **Known Allergies:** Unknown
- **Chief Complaint:** Stomach pain
- **How to access:** Select **"Ananya Rao"** or **"Start Fresh Patient Intake"** from the demo profile switcher in the top desktop control bar.

### 2. Pre-Loaded Case Profiles for Testing
- **Case 1: Ramesh Chandra Sharma (58M, GenMed)**
  - *Track:* General Medicine (Diabetes, Hypertension, Penicillin Allergy)
  - *Scenario:* 4-day history of chest heaviness and breathlessness on walking.
- **Case 2: Sunita Devi (62F, Ayurveda)**
  - *Track:* Ayurveda & Lifestyle (Agni, Koshtha, Nidra)
  - *Scenario:* Vishamagni (bloating, irregular appetite), hard stools, disturbed sleep.

---

## 🎭 Which Features are Mock Features

For prototype evaluation without external service dependency, the following features operate with simulated or mock implementations:

1. **OCR Document Processing Engine (Simulator):**
   - When Azure Document Intelligence keys are absent, uploaded documents are parsed using a local rule-based medical term extractor.
   - Includes simulated OCR confidence warnings (*"Some information could not be read. Please check the original document."*).

2. **Indian Language Voice Recognition & Text-to-Speech:**
   - Uses browser-native `webkitSpeechRecognition` and `window.speechSynthesis` as a fallback when Bhashini API credentials are not set.

3. **Emergency SOS Receiver Dispatch:**
   - Displays a live emergency overlay with direct telephone links (`tel:108`, `tel:112`).
   - Triggering the alert shows: *"Demo alert created. A real hospital receiver must be connected before this feature is used in practice."* (Never displays false confirmation that help is on the way).

4. **Sample Medical Records:**
   - Pre-packaged sample prescriptions, lab reports, and discharge summaries are provided for instant upload testing.

---

## 📱 Screen-by-Screen Specifications

CareSetu consists of **16 core screens** designed according to strict safety, accessibility, and UI guidelines:

| Screen # | Screen Name | Key Features & Implementation Details |
|---|---|---|
| **Screen 1** | **Welcome** | CareSetu Logo, Bridge Illustration, "Your health story, connected to better care.", "Start" & "Choose Language" buttons, disclaimer line ("CareSetu helps you organize information for your doctor."). |
| **Screen 2** | **Language Selection** | Large visual cards for English, हिंदी, and తెలుగు. Saves selection, translates UI labels, and provides audio speaker read-aloud buttons. |
| **Screen 3** | **Consent** | Plain-language disclosure ("Stores information to prepare draft summary. Does not diagnose or prescribe."), "I Understand and Continue", "I Do Not Agree", emergency safety notice, and prominent red SOS button. |
| **Screen 4** | **Home (Passport Journey)** | Visual passport path showing completion steps: 1. My Profile, 2. Today's Problem, 3. Previous Health, 4. My Reports, 5. Doctor Summary. Two large illustrated portal cards: **GENERAL MEDICINE** and **AYURVEDA**. Fixed bottom navigation dock. |
| **Screen 5** | **Patient Profile** | Fields: Name, Age, Gender, Phone, Emergency Contact, Diagnosed Conditions, Medicines, Allergies. Each field supports: Confirm, Edit, Skip, "I Don't Know". Return banner: *"Are these details still correct?"* |
| **Screen 6** | **General Medicine** | Blue theme. Illustrated options: Today's Problem, Previous Illnesses, Surgeries, Medicines, Allergies, Family History, Daily Habits. Guided single-question flow with Speak/Type/Icon inputs. Follow-up questions for severity, duration, triggers. |
| **Screen 7** | **Body Map** | Interactive visual body selector (Head, Chest, Stomach, Back, Hands, Legs, Whole Body). Links directly to guided symptom follow-ups with audio voice guidance. |
| **Screen 8** | **Ayurveda** | Green & Cream theme. Circular options for **Ahara** (food), **Agni** (digestion), **Koshtha** (bowel pattern), **Mutra** (urination), **Nidra** (sleep), **Vihara** (routine), **Vyayama Shakti** (exercise), and previous Ayurveda history. *Strictly shows "Not assessed" for Vata/Pitta/Kapha/Prakriti unless assessed by a qualified practitioner.* |
| **Screen 9** | **Upload Reports** | Digital health folder design. Upload/photo support for prescriptions, lab reports, discharge summaries. Shows clear permission notice and file management cards (Preview, Name, Type, Date, Delete). |
| **Screen 10** | **Document Processing** | Animated visual bridge showing 5 stages: 1. Uploaded, 2. Reading text, 3. Finding key info, 4. Preparing draft summary, 5. Ready for review. Shows OCR unreadable alerts when text is unclear. |
| **Screen 11** | **AI Draft Summary** | Clean 1-page doctor card. Explicitly displays *"AI-generated draft. Please verify this information with a doctor."* Marks missing fields as *Not provided*, *Unknown*, or *Not answered*. Never invents data. |
| **Screen 12** | **Show to Doctor** | Clean handoff screen: *"Your health summary is ready."* Buttons: Show Summary on Phone (high-contrast full screen), Download PDF, Print Summary, Share Securely. Doctor confirmation notice. |
| **Screen 13** | **Saved Histories** | Passport history pages timeline (e.g., 17 Sept 2026 — Stomach pain). Each card displays date, section used, main complaint, uploaded documents, open summary button, and edit options. |
| **Screen 14** | **My Reports** | Document locker grid with category filter tags (Prescriptions, Lab Reports, Discharge Summaries, Other). File preview and management options. |
| **Screen 15** | **Emergency Help** | High-contrast Red/Orange SOS view: *"Are you in immediate danger?"* Direct phone triggers (`108` Ambulance, `112` Emergency). Displays demo alert warning message. |
| **Screen 16** | **Privacy Settings** | Plain-language privacy controls: View/Withdraw consent, Delete uploaded documents, Delete saved history, Download my data, Log out. |

---

## 🗄️ Data Models

### 1. Patient
```json
{
  "id": "PAT-9842-DL",
  "name": "Ananya Rao",
  "age": 22,
  "gender": "Female",
  "phone": "+91 98765 43210",
  "emergencyContact": "Rajesh Rao (Father): +91 98765 12345",
  "conditions": "None provided",
  "medicines": "Not provided",
  "allergies": "Unknown",
  "selectedLanguage": "en"
}
```

### 2. HealthHistory
```json
{
  "id": "HIST-2026-001",
  "patientId": "PAT-9842-DL",
  "section": "General Medicine",
  "date": "2026-09-20",
  "complaint": "Stomach pain",
  "answers": {
    "symptom": "Stomach Ache / Gas",
    "severity": "Moderate",
    "duration": "4 Days",
    "bodyPart": "Stomach",
    "notes": "Sharp pain after eating oily food."
  },
  "unknownFields": ["family_history", "surgical_history"],
  "summaryStatus": "draft"
}
```

### 3. Document
```json
{
  "id": "DOC-2026-881",
  "patientId": "PAT-9842-DL",
  "fileName": "Stomach_Prescription_Aug2026.pdf",
  "documentType": "Prescription",
  "uploadedDate": "2026-09-20",
  "fileUrl": "/storage/uploads/Stomach_Prescription_Aug2026.pdf",
  "extractedText": "Rx: Tab Pantoprazole 40mg OD AC, Tab Drotaverine 80mg BD",
  "extractionStatus": "success"
}
```

### 4. Summary
```json
{
  "id": "SUMM-2026-001",
  "historyId": "HIST-2026-001",
  "mainProblem": "Stomach pain",
  "duration": "4 Days",
  "symptoms": ["Stomach Ache / Gas", "Nausea after meals"],
  "conditions": "None provided",
  "medicines": "Not provided",
  "allergies": "Unknown",
  "reportFindings": "Prescription from Aug 2026 attached",
  "unknownInformation": ["Family History", "Surgical History"],
  "verifiedByPatient": true,
  "createdDate": "2026-09-20"
}
```

---

## 🛡️ Safety & Clinical Compliance Rules

CareSetu strictly enforces the following clinical safety rules across all screens, backend routes, and AI prompt pipelines:

1. ❌ **Never Diagnose Diseases:** CareSetu does not infer or display medical diagnoses.
2. ❌ **Never Prescribe Medicines:** CareSetu records current medicines only; it never recommends treatments or dosages.
3. ❌ **Never Recommend Changing Medicines:** CareSetu never suggests stopping or modifying doctor-prescribed medications.
4. ❌ **Never Give Treatment Instructions:** CareSetu provides no home remedies or treatment protocols.
5. ❌ **Never Claim AI Verification:** AI outputs are explicitly labeled as drafts requiring doctor verification.
6. ❌ **Never Guess Missing Information:** Unanswered fields are explicitly populated as *"Not provided"*, *"Unknown"*, or *"Not answered"*.
7. ✅ **Always Allow "I Don't Know":** Every questionnaire step provides an explicit "I Don't Know" or "Skip" button.
8. ✅ **Always Allow Patient Edits:** The patient maintains full editing rights over their generated summary before handoff.
9. ✅ **Always Link Original Documents:** Every extracted biomarker or report finding remains linked to its original document.
10. ✅ **Prominent AI Draft Watermark:** Summaries feature a mandatory header: *"AI-generated draft. Please verify this information with a doctor."*
11. ✅ **Unconditional SOS Access:** Emergency SOS help is accessible at all times without requiring questionnaire completion.
12. ✅ **Explicit Consent:** Patient information is stored and formatted only after explicit consent is granted.

---

## ✅ Prototype Success Criteria

The prototype satisfies all 12 validation steps in the end-to-end patient journey:

1. [x] **Patient opens CareSetu** ➔ Welcome screen displays brand logo, bridge graphic, tagline, and start options.
2. [x] **Patient selects language** ➔ Visual cards for English, Hindi, Telugu with spoken audio prompts.
3. [x] **Patient gives consent** ➔ Clear disclosure of storage & draft scope with SOS safety banner.
4. [x] **Patient views Home screen** ➔ Digital Health Passport card with visual 5-step journey path.
5. [x] **Patient selects General Medicine or Ayurveda** ➔ Large illustrated portal entry cards.
6. [x] **Patient answers questions** ➔ Single-question guided intake using voice, text typing, or symptom icons.
7. [x] **Patient uploads an old report** ➔ Digital health folder with camera photo & PDF upload options.
8. [x] **App shows document processing** ➔ Visual 5-stage bridge animation with OCR reading status.
9. [x] **App creates draft summary** ➔ Structured 1-page doctor card with explicit missing data labels.
10. [x] **Patient edits or confirms summary** ➔ Interactive edit inputs and confirm toggles.
11. [x] **Patient opens original document** ➔ Side-by-side or modal preview of original uploaded document.
12. [x] **Patient shows or downloads summary for doctor** ➔ High-contrast "Show to Doctor Mode" & PDF export options.

---

<p align="center">
  <b>CareSetu — Bridging Patient Stories & Clinical Consultations</b><br>
  <i>Built with ❤️ for Indian Healthcare Accessibility</i>
</p>
