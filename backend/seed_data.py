"""
CareSetu Seed Data Generator
Pre-populates realistic fictional clinical records for General Medicine and Ayurveda
spanning all four consultation lifecycle stages (Draft, Triaged, In-Consultation, Approved).
"""

import json
from datetime import datetime
from database import get_db, init_db, add_audit_log

def seed():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # Check if data already seeded
    cursor.execute('SELECT COUNT(*) as count FROM patients')
    if cursor.fetchone()['count'] > 0:
        print("Database already populated. Skipping seed.")
        conn.close()
        return

    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # -------------------------------------------------------------
    # PATIENT 1: Rajesh Sharma (General Medicine - Triaged)
    # -------------------------------------------------------------
    cursor.execute('''
    INSERT INTO patients (name, age, gender, phone, abha_id, blood_group, chronic_conditions, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'Rajesh Sharma', 48, 'Male', '+91 98112 34567', '91-4521-8834-1029', 'B+',
        'Type 2 Diabetes Mellitus (6 yrs), Essential Hypertension (3 yrs)', now_str
    ))
    p1_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO consultations (token, patient_id, specialty, department, doctor_name, status, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'CS-2026-8941', p1_id, 'General Medicine', 'Internal Medicine', 'Dr. Arvind Swaminathan, MD',
        'triaged', 'Routine', now_str, now_str
    ))
    c1_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO health_stories (consultation_id, chief_complaints, symptom_duration, history_present_illness,
                               past_medical_history, current_medications, allergies, surgical_history, family_history, lifestyle_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c1_id,
        'Generalized weakness, excessive thirst (polydipsia) for 3 weeks, bilateral knee aching while walking or climbing stairs.',
        '3 to 4 weeks',
        'Patient reports progressive fatigue and polyuria over last month. Admitted to missing metformin doses due to travel. Noticed increased knee stiffness especially in morning hours lasting 15 mins.',
        'Diagnosed with Type 2 Diabetes in 2020; Mild hypertension diagnosed in 2023.',
        'Tab. Metformin 500mg (1-0-1), Tab. Telmisartan 40mg (1-0-0)',
        'Sulfa antimicrobial drugs (developed erythematous skin rash in 2018)',
        'Appendectomy in 2008 (uneventful recovery)',
        'Father had Type 2 Diabetes and Ischemic Heart Disease; Mother has Osteoarthritis.',
        'Desk job (IT consultant), sedentary 9 hrs/day. Vegetarian diet, occasional sweets.',
        now_str
    ))

    # Documents for Rajesh
    cursor.execute('''
    INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        c1_id, 'Metropolis_Lab_HbA1c_Fasting_Nov2025.pdf', 'Lab Report',
        'Biochemical profile showing elevated glycaemic markers; normal renal panel.',
        json.dumps({
            "HbA1c": "8.4 % (Reference < 5.7%)",
            "Fasting Blood Glucose": "168 mg/dL (Reference 70-99)",
            "Post-Prandial Blood Glucose": "234 mg/dL (Reference < 140)",
            "Serum Creatinine": "0.92 mg/dL (Normal)",
            "Estimated GFR": "> 90 mL/min/1.73m2",
            "Total Cholesterol": "210 mg/dL"
        }),
        now_str
    ))

    cursor.execute('''
    INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        c1_id, 'XRay_Bilateral_Knee_AP_Lateral.pdf', 'Imaging',
        'Bilateral knee radiograph showing mild medial compartment narrowing.',
        json.dumps({
            "Right Knee": "Grade II Kellgren-Lawrence changes, marginal tibial osteophytes",
            "Left Knee": "Grade I early joint space reduction, patellofemoral tracking normal",
            "Impression": "Mild bilateral knee osteoarthritis, degenerative etiology"
        }),
        now_str
    ))

    # Vitals recorded by Nurse
    cursor.execute('''
    INSERT INTO vitals_records (consultation_id, bp_sys, bp_dia, pulse, spo2, temp_f, blood_sugar, weight_kg, height_cm, bmi, recorded_by, triage_notes, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c1_id, 138, 88, 78, 98, 98.4, 174, 82.5, 172.0, 27.9,
        'Staff Nurse Sunita Rao, RN',
        'Patient alert and ambulatory. BP mildly elevated. Random fingerstick glucose 174 mg/dL. Documents verified against physical lab receipts.',
        now_str
    ))

    add_audit_log(c1_id, 'Patient', 'Draft Created', 'Patient completed digital intake via smartphone', conn=conn)
    add_audit_log(c1_id, 'Patient', 'Document Uploaded', 'Uploaded 2 previous test reports with automated extraction', conn=conn)
    add_audit_log(c1_id, 'Nurse', 'Triage Completed', 'Vitals logged, documents verified, routed to Dr. Arvind Swaminathan queue', conn=conn)

    # -------------------------------------------------------------
    # PATIENT 2: Ananya Iyer (Ayurveda - Draft Submitted)
    # -------------------------------------------------------------
    cursor.execute('''
    INSERT INTO patients (name, age, gender, phone, abha_id, blood_group, chronic_conditions, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'Ananya Iyer', 32, 'Female', '+91 98450 89211', '91-6789-1123-4556', 'O+',
        'Chronic Hyperacidity (Amlapitta), Work-related Migraines', now_str
    ))
    p2_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO consultations (token, patient_id, specialty, department, doctor_name, status, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'CS-2026-9214', p2_id, 'Ayurveda', 'Kayachikitsa (Internal Medicine)', 'Vaidya Meera Namboodiri, BAMS, MD (Ayu)',
        'draft_submitted', 'Routine', now_str, now_str
    ))
    c2_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO health_stories (consultation_id, chief_complaints, symptom_duration, history_present_illness,
                               past_medical_history, current_medications, allergies, surgical_history, family_history, lifestyle_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c2_id,
        'Burning chest sensation (Urodaha), sour eructations after meals, afternoon frontal headaches, interrupted sleep.',
        '6 months intermittent, worsened in last 3 weeks',
        'Symptoms exacerbate when meals are delayed past 2 PM or with evening spicy snacks. Recurrent antacid usage gives only transient relief.',
        'Frequent gastritis episodes since college; no major chronic systemic illnesses.',
        'Over-the-counter Pantoprazole 40mg (taken intermittently, self-prescribed)',
        'No known drug allergies. Sensitive to excessively fermented and sour foods.',
        'None',
        'Mother has history of migraine and gallstones.',
        'Software engineer working night shifts twice weekly. High caffeine intake (4 cups coffee/day). Irregular meal intervals.',
        now_str
    ))

    cursor.execute('''
    INSERT INTO ayurveda_profiles (consultation_id, prakriti_vata, prakriti_pitta, prakriti_kapha,
                                  vikriti_notes, agni_type, koshtha_type, sleep_pattern, dietary_habits, stress_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c2_id, 45, 42, 13,
        'Pitta-Vata Prakriti with Pitta Vriddhi (aggravation in stomach/Amashaya). Teekshna to Vishama Agni transition.',
        'Vishama Agni (Erratic appetite - sometimes very hungry, sometimes bloated)',
        'Madhyama (Occasional hard stools when stressed)',
        'Interrupted (5 hours/night, difficulty falling asleep before 1:30 AM)',
        'Irregular timings, preference for pungent/sour tastes, tea/coffee on empty stomach',
        'High (tight project delivery deadlines)'
    ))

    cursor.execute('''
    INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        c2_id, 'Upper_GI_Endoscopy_Apollo_June2025.pdf', 'Lab Report',
        'Esophagogastroduodenoscopy showing mild erythema in antrum; no mucosal ulceration.',
        json.dumps({
            "Procedure": "Upper GI Endoscopy",
            "Findings": "Mild antral mucosal congestion/erythema",
            "Duodenum": "Normal mucosal pattern, no ulcers",
            "H. Pylori Rapid Urease": "Negative",
            "Conclusion": "Non-erosive gastritis (compatible with functional dyspepsia / Amlapitta)"
        }),
        now_str
    ))

    add_audit_log(c2_id, 'Patient', 'Draft Created', 'Patient completed online pre-consultation health story for Ayurveda OPD', conn=conn)
    add_audit_log(c2_id, 'Patient', 'Ayurveda Intake', 'Captured Dosha balance, Agni type, and daily Ahara-Vihara habits', conn=conn)

    # -------------------------------------------------------------
    # PATIENT 3: Vikramaditya Verma (General Medicine - In Consultation)
    # -------------------------------------------------------------
    cursor.execute('''
    INSERT INTO patients (name, age, gender, phone, abha_id, blood_group, chronic_conditions, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'Vikramaditya Verma', 62, 'Male', '+91 97110 54321', '91-2311-9087-6543', 'A+',
        'Coronary Artery Disease s/p PTCA (2021), Dyslipidemia', now_str
    ))
    p3_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO consultations (token, patient_id, specialty, department, doctor_name, status, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'CS-2026-7812', p3_id, 'General Medicine', 'Cardiology & General Medicine', 'Dr. Arvind Swaminathan, MD',
        'in_consultation', 'Urgent', now_str, now_str
    ))
    c3_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO health_stories (consultation_id, chief_complaints, symptom_duration, history_present_illness,
                               past_medical_history, current_medications, allergies, surgical_history, family_history, lifestyle_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c3_id,
        'Exertional breathlessness on climbing one flight of stairs, mild bilateral pedal puffiness by evening.',
        '10 days',
        '62-year-old gentleman with known CAD status-post stent in LAD (2021). Reports decrease in exercise tolerance over past 10 days. Denies active chest pain, palpitations, or orthopnea.',
        'PTCA with drug-eluting stent to LAD (2021). Hypertension for 10 years.',
        'Tab. Ecosprin 75mg OD, Tab. Clopidogrel 75mg OD, Tab. Atorvastatin 40mg HS, Tab. Ramipril 5mg OD, Tab. Metoprolol Succinate 25mg OD',
        'No known allergies',
        'Coronary Angioplasty & Stenting (2021)',
        'Brother suffered myocardial infarction at age 55.',
        'Retired bank manager. Daily morning walk reduced from 30 mins to 10 mins due to fatigue.',
        now_str
    ))

    cursor.execute('''
    INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        c3_id, '2D_Echocardiography_Report_2024.pdf', 'Imaging',
        'Transthoracic Echo showing preserved left ventricular systolic function with mild diastolic dysfunction.',
        json.dumps({
            "LVEF": "55 % (Normal systolic function)",
            "Regional Wall Motion": "Hypokinesia of mid-anterior septum",
            "Diastolic Function": "Grade 1 impaired relaxation pattern",
            "Valves": "Mild sclerotic aortic valve, trivial mitral regurgitation",
            "PA Systolic Pressure": "28 mmHg (Normal)"
        }),
        now_str
    ))

    cursor.execute('''
    INSERT INTO vitals_records (consultation_id, bp_sys, bp_dia, pulse, spo2, temp_f, blood_sugar, weight_kg, height_cm, bmi, recorded_by, triage_notes, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c3_id, 146, 92, 82, 96, 98.2, 118, 77.0, 168.0, 27.3,
        'Staff Nurse Sunita Rao, RN',
        'Mild bilateral non-pitting pedal edema noted. SpO2 96% on room air. Elevated blood pressure. Triaged as Urgent given cardiac history.',
        now_str
    ))

    add_audit_log(c3_id, 'Support Staff', 'Assisted Registration', 'Helped patient register via tablet at Help Desk', conn=conn)
    add_audit_log(c3_id, 'Nurse', 'Triage Completed', 'Marked Priority as Urgent, recorded pedal edema note', conn=conn)
    add_audit_log(c3_id, 'Doctor', 'Consultation Commenced', 'Dr. Swaminathan opened draft story for review', conn=conn)

    # -------------------------------------------------------------
    # PATIENT 4: Kavita Joshi (Ayurveda - Approved & Finalized Demonstration)
    # -------------------------------------------------------------
    cursor.execute('''
    INSERT INTO patients (name, age, gender, phone, abha_id, blood_group, chronic_conditions, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'Kavita Joshi', 41, 'Female', '+91 99220 76543', '91-7744-3321-9988', 'AB+',
        'Cervical Spondylosis (Manyastambha), Hypothyroidism (4 yrs)', now_str
    ))
    p4_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO consultations (token, patient_id, specialty, department, doctor_name, status, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'CS-2026-6503', p4_id, 'Ayurveda', 'Shalya & Panchakarma', 'Vaidya Meera Namboodiri, BAMS, MD (Ayu)',
        'approved', 'Follow-up', now_str, now_str
    ))
    c4_id = cursor.lastrowid

    cursor.execute('''
    INSERT INTO health_stories (consultation_id, chief_complaints, symptom_duration, history_present_illness,
                               past_medical_history, current_medications, allergies, surgical_history, family_history, lifestyle_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c4_id,
        'Stiffness at nape of neck radiating to right shoulder and forearm, tingling in right index finger, morning joint sluggishness.',
        '5 months chronic with acute flare-up 2 weeks ago',
        'Patient reports persistent neck rigidity worsening with prolonged sitting at computer. Morning stiffness lasts 45 minutes.',
        'Primary Hypothyroidism diagnosed in 2022 on Thyroxine; recurrent muscle cramps.',
        'Tab. Thyronorm 50mcg OD (morning empty stomach)',
        'No known drug allergies',
        'None',
        'Mother had cervical disc problems and knee arthritis.',
        'School teacher, spends extensive hours checking answer sheets with neck flexed. Cold climate aggravates stiffness.',
        now_str
    ))

    cursor.execute('''
    INSERT INTO ayurveda_profiles (consultation_id, prakriti_vata, prakriti_pitta, prakriti_kapha,
                                  vikriti_notes, agni_type, koshtha_type, sleep_pattern, dietary_habits, stress_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c4_id, 40, 20, 40,
        'Kapha-Vata Prakriti with Vata Prakopa in Greeva Pradesha (cervical spine) coupled with Kapha Avarana causing stiffness (Stambha).',
        'Manda Agni (Sluggish digestion, feeling heavy after light meals)',
        'Krura (Tendency towards hard dry bowel motions)',
        'Disturbed due to neck discomfort when turning positions in sleep',
        'Prefers warm cooked foods; avoids curd at night; moderate water intake',
        'Moderate'
    ))

    cursor.execute('''
    INSERT INTO documents (consultation_id, file_name, file_type, extracted_summary, extracted_values, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        c4_id, 'Cervical_Spine_MRI_SpineClinic_2025.pdf', 'Imaging',
        'MRI Cervical Spine showing C5-C6 and C6-C7 disc osteophyte complex with mild right neural foraminal narrowing.',
        json.dumps({
            "C5-C6": "Posterior disc bulge with osteophytes causing mild anterior thecal sac indentation",
            "C6-C7": "Right paracentral disc protrusion compromising exiting C7 nerve root",
            "Cervical Lordosis": "Straightening of normal cervical lordotic curvature due to muscular spasm",
            "Spinal Canal Diameter": "Adequate (12.4 mm, no compressive myelopathy)"
        }),
        now_str
    ))

    cursor.execute('''
    INSERT INTO vitals_records (consultation_id, bp_sys, bp_dia, pulse, spo2, temp_f, blood_sugar, weight_kg, height_cm, bmi, recorded_by, triage_notes, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c4_id, 122, 80, 74, 99, 98.6, 96, 64.0, 160.0, 25.0,
        'Staff Nurse Sunita Rao, RN',
        'Vitals completely stable. Cervical tenderness noted on right paravertebral muscles. Documents verified.',
        now_str
    ))

    # Doctor approved notes
    doctor_corrections = {
        "verified_fields": ["chief_complaints", "ayurveda_dosha", "mri_correlation"],
        "modifications": [
            {"field": "Duration", "original": "2 weeks flare", "corrected": "5 months chronic with acute 2-week radicular flare"},
            {"field": "Examination", "original": "Self-reported neck pain", "corrected": "Spurling test positive on right side at C6 dermatome; trapezius trigger points marked"}
        ]
    }

    ayur_meds = [
        {"name": "Yogaraja Guggulu", "dose": "2 Tablets (500mg each)", "frequency": "Twice daily after meals", "anupana": "Warm water / Dashamula Kwatha", "duration": "30 days"},
        {"name": "Balarishta", "dose": "20 ml with equal quantity warm water", "frequency": "Twice daily after meals", "anupana": "Warm water", "duration": "30 days"},
        {"name": "Ksheerabala 101 Taila", "dose": "10 drops orally + local gentle massage", "frequency": "Morning empty stomach / Night", "anupana": "Warm milk", "duration": "21 days"},
        {"name": "Mahanarayana Taila", "dose": "External application over cervical spine", "frequency": "Once daily followed by hot towel fomentation (Nadi Sweda)", "anupana": "-", "duration": "Daily"}
    ]

    pathya_apathya = {
        "pathya": [
            "Warm freshly cooked soups and light nourishing gruels (Yusha)",
            "Spices: Ginger (Shunti), Garlic (Lashuna), and Black Pepper (Maricha) to kindle Agni",
            "Gentle neck mobilization and isometric exercises within pain-free arc",
            "Hot water bath and warm fomentation over neck region"
        ],
        "apathya": [
            "Strictly avoid sleeping on high, stiff or multi-layered pillows",
            "Avoid day-time sleeping (Diva swapna) which aggravates Kapha and stiffness",
            "Avoid dry, cold foods, refrigerated water, and bitter-astringent raw salads",
            "Avoid carrying heavy loads on head or shoulder bags with strap on right shoulder"
        ]
    }

    cursor.execute('''
    INSERT INTO clinical_notes (consultation_id, doctor_name, diagnosis, ayurvedic_nidana,
                               doctor_corrections, prescriptions, ayurvedic_medicines, pathya_apathya,
                               investigations_ordered, follow_up_advice, is_approved, approved_at, digital_signature)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        c4_id,
        'Vaidya Meera Namboodiri, BAMS, MD (Ayu)',
        'Manyastambha (Cervical Spondylosis with Vata-Kapha vitiation and right C7 radiculopathy)',
        'Abhighata / Asatmya Chesta (Prolonged abnormal posture) leading to Greeva-Ashrita Vata & Kapha Stambha.',
        json.dumps(doctor_corrections),
        json.dumps([]),
        json.dumps(ayur_meds),
        json.dumps(pathya_apathya),
        'Follow-up cervical spine clinical reassessment in 30 days. Recommend 7-day course of Greeva Basti at Panchakarma unit if stiffness persists.',
        'Continue prescribed herbal medicines regularly. Ergonomic computer desk monitor height adjustment instructed.',
        1,
        now_str,
        'Digitally Verified & Approved by Vaidya Meera Namboodiri (Reg: AYU-MH-44912)'
    ))

    add_audit_log(c4_id, 'Patient', 'Draft Created', 'Patient completed pre-consultation intake', conn=conn)
    add_audit_log(c4_id, 'Nurse', 'Triage Completed', 'Vitals logged and verified', conn=conn)
    add_audit_log(c4_id, 'Doctor', 'Draft Reviewed & Corrected', 'Vaidya Meera corrected history timeline and verified MRI findings', conn=conn)
    add_audit_log(c4_id, 'Doctor', 'Consultation Approved', 'Clinical summary approved, herbal regimen and Pathya-Apathya issued', conn=conn)

    conn.commit()
    conn.close()
    print("CareSetu database successfully seeded with 4 diverse clinical cases!")

if __name__ == '__main__':
    seed()
