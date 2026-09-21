"""
CareSetu REST API & Application Server
Built with Python standard library (http.server + sqlite3) - Zero external dependencies.
Serves both JSON REST API endpoints and responsive frontend static assets.
"""

import http.server
import socketserver
import urllib.parse
import json
import os
import re
import random
import sys
import io
if sys.platform == 'win32':
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

from datetime import datetime
from database import get_db, row_to_dict, add_audit_log, init_db

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend')

class CareSetuRequestHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Connection', 'close')

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _send_json(self, data, status_code=200):
        body = json.dumps(data, default=str).encode('utf-8')
        self.send_response(status_code)
        self._send_cors_headers()
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_error(self, message, status_code=400):
        self._send_json({"error": message, "success": False}, status_code=status_code)

    def _parse_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        raw = self.rfile.read(content_length).decode('utf-8')
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {}

    # -------------------------------------------------------------------------
    # GET Handlers
    # -------------------------------------------------------------------------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Health check
        if path == '/api/health':
            return self._send_json({"status": "ok", "app": "CareSetu", "time": datetime.now().isoformat()})

        # Statistics summary
        if path == '/api/stats':
            return self.handle_get_stats()

        # Consultation list: /api/consultations
        if path == '/api/consultations':
            return self.handle_get_consultations(query)

        # Single consultation: /api/consultations/<id_or_token>
        match = re.match(r'^/api/consultations/([^/]+)$', path)
        if match:
            return self.handle_get_single_consultation(match.group(1))

        # Default fallback to static file serving from frontend/
        return super().do_GET()

    def handle_get_stats(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) as total FROM consultations')
        total = cursor.fetchone()['total']

        cursor.execute('SELECT status, COUNT(*) as cnt FROM consultations GROUP BY status')
        by_status = {r['status']: r['cnt'] for r in cursor.fetchall()}

        cursor.execute('SELECT specialty, COUNT(*) as cnt FROM consultations GROUP BY specialty')
        by_specialty = {r['specialty']: r['cnt'] for r in cursor.fetchall()}

        conn.close()
        return self._send_json({
            "total_consultations": total,
            "draft_submitted": by_status.get('draft_submitted', 0),
            "triaged": by_status.get('triaged', 0),
            "in_consultation": by_status.get('in_consultation', 0),
            "approved": by_status.get('approved', 0),
            "general_medicine": by_specialty.get('General Medicine', 0),
            "ayurveda": by_specialty.get('Ayurveda', 0)
        })

    def handle_get_consultations(self, query):
        specialty = query.get('specialty', [None])[0]
        status = query.get('status', [None])[0]
        search = query.get('search', [None])[0]

        sql = '''
        SELECT c.id, c.token, c.patient_id, c.specialty, c.department, c.doctor_name,
               c.status, c.priority, c.created_at, c.updated_at,
               p.name as patient_name, p.age as patient_age, p.gender as patient_gender,
               p.phone as patient_phone, p.blood_group, p.chronic_conditions,
               v.bp_sys, v.bp_dia, v.pulse, v.spo2, v.blood_sugar,
               (SELECT COUNT(*) FROM documents d WHERE d.consultation_id = c.id) as doc_count,
               h.chief_complaints
        FROM consultations c
        JOIN patients p ON c.patient_id = p.id
        LEFT JOIN health_stories h ON h.consultation_id = c.id
        LEFT JOIN vitals_records v ON v.consultation_id = c.id
        WHERE 1=1
        '''
        params = []

        if specialty and specialty != 'All':
            sql += ' AND c.specialty = ?'
            params.append(specialty)
        if status and status != 'All':
            sql += ' AND c.status = ?'
            params.append(status)
        if search:
            sql += ' AND (p.name LIKE ? OR c.token LIKE ? OR p.phone LIKE ? OR h.chief_complaints LIKE ?)'
            term = f'%{search}%'
            params.extend([term, term, term, term])

        sql += ' ORDER BY CASE c.priority WHEN "Urgent" THEN 1 WHEN "Follow-up" THEN 2 ELSE 3 END, c.id DESC'

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        result = [row_to_dict(r) for r in rows]
        conn.close()

        return self._send_json({"consultations": result, "count": len(result)})

    def handle_get_single_consultation(self, ident):
        conn = get_db()
        cursor = conn.cursor()

        # Find by ID or by Token (e.g. CS-2026-8941)
        if ident.isdigit():
            cursor.execute('SELECT * FROM consultations WHERE id = ?', (int(ident),))
        else:
            cursor.execute('SELECT * FROM consultations WHERE token = ?', (ident,))
        c_row = cursor.fetchone()

        if not c_row:
            conn.close()
            return self._send_error("Consultation not found", 404)

        consultation = row_to_dict(c_row)
        c_id = consultation['id']

        # Patient details
        cursor.execute('SELECT * FROM patients WHERE id = ?', (consultation['patient_id'],))
        patient = row_to_dict(cursor.fetchone())

        # Health Story draft
        cursor.execute('SELECT * FROM health_stories WHERE consultation_id = ?', (c_id,))
        health_story = row_to_dict(cursor.fetchone())

        # Ayurveda profile
        cursor.execute('SELECT * FROM ayurveda_profiles WHERE consultation_id = ?', (c_id,))
        ayurveda_profile = row_to_dict(cursor.fetchone())

        # Documents
        cursor.execute('SELECT * FROM documents WHERE consultation_id = ? ORDER BY id DESC', (c_id,))
        doc_rows = cursor.fetchall()
        documents = []
        for d in doc_rows:
            d_dict = row_to_dict(d)
            if d_dict.get('extracted_values'):
                try:
                    d_dict['extracted_values'] = json.loads(d_dict['extracted_values'])
                except Exception:
                    pass
            documents.append(d_dict)

        # Vitals
        cursor.execute('SELECT * FROM vitals_records WHERE consultation_id = ? ORDER BY id DESC LIMIT 1', (c_id,))
        vitals = row_to_dict(cursor.fetchone())

        # Clinical notes (Doctor's assessment & approval)
        cursor.execute('SELECT * FROM clinical_notes WHERE consultation_id = ? ORDER BY id DESC LIMIT 1', (c_id,))
        c_notes_row = cursor.fetchone()
        clinical_notes = None
        if c_notes_row:
            clinical_notes = row_to_dict(c_notes_row)
            for json_field in ['doctor_corrections', 'prescriptions', 'ayurvedic_medicines', 'pathya_apathya']:
                if clinical_notes.get(json_field):
                    try:
                        clinical_notes[json_field] = json.loads(clinical_notes[json_field])
                    except Exception:
                        pass

        # Audit trail
        cursor.execute('SELECT * FROM audit_trail WHERE consultation_id = ? ORDER BY id ASC', (c_id,))
        audit_trail = [row_to_dict(a) for a in cursor.fetchall()]

        conn.close()

        return self._send_json({
            "consultation": consultation,
            "patient": patient,
            "health_story": health_story,
            "ayurveda_profile": ayurveda_profile,
            "documents": documents,
            "vitals": vitals,
            "clinical_notes": clinical_notes,
            "audit_trail": audit_trail
        })

    # -------------------------------------------------------------------------
    # POST Handlers
    # -------------------------------------------------------------------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Create new patient & consultation (Patient intake / Assisted intake)
        if path == '/api/consultations':
            return self.handle_create_consultation()

        # Doctor approves & signs consultation
        match_approve = re.match(r'^/api/consultations/(\d+)/approve$', path)
        if match_approve:
            return self.handle_approve_consultation(int(match_approve.group(1)))

        # Upload document / simulated report extractor
        match_doc = re.match(r'^/api/consultations/(\d+)/documents$', path)
        if match_doc:
            return self.handle_add_document(int(match_doc.group(1)))

        return self._send_error("Route not found", 404)

    # -------------------------------------------------------------------------
    # PATCH Handlers
    # -------------------------------------------------------------------------
    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Nurse saves/updates vitals & triage status
        match_vitals = re.match(r'^/api/consultations/(\d+)/vitals$', path)
        if match_vitals:
            return self.handle_update_vitals(int(match_vitals.group(1)))

        # Doctor edits / corrects the draft health story
        match_correct = re.match(r'^/api/consultations/(\d+)/correct$', path)
        if match_correct:
            return self.handle_doctor_correction(int(match_correct.group(1)))

        return self._send_error("Route not found", 404)

    # -------------------------------------------------------------------------
    # Action Implementations
    # -------------------------------------------------------------------------
    def handle_create_consultation(self):
        data = self._parse_body()
        patient_data = data.get('patient', {})
        story_data = data.get('health_story', {})
        ayur_data = data.get('ayurveda_profile', {})
        specialty = data.get('specialty', 'General Medicine')
        department = data.get('department', 'Internal Medicine' if specialty == 'General Medicine' else 'Kayachikitsa')
        assigned_doctor = data.get('doctor_name', 'Dr. Arvind Swaminathan, MD' if specialty == 'General Medicine' else 'Vaidya Meera Namboodiri, BAMS, MD (Ayu)')
        created_by_role = data.get('created_by_role', 'Patient')

        if not patient_data.get('name'):
            return self._send_error("Patient name is required", 400)

        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # Generate token e.g. CS-2026-XXXX
        random_code = random.randint(1000, 9999)
        token = f"CS-2026-{random_code}"

        conn = get_db()
        cursor = conn.cursor()

        # Insert patient
        cursor.execute('''
        INSERT INTO patients (name, age, gender, phone, abha_id, blood_group, chronic_conditions, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            patient_data.get('name'),
            int(patient_data.get('age', 30)),
            patient_data.get('gender', 'Other'),
            patient_data.get('phone', ''),
            patient_data.get('abha_id', f"91-{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}"),
            patient_data.get('blood_group', 'B+'),
            patient_data.get('chronic_conditions', ''),
            now_str
        ))
        patient_id = cursor.lastrowid

        # Insert consultation
        cursor.execute('''
        INSERT INTO consultations (token, patient_id, specialty, department, doctor_name, status, priority, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            token, patient_id, specialty, department, assigned_doctor,
            'draft_submitted', 'Routine', now_str, now_str
        ))
        consultation_id = cursor.lastrowid

        # Insert Health Story draft
        cursor.execute('''
        INSERT INTO health_stories (consultation_id, chief_complaints, symptom_duration, history_present_illness,
                                   past_medical_history, current_medications, allergies, surgical_history,
                                   family_history, lifestyle_notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            consultation_id,
            story_data.get('chief_complaints', ''),
            story_data.get('symptom_duration', ''),
            story_data.get('history_present_illness', ''),
            story_data.get('past_medical_history', ''),
            story_data.get('current_medications', ''),
            story_data.get('allergies', ''),
            story_data.get('surgical_history', ''),
            story_data.get('family_history', ''),
            story_data.get('lifestyle_notes', ''),
            now_str
        ))

        # If Ayurveda, insert ayurveda profile
        if specialty == 'Ayurveda' or ayur_data:
            cursor.execute('''
            INSERT INTO ayurveda_profiles (consultation_id, prakriti_vata, prakriti_pitta, prakriti_kapha,
                                          vikriti_notes, agni_type, koshtha_type, sleep_pattern, dietary_habits, stress_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                consultation_id,
                int(ayur_data.get('prakriti_vata', 33)),
                int(ayur_data.get('prakriti_pitta', 33)),
                int(ayur_data.get('prakriti_kapha', 34)),
                ayur_data.get('vikriti_notes', ''),
                ayur_data.get('agni_type', 'Sama Agni'),
                ayur_data.get('koshtha_type', 'Madhyama'),
                ayur_data.get('sleep_pattern', '6-7 hours'),
                ayur_data.get('dietary_habits', ''),
                ayur_data.get('stress_level', 'Moderate')
            ))

        # If documents were attached in the payload
        docs = data.get('documents', [])
        for doc in docs:
            cursor.execute('''
            INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                consultation_id,
                doc.get('file_name', 'Previous_Report.pdf'),
                doc.get('file_type', 'Lab Report'),
                doc.get('extracted_summary', 'Analyzed prior medical document.'),
                json.dumps(doc.get('extracted_values', {})),
                now_str
            ))

        # Audit logs
        add_audit_log(consultation_id, created_by_role, 'Draft Created',
                      f"Pre-consultation draft submitted with token {token}", conn=conn)

        conn.commit()
        conn.close()

        return self._send_json({
            "success": True,
            "message": "Health story draft submitted successfully!",
            "consultation_id": consultation_id,
            "token": token
        }, 201)

    def handle_update_vitals(self, consultation_id):
        data = self._parse_body()
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        bp_sys = int(data.get('bp_sys', 120)) if data.get('bp_sys') else None
        bp_dia = int(data.get('bp_dia', 80)) if data.get('bp_dia') else None
        pulse = int(data.get('pulse', 72)) if data.get('pulse') else None
        spo2 = int(data.get('spo2', 98)) if data.get('spo2') else None
        temp_f = float(data.get('temp_f', 98.6)) if data.get('temp_f') else None
        blood_sugar = int(data.get('blood_sugar', 110)) if data.get('blood_sugar') else None
        weight_kg = float(data.get('weight_kg', 70)) if data.get('weight_kg') else None
        height_cm = float(data.get('height_cm', 170)) if data.get('height_cm') else None
        bmi = None
        if weight_kg and height_cm and height_cm > 0:
            bmi = round(weight_kg / ((height_cm / 100) ** 2), 1)

        recorded_by = data.get('recorded_by', 'Staff Nurse, RN')
        triage_notes = data.get('triage_notes', 'Vitals checked & documents verified')
        priority = data.get('priority', 'Routine')

        conn = get_db()
        cursor = conn.cursor()

        # Delete existing or insert new vitals
        cursor.execute('DELETE FROM vitals_records WHERE consultation_id = ?', (consultation_id,))
        cursor.execute('''
        INSERT INTO vitals_records (consultation_id, bp_sys, bp_dia, pulse, spo2, temp_f, blood_sugar, weight_kg, height_cm, bmi, recorded_by, triage_notes, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            consultation_id, bp_sys, bp_dia, pulse, spo2, temp_f, blood_sugar, weight_kg, height_cm, bmi, recorded_by, triage_notes, now_str
        ))

        # Update consultation status to 'triaged' and priority
        cursor.execute('''
        UPDATE consultations
        SET status = 'triaged', priority = ?, updated_at = ?
        WHERE id = ?
        ''', (priority, now_str, consultation_id))

        add_audit_log(consultation_id, 'Nurse', 'Triage Completed',
                      f"Vitals recorded ({bp_sys}/{bp_dia} mmHg, Pulse {pulse}). Priority: {priority}", conn=conn)

        conn.commit()
        conn.close()

        return self._send_json({"success": True, "message": "Vitals and triage status saved successfully"})

    def handle_doctor_correction(self, consultation_id):
        """Allows doctor to check, correct, annotate the patient's draft health story before approving."""
        data = self._parse_body()
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        conn = get_db()
        cursor = conn.cursor()

        # Update health story if doctor corrected fields
        story_updates = data.get('health_story', {})
        if story_updates:
            cursor.execute('''
            UPDATE health_stories
            SET chief_complaints = COALESCE(?, chief_complaints),
                symptom_duration = COALESCE(?, symptom_duration),
                history_present_illness = COALESCE(?, history_present_illness),
                past_medical_history = COALESCE(?, past_medical_history),
                current_medications = COALESCE(?, current_medications),
                allergies = COALESCE(?, allergies),
                lifestyle_notes = COALESCE(?, lifestyle_notes)
            WHERE consultation_id = ?
            ''', (
                story_updates.get('chief_complaints'),
                story_updates.get('symptom_duration'),
                story_updates.get('history_present_illness'),
                story_updates.get('past_medical_history'),
                story_updates.get('current_medications'),
                story_updates.get('allergies'),
                story_updates.get('lifestyle_notes'),
                consultation_id
            ))

        # Update status to 'in_consultation'
        cursor.execute('''
        UPDATE consultations
        SET status = 'in_consultation', updated_at = ?
        WHERE id = ? AND status != 'approved'
        ''', (now_str, consultation_id))

        correction_summary = data.get('correction_summary', 'Doctor reviewed and made clinical corrections to the draft')
        add_audit_log(consultation_id, 'Doctor', 'Draft Corrected', correction_summary, conn=conn)

        conn.commit()
        conn.close()

        return self._send_json({"success": True, "message": "Doctor corrections recorded successfully"})

    def handle_approve_consultation(self, consultation_id):
        """Doctor approves and finalizes the consultation with official diagnosis, prescriptions, and digital stamp."""
        data = self._parse_body()
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        doctor_name = data.get('doctor_name', 'Attending Physician')
        diagnosis = data.get('diagnosis', 'Clinical assessment completed')
        ayurvedic_nidana = data.get('ayurvedic_nidana', '')
        doctor_corrections = data.get('doctor_corrections', {})
        prescriptions = data.get('prescriptions', [])
        ayurvedic_medicines = data.get('ayurvedic_medicines', [])
        pathya_apathya = data.get('pathya_apathya', {})
        investigations = data.get('investigations_ordered', '')
        follow_up = data.get('follow_up_advice', 'Follow up in 2 weeks or SOS')
        digital_signature = data.get('digital_signature', f"Digitally Signed by {doctor_name} ({now_str})")

        conn = get_db()
        cursor = conn.cursor()

        # Check existing note
        cursor.execute('DELETE FROM clinical_notes WHERE consultation_id = ?', (consultation_id,))
        cursor.execute('''
        INSERT INTO clinical_notes (consultation_id, doctor_name, diagnosis, ayurvedic_nidana,
                                   doctor_corrections, prescriptions, ayurvedic_medicines, pathya_apathya,
                                   investigations_ordered, follow_up_advice, is_approved, approved_at, digital_signature)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            consultation_id, doctor_name, diagnosis, ayurvedic_nidana,
            json.dumps(doctor_corrections),
            json.dumps(prescriptions),
            json.dumps(ayurvedic_medicines),
            json.dumps(pathya_apathya),
            investigations, follow_up, 1, now_str, digital_signature
        ))

        # Update consultation status to 'approved'
        cursor.execute('''
        UPDATE consultations
        SET status = 'approved', updated_at = ?
        WHERE id = ?
        ''', (now_str, consultation_id))

        add_audit_log(consultation_id, 'Doctor', 'Consultation Approved',
                      f"Approved by {doctor_name}. Diagnosis: {diagnosis}", conn=conn)

        conn.commit()
        conn.close()

        return self._send_json({
            "success": True,
            "message": "Consultation successfully approved and finalized!",
            "approved_at": now_str,
            "digital_signature": digital_signature
        })

    def handle_add_document(self, consultation_id):
        """Simulates uploading a medical report or prescription with smart extraction into draft."""
        data = self._parse_body()
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        file_name = data.get('file_name', 'Patient_Uploaded_Report.pdf')
        file_type = data.get('file_type', 'Lab Report')
        summary = data.get('extracted_summary', 'Biochemical analysis extracted by CareSetu parser.')
        values = data.get('extracted_values', {})

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
        INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            consultation_id, file_name, file_type, summary, json.dumps(values), now_str
        ))
        doc_id = cursor.lastrowid

        add_audit_log(consultation_id, 'Patient', 'Document Attached',
                      f"Attached {file_name} with automated biomarker parsing", conn=conn)

        conn.commit()
        conn.close()

        return self._send_json({
            "success": True,
            "document_id": doc_id,
            "file_name": file_name,
            "extracted_values": values
        }, 201)

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    init_db()
    # Check if database needs seeding
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as cnt FROM patients')
    if cursor.fetchone()['cnt'] == 0:
        print("Empty database detected. Running seed data...")
        from seed_data import seed
        seed()
    conn.close()

    with ThreadedTCPServer(("", PORT), CareSetuRequestHandler) as httpd:
        print("==================================================")
        print(f"CareSetu Server running at: http://localhost:{PORT}")
        print("CareSetu REST API and static frontend initialized.")
        print("==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down CareSetu server...")
            httpd.shutdown()

if __name__ == '__main__':
    run_server()
