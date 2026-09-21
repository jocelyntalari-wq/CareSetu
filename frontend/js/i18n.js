/**
 * CareSetu Internationalization (i18n) Module
 * Provides instant English <-> Hindi bilingual localization
 * Specially phrased with simple, dignified terms for elderly and low-literacy users.
 */

const I18n = {
  currentLang: 'en',

  translations: {
    en: {
      brandTagline: '“My Health Story ➔ My Doctor”',
      badgeSubtitle: 'Digital Health Passport',
      emergencySos: '🚨 Emergency SOS',
      tapToListen: '🔊 Tap to Listen',
      bridgeTitle: 'CareSetu Bridge',
      bridgeStory: 'My Health Story',
      bridgeDoctor: 'My Doctor',
      bridgeStatusReady: 'Bridge Status: Ready to show Doctor',
      bridgeStatusBuilding: 'Bridge Status: Gathering your story...',
      passportTitle: 'DIGITAL HEALTH PASSPORT',
      bloodGroup: 'Blood Group',
      emergencyContact: 'Emergency Contact',
      allergiesWarning: '⚠️ Known Allergies & Drug Alerts',
      noAllergies: 'No known drug allergies reported',
      quickActions: 'Quick Health Actions',
      genMedAction: 'General Medicine Check-in',
      genMedDesc: 'Fever, cough, body pain, sugar, BP & daily pills',
      ayurAction: 'Ayurveda & Lifestyle Profile',
      ayurDesc: 'Digestion (Agni), sleep, bowel habits & dosha balance',
      docsAction: 'Medical Document Locker',
      docsDesc: 'Old prescriptions, blood tests & scan reports',
      summaryAction: 'Draft Doctor Summary',
      summaryDesc: 'Generate 1-page health bridge card for your doctor',
      
      // Nav labels
      navPassport: 'Passport',
      navStory: 'Health Story',
      navDocs: 'Documents',
      navSummary: 'Doctor Summary',

      // Symptoms flow
      symptomsHeader: 'Record My Health Story',
      symptomsSub: 'Answer in simple steps or speak in your voice',
      chiefComplaints: 'What are you feeling today?',
      tapSymptoms: 'Tap common symptoms to add:',
      fever: 'Fever & Chills',
      cough: 'Cough & Cold',
      headache: 'Headache / Body Pain',
      stomach: 'Stomach Ache / Gas',
      fatigue: 'Tiredness & Weakness',
      chest: 'Chest / Breathing issue',
      sugarBp: 'Sugar / BP Check',
      jointPain: 'Joint Pain / Stiffness',
      skinRash: 'Skin Allergy / Rash',
      speakStory: 'Or tap to speak your symptoms:',
      micPrompt: 'Tap microphone and speak in Hindi or English',
      micListening: 'Listening... Please speak clearly',
      severityLabel: 'How uncomfortable does it feel?',
      severityMild: 'Mild (Normal work ok)',
      severityMod: 'Moderate (Bothersome)',
      severitySevere: 'Severe (Hard to manage)',
      durationLabel: 'Since how long?',
      days: 'Days',
      weeks: 'Weeks',
      months: 'Months',
      regularMedsLabel: 'Medicines You Take Regularly (Recording only)',
      noMedsRecorded: 'No medicines added yet',
      addMedBtn: '+ Record a medicine',
      saveStoryBtn: 'Save My Health Story ➔',

      // Ayurveda flow
      ayurHeader: 'Ayurveda & Lifestyle Intake',
      ayurSub: 'Holistic observation of digestion, sleep & daily routine',
      agniLabel: 'Digestion & Appetite (Agni)',
      agniBalanced: 'Samagni (Good digestion, timely hunger)',
      agniLow: 'Mandagni (Heavy, sluggish, slow appetite)',
      agniSharp: 'Tikshnagni (Acidity, burning, sharp hunger)',
      agniIrregular: 'Vishamagni (Gas, bloating, irregular hunger)',
      bowelLabel: 'Bowel Habits (Koshtha)',
      bowelNormal: 'Regular (Easy daily evacuation)',
      bowelConstipated: 'Hard / Constipated (Straining)',
      bowelLoose: 'Loose / Frequent',
      sleepLabel: 'Sleep Quality',
      sleepDeep: 'Deep & Refreshing (7-8 hours)',
      sleepDisturbed: 'Disturbed / Light (Waking up often)',
      sleepInsomnia: 'Difficulty falling asleep',
      doshaLabel: 'Body Tendencies (Prakriti Indicators)',
      vataTrait: 'Vata: Prone to dry skin, body stiffness, restless mind',
      pittaTrait: 'Pitta: Prone to body heat, sweating, acidity, irritability',
      kaphaTrait: 'Kapha: Prone to mucus, lethargy, water retention, heaviness',
      saveAyurBtn: 'Save Ayurveda Profile ➔',

      // Document locker
      docsHeader: 'Medical Document Locker',
      docsSub: 'Keep all previous hospital papers and reports safe',
      uploadPrompt: 'Tap to take photo of prescription or report',
      uploadSub: 'Supports photos, camera scans or PDFs',
      recentDocs: 'Attached Health Records',

      // Summary
      summaryDoctorHeader: 'Draft Health Story for Doctor',
      summaryNotice: '⚠️ IMPORTANT FOR PATIENT & DOCTOR: This is an AI-organized draft of patient-reported history. CareSetu does NOT provide medical diagnosis, prescriptions, or treatment advice.',
      btnShowDoctor: '📱 Show to Doctor Mode',
      btnDownloadPdf: '📥 Download / Print PDF',
      btnReadSummary: '🔊 Read Aloud to Me',
      btnEditStory: '✏️ Edit Health Story',

      // Emergency Modal
      emergencyTitle: 'Emergency Medical Helplines',
      emergencyText: 'If you are experiencing severe chest pain, sudden paralysis, choking, or heavy bleeding, seek emergency medical care immediately.',
      ambulanceCall: '📞 Call Ambulance: 108',
      nationalEmergency: '📞 National Emergency: 112',
      closeBtn: 'Close'
    },

    hi: {
      brandTagline: '“मेरी स्वास्थ्य कहानी ➔ मेरे डॉक्टर के लिए”',
      badgeSubtitle: 'डिजिटल हेल्थ पासपोर्ट',
      emergencySos: '🚨 आपातकालीन SOS',
      tapToListen: '🔊 सुनने के लिए दबाएं',
      bridgeTitle: 'केयरसेतु ब्रिज',
      bridgeStory: 'मेरी स्वास्थ्य कहानी',
      bridgeDoctor: 'मेरे डॉक्टर',
      bridgeStatusReady: 'ब्रिज स्थिति: डॉक्टर को दिखाने के लिए तैयार',
      bridgeStatusBuilding: 'ब्रिज स्थिति: आपकी जानकारी जोड़ी जा रही है...',
      passportTitle: 'डिजिटल हेल्थ पासपोर्ट',
      bloodGroup: 'रक्त समूह (Blood Group)',
      emergencyContact: 'आपातकालीन संपर्क',
      allergiesWarning: '⚠️ एलर्जी व दवा चेतावनी',
      noAllergies: 'कोई ज्ञात दवा एलर्जी दर्ज नहीं है',
      quickActions: 'त्वरित स्वास्थ्य विकल्प',
      genMedAction: 'सामान्य चिकित्सा (General Medicine)',
      genMedDesc: 'बुखार, खांसी, दर्द, शुगर, बीपी व नियमित दवाएं',
      ayurAction: 'आयुर्वेद व जीवनशैली प्रोफाइल',
      ayurDesc: 'पाचन (अग्नि), नींद, पेट साफ होना व दोष संतुलन',
      docsAction: 'मेडिकल दस्तावेज़ लॉकर',
      docsDesc: 'पुराने पर्चे (Prescriptions), खून की जांच व स्कैन',
      summaryAction: 'डॉक्टर के लिए सारांश तैयार करें',
      summaryDesc: 'डॉक्टर को दिखाने हेतु 1-पेज का हेल्थ सारांश बनाएं',

      // Nav labels
      navPassport: 'पासपोर्ट',
      navStory: 'स्वास्थ्य कहानी',
      navDocs: 'दस्तावेज़',
      navSummary: 'डॉक्टर सारांश',

      // Symptoms flow
      symptomsHeader: 'स्वास्थ्य संबंधी जानकारी दर्ज करें',
      symptomsSub: 'सरल भाषा में चुनें या बोलकर अपनी समस्या बताएं',
      chiefComplaints: 'आज आपको क्या परेशानी महसूस हो रही है?',
      tapSymptoms: 'लक्षण चुनने के लिए दबाएं:',
      fever: 'बुखार व ठंड',
      cough: 'खांसी व जुकाम',
      headache: 'सिरदर्द / बदन दर्द',
      stomach: 'पेट दर्द / गैस',
      fatigue: 'थकान व कमजोरी',
      chest: 'सीने में भारीपन / सांस फूलना',
      sugarBp: 'शुगर / बीपी की जांच',
      jointPain: 'जोड़ों का दर्द / अकड़न',
      skinRash: 'त्वचा पर खुजली / दाने',
      speakStory: 'या अपनी बात बोलकर बताएं:',
      micPrompt: 'माइक दबाएं और हिंदी या अंग्रेजी में बोलें',
      micListening: 'सुन रहे हैं... कृपया स्पष्ट बोलें',
      severityLabel: 'तकलीफ कितनी ज्यादा है?',
      severityMild: 'हल्की (कामकाज में दिक्कत नहीं)',
      severityMod: 'मध्यम (परेशानी हो रही है)',
      severitySevere: 'गंभीर (सहन करना मुश्किल)',
      durationLabel: 'कितने समय से तकलीफ है?',
      days: 'दिन',
      weeks: 'हफ्ते',
      months: 'महीने',
      regularMedsLabel: 'नियमित रूप से ली जाने वाली दवाएं (केवल रिकॉर्ड हेतु)',
      noMedsRecorded: 'अभी कोई दवा नहीं जोड़ी गई',
      addMedBtn: '+ दवा का नाम दर्ज करें',
      saveStoryBtn: 'स्वास्थ्य कहानी सुरक्षित करें ➔',

      // Ayurveda flow
      ayurHeader: 'आयुर्वेद व जीवनशैली परामर्श',
      ayurSub: 'पाचन, नींद और दिनचर्या का समग्र अवलोकन',
      agniLabel: 'पाचन शक्ति व भूख (अग्नि)',
      agniBalanced: 'समाग्नि (अच्छा पाचन, सही समय पर भूख)',
      agniLow: 'मंदाग्नि (भारीपन, भूख कम लगना, सुस्ती)',
      agniSharp: 'तीक्ष्णाग्नि (एसिडिटी, सीने में जलन, तेज भूख)',
      agniIrregular: 'विषमाग्नि (गैस, पेट फूलना, अनियमित भूख)',
      bowelLabel: 'पेट साफ होने की स्थिति (कोष्ठ)',
      bowelNormal: 'सामान्य (रोज आसानी से पेट साफ)',
      bowelConstipated: 'कब्ज / सख्त (जोर लगाना पड़ता है)',
      bowelLoose: 'पतला दस्त / बार-बार',
      sleepLabel: 'नींद की स्थिति',
      sleepDeep: 'गहरी और ताजगी भरी (7-8 घंटे)',
      sleepDisturbed: 'खराब / बार-बार टूटने वाली नींद',
      sleepInsomnia: 'नींद आने में बहुत कठिनाई',
      doshaLabel: 'शारीरिक प्रवृत्तियां (प्रकृति संकेत)',
      vataTrait: 'वात: रूखी त्वचा, जोड़ों में जकड़न, चंचल मन',
      pittaTrait: 'पित्त: शरीर में गर्मी, ज्यादा पसीना, खट्टी डकारें',
      kaphaTrait: 'कफ: भारीपन, कफ-बलगम, सुस्ती, वजन बढ़ना',
      saveAyurBtn: 'आयुर्वेद प्रोफाइल सुरक्षित करें ➔',

      // Document locker
      docsHeader: 'मेडिकल दस्तावेज़ लॉकर',
      docsSub: 'पुराने अस्पताल के पर्चे और जांच रिपोर्ट सुरक्षित रखें',
      uploadPrompt: 'पर्चे या रिपोर्ट की फोटो खींचने के लिए दबाएं',
      uploadSub: 'फोटो, कैमरा या पीडीएफ फाइल समर्थित है',
      recentDocs: 'संलग्न मेडिकल रिकॉर्ड',

      // Summary
      summaryDoctorHeader: 'डॉक्टर के लिए स्वास्थ्य सारांश',
      summaryNotice: '⚠️ रोगी व डॉक्टर के लिए महत्वपूर्ण: यह केवल रोगी द्वारा दी गई जानकारी का व्यवस्थित ड्राफ्ट है। केयरसेतु कोई चिकित्सीय निदान (Diagnosis), दवा (Prescription) या इलाज की सलाह नहीं देता।',
      btnShowDoctor: '📱 डॉक्टर को दिखाएं (Full Screen)',
      btnDownloadPdf: '📥 PDF डाउनलोड / प्रिंट करें',
      btnReadSummary: '🔊 मुझे पढ़कर सुनाएं',
      btnEditStory: '✏️ स्वास्थ्य जानकारी बदलें',

      // Emergency Modal
      emergencyTitle: 'आपातकालीन चिकित्सा हेल्पलाइन',
      emergencyText: 'यदि आपको सीने में तेज दर्द, अचानक सुन्नपन, सांस लेने में अत्यधिक कठिनाई या भारी रक्तस्राव हो रहा है, तो तुरंत आपातकालीन सहायता लें।',
      ambulanceCall: '📞 एम्बुलेंस बुलाएं: 108',
      nationalEmergency: '📞 राष्ट्रीय आपात नंबर: 112',
      closeBtn: 'बंद करें'
    }
  },

  t(key) {
    const langDict = this.translations[this.currentLang] || this.translations.en;
    return langDict[key] || this.translations.en[key] || key;
  },

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
    document.documentElement.lang = this.currentLang;
    this.applyTranslations();
    return this.currentLang;
  },

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      document.documentElement.lang = lang;
      this.applyTranslations();
    }
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const text = this.t(key);
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', text);
        } else {
          el.innerText = text;
        }
      }
    });

    // Update language toggle button label
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
      langBtn.innerHTML = this.currentLang === 'en' 
        ? '<span>🌐 हिंदी में देखें</span>' 
        : '<span>🌐 View in English</span>';
    }
  }
};
