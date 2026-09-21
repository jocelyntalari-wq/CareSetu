import 'package:flutter/material.dart';
import '../models/patient.dart';
import '../models/health_story.dart';
import '../models/ayurveda_profile.dart';
import '../models/medical_document.dart';
import '../models/doctor_summary.dart';
import '../services/service_locator.dart';
import '../services/mock/mock_storage_service.dart';

class AppState extends ChangeNotifier {
  String _language = 'en'; // 'en' or 'hi'
  double _fontScale = 1.0;
  bool _consentAgreed = false;
  bool _isGeneratingSummary = false;

  Patient _patient = Patient(
    id: 'CS-9842-DL',
    name: 'Ramesh Chandra Sharma',
    age: 58,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: 'Suresh (Son): +91 98765 43210',
    allergies: 'Penicillin (Severe rash & facial swelling)',
    selectedTrack: 'General Medicine',
    chronicConditions: ['Type 2 Diabetes (6 yrs)', 'Mild Hypertension (3 yrs)'],
  );

  HealthStory _healthStory = HealthStory(
    chiefComplaints: ['Fever & Chills', 'Joint Pain / Stiffness', 'Tiredness & Weakness'],
    severity: 'Moderate',
    durationValue: '4',
    durationUnit: 'Days',
    freeNotes: 'Fever in evenings for 4 days with joint stiffness in knees and lower back.',
    recordedMedicines: [
      RecordedMedicine(name: 'Metformin 500mg', dosage: '1 tab BD after food', note: 'Blood sugar'),
      RecordedMedicine(name: 'Telmisartan 40mg', dosage: '1 tab morning after breakfast', note: 'Blood pressure'),
    ],
  );

  AyurvedaProfile _ayurvedaProfile = AyurvedaProfile();

  List<MedicalDocument> _documents = [];
  DoctorSummary? _doctorSummary;

  List<String> _doctorQuestions = [
    'Should I repeat my HbA1c blood test before starting any new treatment?',
    'Is my knee stiffness and evening tiredness related to my sugar levels?',
    'Can you check if my blood pressure medicine dose is still suitable?',
  ];

  AppState() {
    _initData();
  }

  Future<void> _initData() async {
    _documents = await services.storageService.getDocuments(_patient.id);
    notifyListeners();
  }

  // Getters
  String get language => _language;
  double get fontScale => _fontScale;
  bool get consentAgreed => _consentAgreed;
  bool get isGeneratingSummary => _isGeneratingSummary;
  Patient get patient => _patient;
  HealthStory get healthStory => _healthStory;
  AyurvedaProfile get ayurvedaProfile => _ayurvedaProfile;
  List<MedicalDocument> get documents => _documents;
  DoctorSummary? get doctorSummary => _doctorSummary;
  List<String> get doctorQuestions => _doctorQuestions;

  // Language & Accessibility
  void setLanguage(String lang) {
    _language = lang;
    notifyListeners();
  }

  void toggleLanguage() {
    _language = _language == 'en' ? 'hi' : 'en';
    notifyListeners();
  }

  void setFontScale(double scale) {
    _fontScale = scale;
    notifyListeners();
  }

  void setConsent(bool agreed) {
    _consentAgreed = agreed;
    notifyListeners();
  }

  // Patient & Track
  void updatePatient(Patient updated) {
    _patient = updated;
    notifyListeners();
  }

  void setTrack(String track) {
    _patient = _patient.copyWith(selectedTrack: track);
    notifyListeners();
  }

  // Symptoms & Intake
  void toggleSymptom(String symptom) {
    final list = List<String>.from(_healthStory.chiefComplaints);
    if (list.contains(symptom)) {
      list.remove(symptom);
    } else {
      list.add(symptom);
    }
    _healthStory = _healthStory.copyWith(chiefComplaints: list);
    notifyListeners();
  }

  void setSeverity(String severity) {
    _healthStory = _healthStory.copyWith(severity: severity);
    notifyListeners();
  }

  void setDuration(String value, String unit) {
    _healthStory = _healthStory.copyWith(durationValue: value, durationUnit: unit);
    notifyListeners();
  }

  void setFreeNotes(String notes) {
    _healthStory = _healthStory.copyWith(freeNotes: notes);
    notifyListeners();
  }

  void addMedicine(String name, String dosage) {
    final list = List<RecordedMedicine>.from(_healthStory.recordedMedicines);
    list.add(RecordedMedicine(name: name, dosage: dosage));
    _healthStory = _healthStory.copyWith(recordedMedicines: list);
    notifyListeners();
  }

  void removeMedicine(int index) {
    if (index >= 0 && index < _healthStory.recordedMedicines.length) {
      final list = List<RecordedMedicine>.from(_healthStory.recordedMedicines);
      list.removeAt(index);
      _healthStory = _healthStory.copyWith(recordedMedicines: list);
      notifyListeners();
    }
  }

  // Ayurveda Profile updates
  void updateAyurvedaProfile(AyurvedaProfile updated) {
    _ayurvedaProfile = updated;
    notifyListeners();
  }

  // Documents
  Future<void> attachDocument(MedicalDocument doc) async {
    _documents.insert(0, doc);
    if (services.storageService is MockStorageService) {
      (services.storageService as MockStorageService).addDocument(doc);
    }
    notifyListeners();
  }

  // Generate Doctor Summary via Gemini Service
  Future<void> generateSummary() async {
    _isGeneratingSummary = true;
    notifyListeners();

    try {
      _doctorSummary = await services.geminiService.generateDraftSummary(
        patient: _patient,
        healthStory: _healthStory,
        ayurvedaProfile: _patient.selectedTrack == 'Ayurveda' ? _ayurvedaProfile : null,
        documents: _documents,
        questionsForDoctor: _doctorQuestions,
      );
    } finally {
      _isGeneratingSummary = false;
      notifyListeners();
    }
  }

  // Demo Profiles
  void loadDemoProfile(String profileKey) {
    if (profileKey == 'sunita') {
      _patient = Patient(
        id: 'CS-5521-AY',
        name: 'Sunita Devi',
        age: 62,
        gender: 'Female',
        bloodGroup: 'O+',
        emergencyContact: 'Pooja (Daughter): +91 99123 45678',
        allergies: 'Sulfa antibiotics (Urticaria)',
        selectedTrack: 'Ayurveda',
        chronicConditions: ['Osteoarthritis (Early stage)', 'Chronic Acidity / GERD'],
      );
      _healthStory = HealthStory(
        chiefComplaints: ['Stomach Ache / Gas', 'Joint Pain / Stiffness', 'Tiredness & Weakness'],
        severity: 'Moderate',
        durationValue: '3',
        durationUnit: 'Weeks',
        freeNotes: 'Severe bloating after dinner with sour belching. Both knees stiff.',
        recordedMedicines: [
          RecordedMedicine(name: 'Calcium + Vit D3', dosage: '1 tab daily after lunch', note: 'Bone supplement')
        ],
      );
      _ayurvedaProfile = AyurvedaProfile(
        agni: 'Tikshnagni (Acidity, burning sensation & sharp hunger)',
        koshtha: 'Hard / Constipated (Straining)',
        sleep: 'Disturbed / Light (Waking up 2-3 times at night)',
        dominantDoshaTraits: ['Pitta: Acidity, body heat', 'Vata: Joint stiffness'],
      );
    } else {
      _patient = Patient(
        id: 'CS-9842-DL',
        name: 'Ramesh Chandra Sharma',
        age: 58,
        gender: 'Male',
        bloodGroup: 'B+',
        emergencyContact: 'Suresh (Son): +91 98765 43210',
        allergies: 'Penicillin (Severe rash & facial swelling)',
        selectedTrack: 'General Medicine',
        chronicConditions: ['Type 2 Diabetes (6 yrs)', 'Mild Hypertension (3 yrs)'],
      );
      _healthStory = HealthStory(
        chiefComplaints: ['Fever & Chills', 'Joint Pain / Stiffness', 'Tiredness & Weakness'],
        severity: 'Moderate',
        durationValue: '4',
        durationUnit: 'Days',
        freeNotes: 'Fever in evenings for 4 days with joint stiffness.',
        recordedMedicines: [
          RecordedMedicine(name: 'Metformin 500mg', dosage: '1 tab BD after food', note: 'Blood sugar'),
          RecordedMedicine(name: 'Telmisartan 40mg', dosage: '1 tab morning after breakfast', note: 'Blood pressure'),
        ],
      );
    }
    _doctorSummary = null;
    notifyListeners();
  }

  // Bilingual Dictionary Helper
  String t(String key) {
    final Map<String, Map<String, String>> dict = {
      'en': {
        'brand': 'CareSetu',
        'tagline': '“My Health Story ➔ My Doctor”',
        'passport': 'Digital Health Passport',
        'welcomeTitle': 'Welcome to CareSetu',
        'welcomeSub': 'A secure, dignified bridge connecting your personal health story directly to your doctor.',
        'startBtn': 'Get Started ➔',
        'selectLanguage': 'Select Your Language',
        'selectLanguageSub': 'अपनी भाषा चुनें',
        'consentTitle': 'Consent & Medical Safety Notice',
        'consentSub': 'CareSetu is a patient health history organization tool.',
        'consentCheckbox': 'I understand that CareSetu does NOT provide medical diagnosis, prescriptions, or treatment advice.',
        'agreeBtn': 'I Agree & Continue ➔',
        'home': 'Home',
        'profile': 'Profile',
        'healthStory': 'Health Story',
        'documents': 'Documents',
        'summary': 'Doctor Summary',
        'showDoctor': 'Show to Doctor',
        'emergencySos': '🚨 Emergency SOS',
        'tapToListen': '🔊 Listen Aloud',
      },
      'hi': {
        'brand': 'केयरसेतु',
        'tagline': '“मेरी स्वास्थ्य कहानी ➔ मेरे डॉक्टर के लिए”',
        'passport': 'डिजिटल हेल्थ पासपोर्ट',
        'welcomeTitle': 'केयरसेतु में आपका स्वागत है',
        'welcomeSub': 'आपकी स्वास्थ्य जानकारी और पुराने पर्चों को आपके डॉक्टर तक सुरक्षित पहुंचाने का सेतु।',
        'startBtn': 'शुरू करें ➔',
        'selectLanguage': 'अपनी पसंदीदा भाषा चुनें',
        'selectLanguageSub': 'Select Your Preferred Language',
        'consentTitle': 'सहमति व चिकित्सीय सुरक्षा सूचना',
        'consentSub': 'केयरसेतु केवल आपकी स्वास्थ्य जानकारी को व्यवस्थित रखने का साधन है।',
        'consentCheckbox': 'मैं समझता/समझती हूँ कि केयरसेतु कोई चिकित्सीय निदान, दवा या इलाज की सलाह नहीं देता।',
        'agreeBtn': 'सहमत हैं और आगे बढ़ें ➔',
        'home': 'होम',
        'profile': 'प्रोफाइल',
        'healthStory': 'स्वास्थ्य कहानी',
        'documents': 'दस्तावेज़',
        'summary': 'डॉक्टर सारांश',
        'showDoctor': 'डॉक्टर को दिखाएं',
        'emergencySos': '🚨 आपातकालीन SOS',
        'tapToListen': '🔊 सुनकर समझें',
      },
    };

    return dict[_language]?[key] ?? dict['en']?[key] ?? key;
  }
}
