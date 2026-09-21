"""
CareSetu Database Layer - SQLite Storage
Handles relational data for Patients, Consultations, Health Stories, Ayurveda Profiles,
Documents, Vitals, Clinical Notes, and Audit Trail.
"""

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'caresetu.db')

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Patients table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        phone TEXT,
        abha_id TEXT,
        blood_group TEXT,
        chronic_conditions TEXT,
        created_at TEXT NOT NULL
    )
    ''')

    # Consultations table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT UNIQUE NOT NULL,
        patient_id INTEGER NOT NULL,
        specialty TEXT NOT NULL, -- 'General Medicine' or 'Ayurveda'
        department TEXT NOT NULL,
        doctor_name TEXT,
        status TEXT NOT NULL, -- 'draft_submitted', 'triaged', 'in_consultation', 'approved'
        priority TEXT DEFAULT 'Routine', -- 'Routine', 'Urgent', 'Follow-up'
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    ''')

    # Health Stories (Pre-consultation draft submitted by patient / support staff)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS health_stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER NOT NULL,
        chief_complaints TEXT,
        symptom_duration TEXT,
        history_present_illness TEXT,
        past_medical_history TEXT,
        current_medications TEXT,
        allergies TEXT,
        surgical_history TEXT,
        family_history TEXT,
        lifestyle_notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (consultation_id) REFERENCES consultations(id)
    )
    ''')

    # Ayurveda Profiles (Dosha, Agni, Koshtha, Ahara/Vihara)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ayurveda_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER NOT NULL,
        prakriti_vata INTEGER DEFAULT 33,
        prakriti_pitta INTEGER DEFAULT 33,
        prakriti_kapha INTEGER DEFAULT 34,
        vikriti_notes TEXT,
        agni_type TEXT, -- Sama, Tikshna, Manda, Vishama
        koshtha_type TEXT, -- Krura, Madhyama, Mridu
        sleep_pattern TEXT,
        dietary_habits TEXT,
        stress_level TEXT,
        FOREIGN KEY (consultation_id) REFERENCES consultations(id)
    )
    ''')

    # Uploaded medical records & simulated smart extractor
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL, -- 'Lab Report', 'Prescription', 'Discharge Summary', 'Imaging'
        extracted_summary TEXT,
        extracted_values TEXT, -- JSON string of key biomarkers/findings
        uploaded_at TEXT NOT NULL,
        FOREIGN KEY (consultation_id) REFERENCES consultations(id)
    )
    ''')

    # Vitals recorded by Nurse at triage
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS vitals_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER NOT NULL,
        bp_sys INTEGER,
        bp_dia INTEGER,
        pulse INTEGER,
        spo2 INTEGER,
        temp_f REAL,
        blood_sugar INTEGER,
        weight_kg REAL,
        height_cm REAL,
        bmi REAL,
        recorded_by TEXT,
        triage_notes TEXT,
        recorded_at TEXT NOT NULL,
        FOREIGN KEY (consultation_id) REFERENCES consultations(id)
    )
    ''')

    # Clinical Notes & Approvals (Doctor review, check, correct, approve)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS clinical_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER NOT NULL,
        doctor_name TEXT,
        diagnosis TEXT,
        ayurvedic_nidana TEXT,
        doctor_corrections TEXT, -- JSON of fields corrected by doctor
        prescriptions TEXT, -- JSON list of medicines
        ayurvedic_medicines TEXT, -- JSON list of herbal formulations
        pathya_apathya TEXT, -- Dietary Do's & Don'ts
        investigations_ordered TEXT,
        follow_up_advice TEXT,
        is_approved INTEGER DEFAULT 0,
        approved_at TEXT,
        digital_signature TEXT,
        FOREIGN KEY (consultation_id) REFERENCES consultations(id)
    )
    ''')

    # Audit Trail (Full traceability for medical governance)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_trail (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultation_id INTEGER NOT NULL,
        role TEXT NOT NULL, -- 'Patient', 'Nurse', 'Doctor', 'Support Staff'
        action TEXT NOT NULL,
        details TEXT,
        timestamp TEXT NOT NULL
    )
    ''')

    conn.commit()
    conn.close()

def row_to_dict(row):
    if row is None:
        return None
    return dict(row)

def add_audit_log(consultation_id, role, action, details, conn=None):
    close_after = False
    if conn is None:
        conn = get_db()
        close_after = True
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO audit_trail (consultation_id, role, action, details, timestamp) VALUES (?, ?, ?, ?, ?)',
        (consultation_id, role, action, details, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    conn.commit()
    if close_after:
        conn.close()

if __name__ == '__main__':
    init_db()
    print("CareSetu database initialized at", DB_PATH)
