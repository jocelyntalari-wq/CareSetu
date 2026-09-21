"""
CareSetu SQLite & Local Storage Repository
Concrete implementation of BaseStorageRepository using SQLite and private local disk storage.
"""

import os
import json
import random
from datetime import datetime
from typing import Dict, Any, List, Optional
from storage.base_repository import BaseStorageRepository
from database import get_db, row_to_dict, add_audit_log, init_db

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

class SQLiteRepository(BaseStorageRepository):

    def __init__(self):
        init_db()

    async def get_stats(self) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) as total FROM consultations')
        total = cursor.fetchone()['total']

        cursor.execute('SELECT status, COUNT(*) as cnt FROM consultations GROUP BY status')
        by_status = {r['status']: r['cnt'] for r in cursor.fetchall()}

        cursor.execute('SELECT specialty, COUNT(*) as cnt FROM consultations GROUP BY specialty')
        by_specialty = {r['specialty']: r['cnt'] for r in cursor.fetchall()}

        conn.close()
        return {
            "total_consultations": total,
            "draft_submitted": by_status.get('draft_submitted', 0),
            "triaged": by_status.get('triaged', 0),
            "in_consultation": by_status.get('in_consultation', 0),
            "approved": by_status.get('approved', 0),
            "general_medicine": by_specialty.get('General Medicine', 0),
            "ayurveda": by_specialty.get('Ayurveda', 0),
            "storage_provider": "SQLite (Local Private Storage)"
        }

    async def get_consultations(
        self,
        specialty: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
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
        return result

    async def get_consultation(self, id_or_token: str) -> Optional[Dict[str, Any]]:
        conn = get_db()
        cursor = conn.cursor()

        if str(id_or_token).isdigit():
            cursor.execute('SELECT * FROM consultations WHERE id = ?', (int(id_or_token),))
        else:
            cursor.execute('SELECT * FROM consultations WHERE token = ?', (str(id_or_token),))
        c_row = cursor.fetchone()

        if not c_row:
            conn.close()
            return None

        consultation = row_to_dict(c_row)
        c_id = consultation['id']

        cursor.execute('SELECT * FROM patients WHERE id = ?', (consultation['patient_id'],))
        patient = row_to_dict(cursor.fetchone())

        cursor.execute('SELECT * FROM health_stories WHERE consultation_id = ?', (c_id,))
        health_story = row_to_dict(cursor.fetchone())

        cursor.execute('SELECT * FROM ayurveda_profiles WHERE consultation_id = ?', (c_id,))
        ayurveda_profile = row_to_dict(cursor.fetchone())

        cursor.execute('SELECT * FROM documents WHERE consultation_id = ? ORDER BY id DESC', (c_id,))
        documents = []
        for d in cursor.fetchall():
            d_dict = row_to_dict(d)
            if d_dict.get('extracted_values'):
                try:
                    d_dict['extracted_values'] = json.loads(d_dict['extracted_values'])
                except Exception:
                    pass
            documents.append(d_dict)

        cursor.execute('SELECT * FROM vitals_records WHERE consultation_id = ? ORDER BY id DESC LIMIT 1', (c_id,))
        vitals = row_to_dict(cursor.fetchone())

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

        cursor.execute('SELECT * FROM audit_trail WHERE consultation_id = ? ORDER BY id ASC', (c_id,))
        audit_trail = [row_to_dict(a) for a in cursor.fetchall()]

        conn.close()
        return {
            "consultation": consultation,
            "patient": patient,
            "health_story": health_story,
            "ayurveda_profile": ayurveda_profile,
            "documents": documents,
            "vitals": vitals,
            "clinical_notes": clinical_notes,
            "audit_trail": audit_trail
        }

    async def create_consultation(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        patient_data = payload.get('patient', {})
        story_data = payload.get('health_story', {})
        ayur_data = payload.get('ayurveda_profile', {})
        specialty = payload.get('specialty', 'General Medicine')
        department = payload.get('department', 'Internal Medicine' if specialty == 'General Medicine' else 'Kayachikitsa')
        assigned_doctor = payload.get('doctor_name', 'Dr. Arvind Swaminathan, MD' if specialty == 'General Medicine' else 'Vaidya Meera Namboodiri, BAMS, MD (Ayu)')
        created_by_role = payload.get('created_by_role', 'Patient')

        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        random_code = random.randint(1000, 9999)
        token = f"CS-2026-{random_code}"

        conn = get_db()
        cursor = conn.cursor()

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

        cursor.execute('''
        INSERT INTO consultations (token, patient_id, specialty, department, doctor_name, status, priority, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            token, patient_id, specialty, department, assigned_doctor,
            'draft_submitted', 'Routine', now_str, now_str
        ))
        consultation_id = cursor.lastrowid

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

        for doc in payload.get('documents', []):
            cursor.execute('''
            INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                consultation_id,
                doc.get('file_name', 'Patient_Report.pdf'),
                doc.get('file_type', 'Lab Report'),
                doc.get('extracted_summary', 'Biomarkers parsed.'),
                json.dumps(doc.get('extracted_values', {})),
                now_str
            ))

        add_audit_log(consultation_id, created_by_role, 'Draft Created',
                      f"Pre-consultation draft submitted with token {token}", conn=conn)

        conn.commit()
        conn.close()

        return {
            "success": True,
            "consultation_id": consultation_id,
            "token": token,
            "message": "Health story draft submitted successfully."
        }

    async def update_vitals(self, consultation_id: int, vitals_data: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        bp_sys = vitals_data.get('bp_sys')
        bp_dia = vitals_data.get('bp_dia')
        pulse = vitals_data.get('pulse')
        spo2 = vitals_data.get('spo2')
        temp_f = vitals_data.get('temp_f')
        blood_sugar = vitals_data.get('blood_sugar')
        weight_kg = vitals_data.get('weight_kg')
        height_cm = vitals_data.get('height_cm')
        bmi = None
        if weight_kg and height_cm and height_cm > 0:
            bmi = round(weight_kg / ((height_cm / 100) ** 2), 1)

        recorded_by = vitals_data.get('recorded_by', 'Staff Nurse, RN')
        triage_notes = vitals_data.get('triage_notes', 'Vitals checked & verified')
        priority = vitals_data.get('priority', 'Routine')

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('DELETE FROM vitals_records WHERE consultation_id = ?', (consultation_id,))
        cursor.execute('''
        INSERT INTO vitals_records (consultation_id, bp_sys, bp_dia, pulse, spo2, temp_f, blood_sugar, weight_kg, height_cm, bmi, recorded_by, triage_notes, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            consultation_id, bp_sys, bp_dia, pulse, spo2, temp_f, blood_sugar, weight_kg, height_cm, bmi, recorded_by, triage_notes, now_str
        ))

        cursor.execute('''
        UPDATE consultations
        SET status = 'triaged', priority = ?, updated_at = ?
        WHERE id = ?
        ''', (priority, now_str, consultation_id))

        add_audit_log(consultation_id, 'Nurse', 'Triage Completed',
                      f"Vitals recorded ({bp_sys}/{bp_dia} mmHg, Pulse {pulse}). Priority: {priority}", conn=conn)

        conn.commit()
        conn.close()

        return {"success": True, "message": "Vitals and triage status saved successfully."}

    async def correct_draft(self, consultation_id: int, corrections_data: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        conn = get_db()
        cursor = conn.cursor()

        story_updates = corrections_data.get('health_story', {})
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

        cursor.execute('''
        UPDATE consultations
        SET status = 'in_consultation', updated_at = ?
        WHERE id = ? AND status != 'approved'
        ''', (now_str, consultation_id))

        summary = corrections_data.get('correction_summary', 'Doctor corrected draft clinical details')
        add_audit_log(consultation_id, 'Doctor', 'Draft Corrected', summary, conn=conn)

        conn.commit()
        conn.close()
        return {"success": True, "message": "Doctor corrections recorded successfully."}

    async def approve_consultation(self, consultation_id: int, approval_data: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        doctor_name = approval_data.get('doctor_name', 'Attending Physician')
        diagnosis = approval_data.get('diagnosis', 'Clinical assessment finalized')
        ayurvedic_nidana = approval_data.get('ayurvedic_nidana', '')
        doctor_corrections = approval_data.get('doctor_corrections', {})
        prescriptions = approval_data.get('prescriptions', [])
        ayurvedic_medicines = approval_data.get('ayurvedic_medicines', [])
        pathya_apathya = approval_data.get('pathya_apathya', {})
        investigations = approval_data.get('investigations_ordered', '')
        follow_up = approval_data.get('follow_up_advice', 'Follow up in 2 weeks or SOS')
        digital_signature = approval_data.get('digital_signature', f"Digitally Signed by {doctor_name} ({now_str})")

        conn = get_db()
        cursor = conn.cursor()

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

        cursor.execute('''
        UPDATE consultations
        SET status = 'approved', updated_at = ?
        WHERE id = ?
        ''', (now_str, consultation_id))

        add_audit_log(consultation_id, 'Doctor', 'Consultation Approved',
                      f"Approved by {doctor_name}. Diagnosis: {diagnosis}", conn=conn)

        conn.commit()
        conn.close()

        return {
            "success": True,
            "message": "Consultation approved and finalized.",
            "approved_at": now_str,
            "digital_signature": digital_signature
        }

    async def save_document(
        self,
        consultation_id: int,
        file_name: str,
        file_type: str,
        extracted_summary: str,
        extracted_values: Dict[str, Any],
        file_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # If binary file bytes are provided, save locally in private uploads folder
        if file_bytes:
            safe_name = f"doc_{consultation_id}_{int(datetime.now().timestamp())}_{os.path.basename(file_name)}"
            file_path = os.path.join(UPLOADS_DIR, safe_name)
            with open(file_path, 'wb') as f:
                f.write(file_bytes)

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            consultation_id, file_name, file_type, extracted_summary, json.dumps(extracted_values), now_str
        ))
        doc_id = cursor.lastrowid

        add_audit_log(consultation_id, 'Patient', 'Document Uploaded',
                      f"Saved {file_name} into private local storage", conn=conn)

        conn.commit()
        conn.close()

        return {
            "success": True,
            "document_id": doc_id,
            "file_name": file_name,
            "extracted_values": extracted_values
        }
