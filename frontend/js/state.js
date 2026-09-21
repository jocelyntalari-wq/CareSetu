/**
 * CareSetu State Management
 * Holds patient passport, intake tracks (GenMed & Ayurveda), documents,
 * and Doctor-Ready summary data with localStorage sync.
 */

const State = {
  // Active Patient Profile (Default: Ramesh Chandra Sharma)
  patient: {
    id: 'CS-9842-DL',
    name: 'Ramesh Chandra Sharma',
    age: 58,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: 'Suresh (Son): +91 98765 43210',
    allergies: 'Penicillin (Severe rash & facial swelling)',
    track: 'General Medicine', // 'General Medicine' or 'Ayurveda'
    chronicConditions: ['Type 2 Diabetes (6 yrs)', 'Mild Hypertension (3 yrs)'],
    regularMeds: [
      { name: 'Metformin 500mg', dosage: '1 tablet twice daily after meals', note: 'For blood sugar' },
      { name: 'Telmisartan 40mg', dosage: '1 tablet morning after breakfast', note: 'For blood pressure' }
    ]
  },

  // Symptoms & Health Story Intake
  symptoms: {
    chiefComplaints: ['Fever & Chills', 'Joint Pain / Stiffness', 'Tiredness & Weakness'],
    severity: 'Moderate', // 'Mild', 'Moderate', 'Severe'
    durationValue: '4',
    durationUnit: 'Days',
    freeNotes: 'Fever has been coming in the evenings for 4 days with joint stiffness, particularly in both knees and lower back. Appetite feels reduced.',
    updatedAt: 'Today, 2:30 PM'
  },

  // Ayurveda & Lifestyle Intake
  ayurveda: {
    agni: 'Vishamagni (Irregular digestion, gas & bloating)',
    koshtha: 'Hard / Constipated (Straining)',
    sleep: 'Disturbed / Light (Waking up 2-3 times at night)',
    waterIntake: '1.5 to 2 Litres / day',
    dominantDoshaTraits: ['Vata: Dry skin, joint stiffness, restless sleep', 'Kapha: Morning lethargy & heaviness'],
    updatedAt: 'Yesterday'
  },

  // Medical Document Locker
  documents: [
    {
      id: 'doc-1',
      title: 'Previous Prescription - Dr. Anand Varma (MD)',
      date: '14 Feb 2024',
      category: 'Prescription',
      categoryClass: 'rx',
      extractedData: 'Metformin 500mg BD • Telmisartan 40mg OD • Advised low carb diet',
      icon: '💊',
      fileName: 'dr_varma_prescription_feb2024.pdf'
    },
    {
      id: 'doc-2',
      title: 'HbA1c & Fasting Lipid Profile - Metropolis Lab',
      date: '18 Jun 2024',
      category: 'Blood Test',
      categoryClass: 'lab',
      extractedData: 'HbA1c: 7.3% (Elevated) • Fasting Glucose: 138 mg/dL • Total Chol: 195 mg/dL',
      icon: '🩸',
      fileName: 'metropolis_hba1c_june2024.pdf'
    },
    {
      id: 'doc-3',
      title: 'Digital X-Ray Bilateral Knees (Standing AP/Lat)',
      date: '10 Nov 2023',
      category: 'Scan / Imaging',
      categoryClass: 'scan',
      extractedData: 'Mild joint space narrowing medial compartment • No fracture',
      icon: '🩻',
      fileName: 'bilateral_knee_xray_nov2023.png'
    }
  ],

  // Questions patient wants to ask the doctor
  doctorQuestions: [
    'Should I repeat my HbA1c blood test before starting any new treatment?',
    'Is my knee stiffness and evening tiredness related to my sugar levels?',
    'Can you check if my blood pressure medicine dose is still suitable?'
  ],

  // Demo Profiles for quick showcase
  demoProfiles: {
    ramesh: {
      patient: {
        id: 'CS-9842-DL',
        name: 'Ramesh Chandra Sharma',
        age: 58,
        gender: 'Male',
        bloodGroup: 'B+',
        emergencyContact: 'Suresh (Son): +91 98765 43210',
        allergies: 'Penicillin (Severe rash & facial swelling)',
        track: 'General Medicine',
        chronicConditions: ['Type 2 Diabetes (6 yrs)', 'Mild Hypertension (3 yrs)'],
        regularMeds: [
          { name: 'Metformin 500mg', dosage: '1 tablet twice daily after meals', note: 'For blood sugar' },
          { name: 'Telmisartan 40mg', dosage: '1 tablet morning after breakfast', note: 'For blood pressure' }
        ]
      },
      symptoms: {
        chiefComplaints: ['Fever & Chills', 'Joint Pain / Stiffness', 'Tiredness & Weakness'],
        severity: 'Moderate',
        durationValue: '4',
        durationUnit: 'Days',
        freeNotes: 'Fever has been coming in the evenings for 4 days with joint stiffness, particularly in both knees and lower back.',
        updatedAt: 'Today, 2:30 PM'
      }
    },
    sunita: {
      patient: {
        id: 'CS-5521-AY',
        name: 'Sunita Devi',
        age: 62,
        gender: 'Female',
        bloodGroup: 'O+',
        emergencyContact: 'Pooja (Daughter): +91 99123 45678',
        allergies: 'Sulfa antibiotics (Urticaria)',
        track: 'Ayurveda',
        chronicConditions: ['Osteoarthritis (Early stage)', 'Chronic Acidity / GERD'],
        regularMeds: [
          { name: 'Calcium + Vit D3', dosage: '1 tablet daily after lunch', note: 'Bone supplement' }
        ]
      },
      symptoms: {
        chiefComplaints: ['Stomach Ache / Gas', 'Joint Pain / Stiffness', 'Tiredness & Weakness'],
        severity: 'Moderate',
        durationValue: '3',
        durationUnit: 'Weeks',
        freeNotes: 'Severe bloating after dinner with sour belching. Both knees stiff when getting up from sitting position.',
        updatedAt: 'Today, 11:15 AM'
      },
      ayurveda: {
        agni: 'Tikshnagni (Acidity, burning sensation & sharp hunger)',
        koshtha: 'Hard / Constipated (Straining)',
        sleep: 'Disturbed / Light (Waking up 2-3 times at night)',
        waterIntake: '1 to 1.5 Litres / day',
        dominantDoshaTraits: ['Pitta: Acidity, body heat, sour belching', 'Vata: Joint cracking and morning stiffness'],
        updatedAt: 'Today'
      }
    }
  },

  // Listeners for UI reactivity
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  },

  loadDemo(profileKey) {
    if (this.demoProfiles[profileKey]) {
      const demo = this.demoProfiles[profileKey];
      this.patient = JSON.parse(JSON.stringify(demo.patient));
      this.symptoms = JSON.parse(JSON.stringify(demo.symptoms));
      if (demo.ayurveda) {
        this.ayurveda = JSON.parse(JSON.stringify(demo.ayurveda));
      }
      this.saveLocal();
      this.emit('stateLoaded', this);
    }
  },

  saveLocal() {
    try {
      localStorage.setItem('caresetu_state', JSON.stringify({
        patient: this.patient,
        symptoms: this.symptoms,
        ayurveda: this.ayurveda,
        documents: this.documents,
        doctorQuestions: this.doctorQuestions
      }));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  loadLocal() {
    try {
      const stored = localStorage.getItem('caresetu_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.patient) this.patient = parsed.patient;
        if (parsed.symptoms) this.symptoms = parsed.symptoms;
        if (parsed.ayurveda) this.ayurveda = parsed.ayurveda;
        if (parsed.documents) this.documents = parsed.documents;
        if (parsed.doctorQuestions) this.doctorQuestions = parsed.doctorQuestions;
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }
};
