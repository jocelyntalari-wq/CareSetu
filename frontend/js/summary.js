/**
 * CareSetu Doctor-Ready Summary Module
 * Generates the AI draft summary connecting "My Health Story" -> "My Doctor"
 * Strictly complies with non-diagnostic guidelines:
 * NO diagnosis, NO medicine recommendations, NO treatment suggestions.
 */

const SummaryModule = {
  init() {
    this.renderSummary();
    this.bindEvents();
  },

  bindEvents() {
    // Show to Doctor Fullscreen Mode
    const showDoctorBtn = document.getElementById('btnShowDoctorMode');
    const doctorModal = document.getElementById('doctorPresentationModal');
    const closeDoctorModalBtn = document.getElementById('btnCloseDoctorPres');

    if (showDoctorBtn && doctorModal) {
      showDoctorBtn.addEventListener('click', () => {
        this.renderDoctorPresentationView();
        doctorModal.style.display = 'block';
        Voice.playChime('start');
      });
    }

    if (closeDoctorModalBtn && doctorModal) {
      closeDoctorModalBtn.addEventListener('click', () => {
        doctorModal.style.display = 'none';
      });
    }

    // Download / Print PDF
    const printBtn = document.getElementById('btnPrintPdfSummary');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Read Aloud Summary
    const readSummaryBtn = document.getElementById('btnReadAloudSummary');
    if (readSummaryBtn) {
      readSummaryBtn.addEventListener('click', () => {
        this.readSummaryAloud();
      });
    }

    // Edit Health Story button
    const editBtn = document.getElementById('btnEditFromSummary');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        App.navigateTo('symptoms');
      });
    }

    // Regenerate / Refresh Summary Animation
    const regenBtn = document.getElementById('btnRegenSummary');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        this.simulateAiSynthesis();
      });
    }
  },

  simulateAiSynthesis() {
    const summaryCard = document.getElementById('doctorSummarySheet');
    if (!summaryCard) return;

    Voice.playChime('start');
    summaryCard.innerHTML = `
      <div style="text-align: center; padding: 40px 16px;">
        <div style="font-size: 2.4rem; animation: spin 1s infinite linear;">🌉</div>
        <div style="font-weight: 700; color: var(--primary-dark); margin-top: 12px; font-size: 1rem;">
          ${I18n.currentLang === 'hi' ? 'केयरसेतु ब्रिज द्वारा स्वास्थ्य जानकारी व्यवस्थित की जा रही है...' : 'CareSetu Bridge is assembling your doctor-ready summary...'}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
          ${I18n.currentLang === 'hi' ? 'दस्तावेज़, लक्षण व दवाएं क्रमबद्ध की जा रही हैं' : 'Structuring timeline, attaching lab findings, preparing clinical view'}
        </div>
      </div>
    `;

    setTimeout(() => {
      this.renderSummary();
      Voice.playChime('success');
      showToast(I18n.currentLang === 'hi' ? 'डॉक्टर सारांश तैयार है!' : 'Doctor summary assembled!', 'success');
    }, 1400);
  },

  renderSummary() {
    const p = State.patient;
    const s = State.symptoms;
    const a = State.ayurveda;
    const d = State.documents;
    const q = State.doctorQuestions;

    const summaryCard = document.getElementById('doctorSummarySheet');
    if (!summaryCard) return;

    const isAyur = p.track === 'Ayurveda';
    const complaintsList = s.chiefComplaints.length > 0 
      ? s.chiefComplaints.map(c => `<li><strong>${escapeHtml(c)}</strong></li>`).join('') 
      : '<li>No acute symptoms selected</li>';

    const medsList = p.regularMeds && p.regularMeds.length > 0
      ? p.regularMeds.map(m => `<li><strong>${escapeHtml(m.name)}</strong>: ${escapeHtml(m.dosage)} <em>(${escapeHtml(m.note || 'Patient-reported')})</em></li>`).join('')
      : '<li>No regular daily medications reported</li>';

    const docsList = d && d.length > 0
      ? d.map(doc => `<li><strong>${escapeHtml(doc.title)}</strong> (${escapeHtml(doc.date)}): ${escapeHtml(doc.extractedData)}</li>`).join('')
      : '<li>No previous medical documents attached</li>';

    const questionsList = q && q.length > 0
      ? q.map(item => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>General consultation review</li>';

    let ayurBlock = '';
    if (isAyur || a) {
      ayurBlock = `
        <div class="summary-section-block" style="background: var(--ayur-light); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--ayur-border); margin-bottom: 14px;">
          <div class="summary-block-title" style="color: var(--ayur-dark);">
            <span>🌿</span> Ayurveda & Lifestyle Profile (Patient-Reported)
          </div>
          <ul class="summary-bullet-list">
            <li><strong>Agni (Digestion & Appetite):</strong> ${escapeHtml(a.agni || 'Not specified')}</li>
            <li><strong>Koshtha (Bowel Habit):</strong> ${escapeHtml(a.koshtha || 'Not specified')}</li>
            <li><strong>Sleep Quality:</strong> ${escapeHtml(a.sleep || 'Not specified')}</li>
            <li><strong>Dominant Prakriti Indicators:</strong> ${escapeHtml(a.dominantDoshaTraits ? a.dominantDoshaTraits.join('; ') : 'Balanced')}</li>
          </ul>
        </div>
      `;
    }

    summaryCard.innerHTML = `
      <div class="doctor-sheet-header">
        <div>
          <div style="font-size: 0.72rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.08em;">
            CareSetu • Patient Health Story Bridge
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
            ${escapeHtml(p.name)}
          </h2>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
            Age: <strong>${p.age} yrs</strong> • Gender: <strong>${p.gender}</strong> • Blood Group: <strong style="color: var(--emergency-red);">${p.bloodGroup}</strong> • ID: <code>${p.id}</code>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.72rem; background: var(--primary-subtle); color: var(--primary-dark); font-weight: 700; padding: 4px 8px; border-radius: 6px; border: 1px solid var(--primary-light);">
            ${isAyur ? '🌿 AYUSH / Ayurveda' : '🩺 General Medicine'}
          </span>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">
            Prepared: Today
          </div>
        </div>
      </div>

      <!-- Prominent Non-Diagnostic Medical Disclaimer -->
      <div class="warning-alert-card" style="margin-bottom: 14px;">
        <div class="warning-icon">⚠️</div>
        <div>
          <div class="warning-title">Notice for Attending Physician & Patient</div>
          <div class="warning-desc">
            This is an AI-formatted summary of <strong>patient-reported history and records</strong>. CareSetu does <strong>not</strong> provide diagnostic decisions, medicine recommendations, or treatment plans. All clinical evaluations and prescriptions remain solely with the examining physician.
          </div>
        </div>
      </div>

      <!-- Known Allergies Banner (Crucial Safety Alert) -->
      <div style="background: #FEF2F2; border-left: 4px solid var(--emergency-red); padding: 8px 12px; margin-bottom: 14px; border-radius: 4px;">
        <strong style="color: #991B1B; font-size: 0.85rem;">⚠️ Known Drug Allergies & Alerts:</strong>
        <span style="color: #7F1D1D; font-size: 0.85rem; font-weight: 600; margin-left: 6px;">${escapeHtml(p.allergies)}</span>
      </div>

      <!-- 1. Chief Complaints & Timeline -->
      <div class="summary-section-block">
        <div class="summary-block-title">
          <span>🩺</span> 1. Chief Complaints & Duration
        </div>
        <ul class="summary-bullet-list">
          ${complaintsList}
        </ul>
        <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 6px; background: var(--bg-cream); padding: 6px 10px; border-radius: 6px;">
          <strong>Timeline & Severity:</strong> ${escapeHtml(s.severity)} discomfort for approximately <strong>${escapeHtml(s.durationValue)} ${escapeHtml(s.durationUnit)}</strong>.
          <br>
          <em>"${escapeHtml(s.freeNotes || 'No additional notes')}"</em>
        </div>
      </div>

      <!-- 2. Chronic History & Current Medications -->
      <div class="summary-section-block">
        <div class="summary-block-title">
          <span>💊</span> 2. Chronic Conditions & Regular Medications
        </div>
        <div style="font-size: 0.82rem; margin-bottom: 4px;">
          <strong>Pre-existing Conditions:</strong> ${escapeHtml(p.chronicConditions.join(', '))}
        </div>
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); margin-top: 6px;">Current Regular Regimen (Patient-Reported):</div>
        <ul class="summary-bullet-list">
          ${medsList}
        </ul>
      </div>

      <!-- 3. Ayurveda Profile (if applicable) -->
      ${ayurBlock}

      <!-- 4. Previous Lab & Scans Summary -->
      <div class="summary-section-block">
        <div class="summary-block-title">
          <span>📄</span> 3. Key Findings from Attached Documents
        </div>
        <ul class="summary-bullet-list">
          ${docsList}
        </ul>
      </div>

      <!-- 5. Questions Patient Wants to Discuss -->
      <div class="summary-section-block" style="border-bottom: none;">
        <div class="summary-block-title" style="color: #0369A1;">
          <span>💬</span> 4. Questions Prepared for Doctor Discussion
        </div>
        <ul class="summary-bullet-list">
          ${questionsList}
        </ul>
      </div>
    `;
  },

  renderDoctorPresentationView() {
    const modalContent = document.getElementById('doctorPresentationContent');
    const summaryCard = document.getElementById('doctorSummarySheet');
    if (modalContent && summaryCard) {
      modalContent.innerHTML = summaryCard.innerHTML;
    }
  },

  readSummaryAloud() {
    const p = State.patient;
    const s = State.symptoms;
    const complaints = s.chiefComplaints.join(', ');
    
    const text = I18n.currentLang === 'hi'
      ? `डॉक्टर के लिए सारांश। मरीज ${p.name}, उम्र ${p.age} वर्ष। मुख्य समस्याएँ हैं: ${complaints}। तकलीफ ${s.durationValue} ${s.durationUnit} से है। मरीज की नियमित दवाएं हैं: ${p.regularMeds.map(m => m.name).join(', ')}। ज्ञात दवा एलर्जी: ${p.allergies}। यह ड्राफ्ट केवल डॉक्टर से चर्चा के लिए है।`
      : `Health summary for your doctor. Patient ${p.name}, age ${p.age}. Chief complaints are: ${complaints}, for the last ${s.durationValue} ${s.durationUnit}. Currently taking: ${p.regularMeds.map(m => m.name).join(', ')}. Known allergy alert: ${p.allergies}. This is a draft prepared for your doctor consultation.`;

    Voice.speakText(text);
  }
};
