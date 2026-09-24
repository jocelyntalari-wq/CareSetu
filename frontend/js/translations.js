const translations = {
  en: {
    // Navigation & UI
    brandSub: "Health Bridge",
    navMain: "MAIN MENU",
    navHome: "Dashboard",
    navStory: "Health Story",
    navAyurveda: "Ayurveda",
    navRecords: "RECORDS",
    navUpload: "Upload Report",
    navLocker: "Document Locker",
    navDocSummary: "Doctor Summary",
    navSOS: "Emergency SOS",
    searchPlaceholder: "Search records...",
    
    // Dashboard
    welcomeTitle: "Welcome to CareSetu",
    welcomeSub: "Your health information, organised in one place.",
    quickActions: "Quick Actions",
    cardCheckin: "Start Health Check-in",
    cardCheckinDesc: "Record your symptoms and prepare for your doctor visit.",
    cardUpload: "Upload Medical Report",
    cardUploadDesc: "Upload prescriptions or lab reports to get a simple AI explanation.",
    cardLocker: "My Health Story",
    cardLockerDesc: "View your previously saved health records and documents.",
    cardSummary: "Doctor Summary",
    cardSummaryDesc: "A quick, one-page clinical summary ready for your doctor.",
    
    // Health Story Intake
    intakeTitle: "Record Health Story",
    intakeSub: "Tell us what you are experiencing today.",
    voiceTitle: "Speak your symptoms",
    voiceSub: "Tap the microphone and speak in English, Telugu, or Hindi. We will convert it to text automatically.",
    micReady: "Ready to record",
    micRecording: "Recording... Tap again to stop",
    symptomsPlaceholder: "Example: I have a headache and body pain for two days...",
    spokenText: "Your spoken or typed symptoms:",
    btnExtract: "Extract Details",
    formTitle: "Structured Patient Details",
    formSub: "Please verify the extracted information below.",
    lblPatientName: "Patient Name",
    lblAge: "Age & Gender",
    lblBlood: "Blood Group",
    lblDuration: "Duration",
    lblMainSymptoms: "Main Symptoms",
    lblSeverity: "Severity",
    sevMild: "Mild",
    sevMod: "Moderate",
    sevSev: "Severe",
    lblConditions: "Existing Conditions & Allergies",
    btnSaveStory: "Save Health Story",
    
    // Ayurveda
    ayurTitle: "Ayurveda & Lifestyle",
    ayurSub: "Holistic observation of digestion, sleep, and routine.",
    ayurDisclaimer: "This information is collected for your Ayurvedic practitioner. We do not diagnose your dosha.",
    ayurDigestion: "Digestion & Appetite (Agni)",
    ayurSleep: "Sleep Quality",
    ayurBowels: "Bowel Habits (Koshtha)",
    btnSaveAyur: "Save Lifestyle Info",
    
    // Upload
    uploadTitle: "Upload Medical Report",
    uploadSub: "Upload your prescription or lab test for a simple explanation.",
    uploadPrompt: "Drag & Drop or Click to Upload",
    uploadTypes: "Supports PDF, JPG, PNG or Camera",
    btnCamera: "Take Photo",
    uploadedDoc: "Uploaded Document",
    explanationEmptyTitle: "Waiting for document",
    explanationEmptySub: "Upload a document to see a patient-friendly explanation here.",
    patientExplanationTitle: "Patient Report Explanation",
    btnReadAloud: "Read Aloud",
    aiDisclaimer: "AI-generated explanation — please verify with your doctor. Do not change medicines based on this.",
    
    // Locker
    lockerTitle: "Medical Document Locker",
    lockerSub: "Securely access your past reports and prescriptions.",
    btnNewUpload: "New Upload",
    thName: "Document Name",
    thDate: "Date",
    thType: "Type",
    thAction: "Actions",
    btnViewSummary: "View Summary",
    
    // Doctor Summary
    docSummaryTitle: "Doctor Summary",
    docSummarySub: "A short, clinical overview specifically for your doctor.",
    btnEdit: "Edit",
    btnShare: "Share",
    
    // SOS
    sosTitle: "Emergency Helplines",
    sosDesc: "If you are experiencing a severe medical emergency, please call the numbers below immediately. CareSetu is not an emergency service.",
    sosAmbulance: "108 — Ambulance",
    sosNational: "112 — National Emergency",
    
    // Sample AI Report Summary Content (English)
    reportSummaryDetails: `
      <h4>What this report contains</h4>
      <p>This is a standard Complete Blood Count (CBC) test report dated 20 Sept 2026.</p>
      
      <h4>Important findings</h4>
      <ul>
        <li>Your Hemoglobin is slightly low (11.2 g/dL).</li>
        <li>White blood cell count is normal.</li>
        <li>Platelets are within the normal range.</li>
      </ul>
      
      <h4>Things to discuss with your doctor</h4>
      <ul>
        <li>Ask if you need iron supplements for the low hemoglobin.</li>
        <li>Ask if any dietary changes are required.</li>
      </ul>
    `
  },
  
  te: {
    // Navigation & UI
    brandSub: "ఆరోగ్య వారధి",
    navMain: "ప్రధాన మెనూ",
    navHome: "డాష్‌బోర్డ్",
    navStory: "నా ఆరోగ్య వివరాలు",
    navAyurveda: "ఆయుర్వేదం",
    navRecords: "రికార్డులు",
    navUpload: "రిపోర్ట్ అప్‌లోడ్ చేయండి",
    navLocker: "డాక్యుమెంట్ లాకర్",
    navDocSummary: "డాక్టర్ సారాంశం",
    navSOS: "అత్యవసర సేవలు (SOS)",
    searchPlaceholder: "రికార్డులను వెతకండి...",
    
    // Dashboard
    welcomeTitle: "కేర్‌సేతుకు స్వాగతం",
    welcomeSub: "మీ ఆరోగ్య సమాచారం అంతా ఒకే చోట.",
    quickActions: "త్వరిత చర్యలు",
    cardCheckin: "ఆరోగ్య వివరాలు నమోదు",
    cardCheckinDesc: "మీ లక్షణాలను నమోదు చేసి, డాక్టర్ వద్దకు వెళ్లడానికి సిద్ధమవండి.",
    cardUpload: "మెడికల్ రిపోర్ట్ అప్‌లోడ్",
    cardUploadDesc: "ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ రిపోర్ట్ అప్‌లోడ్ చేసి సులభమైన వివరణ పొందండి.",
    cardLocker: "నా ఆరోగ్య చరిత్ర",
    cardLockerDesc: "మీరు గతంలో సేవ్ చేసిన రిపోర్టులు మరియు పత్రాలను చూడండి.",
    cardSummary: "డాక్టర్ కోసం సారాంశం",
    cardSummaryDesc: "మీ డాక్టర్ కోసం సిద్ధంగా ఉన్న ఒక చిన్న క్లినికల్ సారాంశం.",
    
    // Health Story Intake
    intakeTitle: "ఆరోగ్య వివరాలు నమోదు చేయండి",
    intakeSub: "ఈ రోజు మీరు ఎదుర్కొంటున్న ఆరోగ్య సమస్యలను చెప్పండి.",
    voiceTitle: "మీ లక్షణాలను మాట్లాడండి",
    voiceSub: "మైక్రోఫోన్‌ను నొక్కి తెలుగు, ఇంగ్లీష్ లేదా హిందీలో మాట్లాడండి. మేము దానిని అక్షరాలుగా మారుస్తాము.",
    micReady: "రికార్డ్ చేయడానికి సిద్ధంగా ఉంది",
    micRecording: "రికార్డ్ అవుతోంది... ఆపడానికి మళ్లీ నొక్కండి",
    symptomsPlaceholder: "ఉదాహరణకు: నాకు రెండు రోజుల నుంచి తలనొప్పి మరియు ఒళ్లు నొప్పులు ఉన్నాయి...",
    spokenText: "మీరు మాట్లాడిన లేదా టైప్ చేసిన లక్షణాలు:",
    btnExtract: "వివరాలను సేకరించు",
    formTitle: "రోగి పూర్తి వివరాలు",
    formSub: "దయచేసి సేకరించిన సమాచారాన్ని సరిచూసుకోండి.",
    lblPatientName: "రోగి పేరు",
    lblAge: "వయసు & లింగం",
    lblBlood: "రక్త వర్గం",
    lblDuration: "ఎన్ని రోజుల నుంచి",
    lblMainSymptoms: "ప్రధాన లక్షణాలు",
    lblSeverity: "తీవ్రత",
    sevMild: "తక్కువ",
    sevMod: "మధ్యస్థం",
    sevSev: "తీవ్రం",
    lblConditions: "ఇతర ఆరోగ్య సమస్యలు & ఎలర్జీలు",
    btnSaveStory: "ఆరోగ్య వివరాలను సేవ్ చేయండి",
    
    // Ayurveda
    ayurTitle: "ఆయుర్వేదం & జీవనశైలి",
    ayurSub: "జీర్ణక్రియ, నిద్ర మరియు దినచర్య పరిశీలన.",
    ayurDisclaimer: "ఈ సమాచారం మీ ఆయుర్వేద డాక్టర్ కోసం సేకరించబడింది. మేము మీ దోషాన్ని నిర్ధారించము.",
    ayurDigestion: "జీర్ణక్రియ & ఆకలి (అగ్ని)",
    ayurSleep: "నిద్ర నాణ్యత",
    ayurBowels: "విరేచనం (కోష్ఠం)",
    btnSaveAyur: "జీవనశైలి వివరాలను సేవ్ చేయండి",
    
    // Upload
    uploadTitle: "మెడికల్ రిపోర్ట్ అప్‌లోడ్",
    uploadSub: "సులభమైన వివరణ కోసం మీ ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ టెస్ట్ అప్‌లోడ్ చేయండి.",
    uploadPrompt: "అప్‌లోడ్ చేయడానికి ఇక్కడ క్లిక్ చేయండి",
    uploadTypes: "PDF, JPG, PNG లేదా ఫోటో తీయవచ్చు",
    btnCamera: "ఫోటో తీయండి",
    uploadedDoc: "అప్‌లోడ్ చేసిన డాక్యుమెంట్",
    explanationEmptyTitle: "డాక్యుమెంట్ కోసం వేచి ఉన్నాము",
    explanationEmptySub: "రోగులకు సులభంగా అర్థమయ్యే వివరణ కోసం డాక్యుమెంట్ అప్‌లోడ్ చేయండి.",
    patientExplanationTitle: "రోగి రిపోర్ట్ వివరణ",
    btnReadAloud: "చదివి వినిపించు",
    aiDisclaimer: "AI-రూపొందించిన వివరణ — దయచేసి మీ డాక్టర్‌తో ధృవీకరించుకోండి. దీని ఆధారంగా మందులు మార్చకండి.",
    
    // Locker
    lockerTitle: "మెడికల్ డాక్యుమెంట్ లాకర్",
    lockerSub: "మీ పాత రిపోర్టులు మరియు ప్రిస్క్రిప్షన్లను సురక్షితంగా యాక్సెస్ చేయండి.",
    btnNewUpload: "కొత్త అప్‌లోడ్",
    thName: "డాక్యుమెంట్ పేరు",
    thDate: "తేదీ",
    thType: "రకం",
    thAction: "చర్యలు",
    btnViewSummary: "సారాంశం చూడండి",
    
    // Doctor Summary
    docSummaryTitle: "డాక్టర్ సారాంశం",
    docSummarySub: "మీ డాక్టర్ కోసం ప్రత్యేకంగా ఒక చిన్న క్లినికల్ వివరణ.",
    btnEdit: "సవరించు",
    btnShare: "షేర్ చేయండి",
    
    // SOS
    sosTitle: "అత్యవసర హెల్ప్‌లైన్‌లు",
    sosDesc: "మీరు తీవ్రమైన వైద్యపరమైన అత్యవసర పరిస్థితిలో ఉంటే, వెంటనే కింద ఉన్న నంబర్లకు కాల్ చేయండి. కేర్‌సేతు అత్యవసర సేవ కాదు.",
    sosAmbulance: "108 — అంబులెన్స్",
    sosNational: "112 — జాతీయ అత్యవసర సేవ",
    
    // Sample AI Report Summary Content (Telugu)
    reportSummaryDetails: `
      <h4>ఈ రిపోర్ట్లో ఉన్న విషయాలు</h4>
      <p>ఇది 20 సెప్టెంబర్ 2026 నాటి సాధారణ రక్త పరీక్ష (CBC) రిపోర్ట్.</p>
      
      <h4>ముఖ్యమైన ఫలితాలు</h4>
      <ul>
        <li>మీ హిమోగ్లోబిన్ కొద్దిగా తక్కువగా ఉంది (11.2 g/dL).</li>
        <li>తెల్ల రక్త కణాల సంఖ్య సాధారణంగా ఉంది.</li>
        <li>ప్లేట్‌లెట్స్ సాధారణ పరిధిలోనే ఉన్నాయి.</li>
      </ul>
      
      <h4>డాక్టర్‌తో చర్చించవలసిన విషయాలు</h4>
      <ul>
        <li>తక్కువ హిమోగ్లోబిన్ కోసం ఐరన్ మాత్రలు అవసరమా అని అడగండి.</li>
        <li>ఆహారంలో ఏమైనా మార్పులు చేయాలా అని అడగండి.</li>
      </ul>
    `
  },
  
  hi: {
    // Navigation & UI
    brandSub: "स्वास्थ्य सेतु",
    navMain: "मुख्य मेनू",
    navHome: "डैशबोर्ड",
    navStory: "मेरी स्वास्थ्य कहानी",
    navAyurveda: "आयुर्वेद",
    navRecords: "रिकॉर्ड्स",
    navUpload: "रिपोर्ट अपलोड करें",
    navLocker: "दस्तावेज़ लॉकर",
    navDocSummary: "डॉक्टर का सारांश",
    navSOS: "आपातकालीन SOS",
    searchPlaceholder: "रिकॉर्ड खोजें...",
    
    // Dashboard
    welcomeTitle: "CareSetu में आपका स्वागत है",
    welcomeSub: "आपकी स्वास्थ्य जानकारी, एक जगह व्यवस्थित।",
    quickActions: "त्वरित कार्रवाई",
    cardCheckin: "स्वास्थ्य चेक-इन शुरू करें",
    cardCheckinDesc: "अपने लक्षण दर्ज करें और डॉक्टर से मिलने की तैयारी करें।",
    cardUpload: "मेडिकल रिपोर्ट अपलोड करें",
    cardUploadDesc: "सरल AI विवरण प्राप्त करने के लिए नुस्खे या लैब रिपोर्ट अपलोड करें।",
    cardLocker: "मेरी स्वास्थ्य कहानी",
    cardLockerDesc: "अपने पहले सहेजे गए स्वास्थ्य रिकॉर्ड और दस्तावेज़ देखें।",
    cardSummary: "डॉक्टर का सारांश",
    cardSummaryDesc: "आपके डॉक्टर के लिए एक त्वरित, एक-पृष्ठ नैदानिक सारांश।",
    
    // Health Story Intake
    intakeTitle: "स्वास्थ्य कहानी दर्ज करें",
    intakeSub: "हमें बताएं कि आप आज क्या महसूस कर रहे हैं।",
    voiceTitle: "अपने लक्षण बोलें",
    voiceSub: "माइक्रोफोन पर टैप करें और हिंदी, तेलुगु या अंग्रेजी में बोलें। हम इसे टेक्स्ट में बदल देंगे।",
    micReady: "रिकॉर्ड करने के लिए तैयार",
    micRecording: "रिकॉर्ड हो रहा है... रोकने के लिए फिर से टैप करें",
    symptomsPlaceholder: "उदाहरण: मुझे दो दिनों से सिरदर्द और शरीर में दर्द है...",
    spokenText: "आपके बोले गए या टाइप किए गए लक्षण:",
    btnExtract: "विवरण निकालें",
    formTitle: "संरचित रोगी विवरण",
    formSub: "कृपया नीचे दी गई निकाली गई जानकारी की पुष्टि करें।",
    lblPatientName: "रोगी का नाम",
    lblAge: "आयु और लिंग",
    lblBlood: "रक्त समूह",
    lblDuration: "अवधि",
    lblMainSymptoms: "मुख्य लक्षण",
    lblSeverity: "गंभीरता",
    sevMild: "हल्का",
    sevMod: "मध्यम",
    sevSev: "गंभीर",
    lblConditions: "मौजूदा स्थितियां और एलर्जी",
    btnSaveStory: "स्वास्थ्य कहानी सहेजें",
    
    // Ayurveda
    ayurTitle: "आयुर्वेद और जीवन शैली",
    ayurSub: "पाचन, नींद और दिनचर्या का समग्र अवलोकन।",
    ayurDisclaimer: "यह जानकारी आपके आयुर्वेदिक चिकित्सक के लिए एकत्र की गई है। हम आपके दोष का निदान नहीं करते हैं।",
    ayurDigestion: "पाचन और भूख (अग्नि)",
    ayurSleep: "नींद की गुणवत्ता",
    ayurBowels: "मल त्याग (कोष्ठ)",
    btnSaveAyur: "जीवन शैली की जानकारी सहेजें",
    
    // Upload
    uploadTitle: "मेडिकल रिपोर्ट अपलोड करें",
    uploadSub: "सरल स्पष्टीकरण के लिए अपना नुस्खा या लैब टेस्ट अपलोड करें।",
    uploadPrompt: "अपलोड करने के लिए क्लिक करें",
    uploadTypes: "PDF, JPG, PNG या कैमरा समर्थित है",
    btnCamera: "तस्वीर लें",
    uploadedDoc: "अपलोड किया गया दस्तावेज़",
    explanationEmptyTitle: "दस्तावेज़ की प्रतीक्षा में",
    explanationEmptySub: "रोगी के अनुकूल स्पष्टीकरण देखने के लिए दस्तावेज़ अपलोड करें।",
    patientExplanationTitle: "रोगी रिपोर्ट स्पष्टीकरण",
    btnReadAloud: "पढ़कर सुनाएं",
    aiDisclaimer: "AI-जनित स्पष्टीकरण — कृपया अपने डॉक्टर से सत्यापित करें। इसके आधार पर दवाएं न बदलें।",
    
    // Locker
    lockerTitle: "मेडिकल दस्तावेज़ लॉकर",
    lockerSub: "अपने पिछले रिपोर्ट और नुस्खों को सुरक्षित रूप से एक्सेस करें।",
    btnNewUpload: "नया अपलोड",
    thName: "दस्तावेज़ का नाम",
    thDate: "तारीख",
    thType: "प्रकार",
    thAction: "कार्रवाई",
    btnViewSummary: "सारांश देखें",
    
    // Doctor Summary
    docSummaryTitle: "डॉक्टर का सारांश",
    docSummarySub: "विशेष रूप से आपके डॉक्टर के लिए एक संक्षिप्त, नैदानिक अवलोकन।",
    btnEdit: "संपादित करें",
    btnShare: "शेयर करें",
    
    // SOS
    sosTitle: "आपातकालीन हेल्पलाइन",
    sosDesc: "यदि आप किसी गंभीर चिकित्सा आपातकाल का अनुभव कर रहे हैं, तो कृपया तुरंत नीचे दिए गए नंबरों पर कॉल करें। CareSetu आपातकालीन सेवा नहीं है।",
    sosAmbulance: "108 — एम्बुलेंस",
    sosNational: "112 — राष्ट्रीय आपातकाल",
    
    // Sample AI Report Summary Content (Hindi)
    reportSummaryDetails: `
      <h4>इस रिपोर्ट में क्या है</h4>
      <p>यह 20 सितंबर 2026 की एक मानक पूर्ण रक्त गणना (CBC) परीक्षण रिपोर्ट है।</p>
      
      <h4>महत्वपूर्ण निष्कर्ष</h4>
      <ul>
        <li>आपका हीमोग्लोबिन थोड़ा कम है (11.2 g/dL)।</li>
        <li>श्वेत रक्त कोशिका की गिनती सामान्य है।</li>
        <li>प्लेटलेट्स सामान्य सीमा के भीतर हैं।</li>
      </ul>
      
      <h4>डॉक्टर से चर्चा करने योग्य बातें</h4>
      <ul>
        <li>पूछें कि क्या कम हीमोग्लोबिन के लिए आयरन सप्लीमेंट की आवश्यकता है।</li>
        <li>पूछें कि क्या किसी आहार में बदलाव की आवश्यकता है।</li>
      </ul>
    `
  }
};
