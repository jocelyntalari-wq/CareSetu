import urllib.request
import json
import sys

def run_tests():
    print("Running CareSetu automated workflow verification...")

    # 1. Health check
    res = urllib.request.urlopen('http://localhost:8000/api/health')
    assert res.status == 200, f"Health check failed: {res.status}"
    print("[PASS] 1. Health check 200 OK")

    # 2. Stats
    res = urllib.request.urlopen('http://localhost:8000/api/stats')
    stats = json.loads(res.read().decode('utf-8'))
    print(f"[PASS] 2. Stats retrieved: {stats['total_consultations']} consultations ({stats['general_medicine']} GenMed, {stats['ayurveda']} Ayurveda)")

    # 3. Create Patient Intake Draft (Ayurveda track)
    req_data = json.dumps({
        'specialty': 'Ayurveda',
        'department': 'Kayachikitsa',
        'created_by_role': 'Patient',
        'patient': {
            'name': 'Devendra Mehta',
            'age': 52,
            'gender': 'Male',
            'phone': '+91 98221 11223',
            'blood_group': 'O+',
            'chronic_conditions': 'Chronic Gastritis & Insomnia'
        },
        'health_story': {
            'chief_complaints': 'Sour eructations, epigastric burning, sleep disturbed x 1 month',
            'symptom_duration': '1 month',
            'history_present_illness': 'Symptoms worsen after oily and spicy dinner.',
            'past_medical_history': 'No diabetes, no hypertension',
            'current_medications': 'Antacid gel occasionally',
            'allergies': 'None',
            'lifestyle_notes': 'Software architect, frequent late nights'
        },
        'ayurveda_profile': {
            'prakriti_vata': 35,
            'prakriti_pitta': 50,
            'prakriti_kapha': 15,
            'agni_type': 'Tikshna Agni',
            'koshtha_type': 'Mridu',
            'sleep_pattern': '5 hours/night',
            'dietary_habits': 'Spicy foods, tea 3x/day'
        },
        'documents': [{
            'file_name': 'Abdominal_Ultrasound_Normal_2026.pdf',
            'file_type': 'Imaging',
            'extracted_summary': 'Normal hepatobiliary and pancreatic ultrasound.',
            'extracted_values': {'Liver': 'Normal size', 'Gallbladder': 'No calculi'}
        }]
    }).encode('utf-8')

    req = urllib.request.Request('http://localhost:8000/api/consultations', data=req_data, headers={'Content-Type': 'application/json'}, method='POST')
    res = urllib.request.urlopen(req)
    created = json.loads(res.read().decode('utf-8'))
    assert created['success'] is True
    c_id = created['consultation_id']
    token = created['token']
    print(f"[PASS] 3. Patient Intake Draft created: ID {c_id}, Token {token}")

    # 4. Nurse Triage Vitals Update
    vitals_data = json.dumps({
        'bp_sys': 128, 'bp_dia': 84, 'pulse': 76, 'spo2': 99,
        'temp_f': 98.4, 'blood_sugar': 105, 'weight_kg': 74.0, 'height_cm': 172.0,
        'priority': 'Routine', 'triage_notes': 'Patient vitals within normal limits. Ultrasound report verified.',
        'recorded_by': 'Nurse Sunita Rao, RN'
    }).encode('utf-8')

    req = urllib.request.Request(f'http://localhost:8000/api/consultations/{c_id}/vitals', data=vitals_data, headers={'Content-Type': 'application/json'}, method='PATCH')
    res = urllib.request.urlopen(req)
    v_res = json.loads(res.read().decode('utf-8'))
    assert v_res['success'] is True
    print("[PASS] 4. Nurse Triage vitals recorded and dispatched to Doctor queue")

    # 5. Doctor Review & Correction
    correct_data = json.dumps({
        'health_story': {
            'history_present_illness': 'Epigastric burning post-prandial x 4 weeks; verified non-ulcer dyspepsia / Amlapitta.'
        },
        'correction_summary': 'Doctor verified history and ruled out peptic ulceration.'
    }).encode('utf-8')

    req = urllib.request.Request(f'http://localhost:8000/api/consultations/{c_id}/correct', data=correct_data, headers={'Content-Type': 'application/json'}, method='PATCH')
    res = urllib.request.urlopen(req)
    cor_res = json.loads(res.read().decode('utf-8'))
    assert cor_res['success'] is True
    print("[PASS] 5. Doctor review and clinical corrections saved")

    # 6. Doctor Final Approval
    approve_data = json.dumps({
        'doctor_name': 'Vaidya Meera Namboodiri, BAMS, MD (Ayu)',
        'diagnosis': 'Amlapitta (Pitta-dominant functional dyspepsia with Tikshna Agni)',
        'ayurvedic_nidana': 'Ushna-Tikshna Ahara Sevana leading to Pitta Prakopa in Amashaya',
        'prescriptions': [],
        'ayurvedic_medicines': [
            {'name': 'Avipattikar Churna', 'dose': '3g BD before meals', 'anupana': 'Warm water', 'duration': '15 days'},
            {'name': 'Kamadudha Rasa', 'dose': '1 tab BD after meals', 'anupana': 'Cold milk', 'duration': '30 days'}
        ],
        'pathya_apathya': {
            'pathya': ['Coconut water', 'Barley gruel', 'Sweet pomegranate', 'Adequate sleep by 10:30 PM'],
            'apathya': ['Deep fried snacks', 'Chilli / sour curds', 'Skipping meals']
        },
        'follow_up_advice': 'Follow up after 15 days of medication.',
        'digital_signature': 'Digitally Approved by Vaidya Meera Namboodiri (Reg: AYU-MH-44912)'
    }).encode('utf-8')

    req = urllib.request.Request(f'http://localhost:8000/api/consultations/{c_id}/approve', data=approve_data, headers={'Content-Type': 'application/json'}, method='POST')
    res = urllib.request.urlopen(req)
    app_res = json.loads(res.read().decode('utf-8'))
    assert app_res['success'] is True
    print("[PASS] 6. Doctor Consultation officially approved and digitally signed")

    # 7. Verification of Final Record by Token
    res = urllib.request.urlopen(f'http://localhost:8000/api/consultations/{token}')
    final_rec = json.loads(res.read().decode('utf-8'))
    assert final_rec['consultation']['status'] == 'approved'
    assert final_rec['clinical_notes']['is_approved'] == 1
    assert len(final_rec['audit_trail']) >= 4
    print(f"[PASS] 7. Final Consultation Token {token} verified: Status={final_rec['consultation']['status']}, Audit Trail steps={len(final_rec['audit_trail'])}")
    print("\nALL 7 TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    run_tests()
