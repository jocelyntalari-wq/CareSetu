/**
 * CareSetu Passport Module
 * Renders the Digital Health Passport card, the CareSetu Bridge metaphor,
 * and handles emergency helpline modal.
 */

const PassportModule = {
  init() {
    this.renderPassport();
    this.bindEvents();
  },

  bindEvents() {
    // Audio guide for Passport
    const passportAudioBtn = document.getElementById('btnAudioPassport');
    if (passportAudioBtn) {
      passportAudioBtn.addEventListener('click', () => {
        const p = State.patient;
        const text = I18n.currentLang === 'hi'
          ? `यह आपका डिजिटल हेल्थ पासपोर्ट है। मरीज का नाम ${p.name}, उम्र ${p.age} वर्ष, रक्त समूह ${p.bloodGroup}। आपकी दर्ज एलर्जी: ${p.allergies}। यह जानकारी आपके डॉक्टर को परामर्श के समय दिखाई जाएगी।`
          : `This is your Digital Health Passport for patient ${p.name}, age ${p.age}, blood group ${p.bloodGroup}. Important allergy alert: ${p.allergies}. This summary connects your health history to your doctor.`;
        Voice.speakText(text);
      });
    }

    // Emergency SOS Button
    const sosBtn = document.getElementById('btnEmergencySos');
    const sosModal = document.getElementById('emergencySosModal');
    const closeSosBtn = document.getElementById('btnCloseSosModal');

    if (sosBtn && sosModal) {
      sosBtn.addEventListener('click', () => {
        Voice.playChime('stop');
        sosModal.style.display = 'flex';
      });
    }

    if (closeSosBtn && sosModal) {
      closeSosBtn.addEventListener('click', () => {
        sosModal.style.display = 'none';
      });
    }
  },

  renderPassport() {
    const p = State.patient;

    const idEl = document.getElementById('passportIdVal');
    if (idEl) idEl.innerText = p.id;

    const nameEl = document.getElementById('passportNameVal');
    if (nameEl) nameEl.innerText = p.name;

    const ageGenderEl = document.getElementById('passportAgeGenderVal');
    if (ageGenderEl) ageGenderEl.innerText = `${p.age} yrs • ${p.gender}`;

    const bloodEl = document.getElementById('passportBloodVal');
    if (bloodEl) bloodEl.innerText = p.bloodGroup;

    const contactEl = document.getElementById('passportContactVal');
    if (contactEl) contactEl.innerText = p.emergencyContact;

    const allergiesEl = document.getElementById('passportAllergiesVal');
    if (allergiesEl) {
      allergiesEl.innerText = p.allergies || I18n.t('noAllergies');
    }

    // Update Track badge
    const trackBadgeEl = document.getElementById('passportTrackBadge');
    if (trackBadgeEl) {
      trackBadgeEl.innerText = p.track === 'Ayurveda' ? '🌿 Ayurveda Track' : '🩺 GenMed Track';
      trackBadgeEl.className = p.track === 'Ayurveda' ? 'meta-chip' : 'meta-chip';
      trackBadgeEl.style.background = p.track === 'Ayurveda' ? '#DCFCE7' : '#DBEAFE';
      trackBadgeEl.style.color = p.track === 'Ayurveda' ? '#166534' : '#1E40AF';
    }

    // Update Bridge Status Text
    const bridgeStatusEl = document.getElementById('bridgeStatusText');
    if (bridgeStatusEl) {
      const isReady = State.symptoms.chiefComplaints.length > 0;
      bridgeStatusEl.innerText = isReady 
        ? (I18n.currentLang === 'hi' ? '🌉 ब्रिज तैयार: आपकी स्वास्थ्य कहानी डॉक्टर को दिखाने के लिए व्यवस्थित है' : '🌉 Bridge Active: Your health story is structured and ready for your doctor')
        : (I18n.currentLang === 'hi' ? '🌉 ब्रिज प्रगति पर: कृपया अपनी स्वास्थ्य जानकारी दर्ज करें' : '🌉 Bridge In Progress: Add your symptoms to connect with your doctor');
    }
  }
};
