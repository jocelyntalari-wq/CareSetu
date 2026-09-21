/**
 * CareSetu Patient Intake Module
 * Guides patients through assembling their pre-consultation health story draft.
 * Works seamlessly on smartphones, tablets, and desktop computers.
 */

const PatientModule = {
  currentStep: 1,
  totalSteps: 5,
  uploadedDocs: [],

  init() {
    this.bindEvents();
    this.renderStep(1);
    this.setupDoshaSliders();
  },

  bindEvents() {
    // Step navigation buttons
    document.querySelectorAll('.btn-step-next').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });
    document.querySelectorAll('.btn-step-prev').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });

    // Specialty selection change
    const specRadios = document.querySelectorAll('input[name="patientSpecialty"]');
    specRadios.forEach(r => {
      r.addEventListener('change', (e) => {
        const isAyur = e.target.value === 'Ayurveda';
        const ayurStep = document.getElementById('stepNodeAyur');
        const ayurSection = document.getElementById('step3AyurContent');
        const genMedSection = document.getElementById('step3GenMedContent');
        
        if (isAyur) {
          if (ayurStep) ayurStep.style.display = 'flex';
          if (ayurSection) ayurSection.style.display = 'block';
          if (genMedSection) genMedSection.style.display = 'none';
        } else {
          if (ayurStep) ayurStep.style.display = 'flex';
          if (ayurSection) ayurSection.style.display = 'none';
          if (genMedSection) genMedSection.style.display = 'block';
        }
      });
    });

    // Quick symptom chips
    document.querySelectorAll('.chip-symptom').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        this.updateComplaintsFromChips();
      });
    });

    // Mock document file picker / dropzone
    const dropzone = document.getElementById('patientDropzone');
    if (dropzone) {
      dropzone.addEventListener('click', () => this.simulateDocumentUpload());
    }

    // Submit Final Draft button
    const submitBtn = document.getElementById('btnSubmitDraft');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitFinalDraft());
    }
  },

  renderStep(step) {
    this.currentStep = step;

    // Update step wizard nodes
    for (let i = 1; i <= this.totalSteps; i++) {
      const node = document.getElementById(`stepNode${i}`);
      const content = document.getElementById(`intakeStep${i}`);
      if (node) {
        node.classList.remove('active', 'completed');
        if (i < step) node.classList.add('completed');
        if (i === step) node.classList.add('active');
      }
      if (content) {
        content.style.display = (i === step) ? 'block' : 'none';
      }
    }

    // Scroll to top of form smoothly
    const formTop = document.getElementById('patientIntakeContainer');
    if (formTop) formTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  nextStep() {
    if (this.currentStep === 1) {
      const name = document.getElementById('inputPatientName').value.trim();
      if (!name) {
        showToast('Please enter your full name', 'warning');
        return;
      }
    }
    if (this.currentStep < this.totalSteps) {
      this.renderStep(this.currentStep + 1);
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.renderStep(this.currentStep - 1);
    }
  },

  updateComplaintsFromChips() {
    const selectedChips = Array.from(document.querySelectorAll('.chip-symptom.selected'))
      .map(c => c.dataset.text);
    const textarea = document.getElementById('inputChiefComplaints');
    if (textarea) {
      const current = textarea.value.trim();
      const chipString = selectedChips.join(', ');
      textarea.value = chipString ? `Patient reports: ${chipString}.` : '';
    }
  },

  setupDoshaSliders() {
    const vataSlider = document.getElementById('sliderVata');
    const pittaSlider = document.getElementById('sliderPitta');
    const kaphaSlider = document.getElementById('sliderKapha');

    const updateDoshaLabels = () => {
      let v = parseInt(vataSlider ? vataSlider.value : 33);
      let p = parseInt(pittaSlider ? pittaSlider.value : 33);
      let k = parseInt(kaphaSlider ? kaphaSlider.value : 34);
      let total = v + p + k;
      if (total === 0) total = 1;

      // Normalized percentages
      const vPct = Math.round((v / total) * 100);
      const pPct = Math.round((p / total) * 100);
      const kPct = 100 - vPct - pPct;

      const vEl = document.getElementById('valVata');
      const pEl = document.getElementById('valPitta');
      const kEl = document.getElementById('valKapha');
      if (vEl) vEl.innerText = `${vPct}%`;
      if (pEl) pEl.innerText = `${pPct}%`;
      if (kEl) kEl.innerText = `${kPct}%`;

      const summaryEl = document.getElementById('doshaBalanceSummary');
      if (summaryEl) {
        let dominant = 'Tridoshic Balance';
        if (vPct > 40 && pPct > 35) dominant = 'Vata-Pitta Dominance';
        else if (pPct > 40 && kPct > 35) dominant = 'Pitta-Kapha Dominance';
        else if (kPct > 45) dominant = 'Kapha Dominance';
        else if (vPct > 45) dominant = 'Vata Dominance';
        else if (pPct > 45) dominant = 'Pitta Dominance';
        summaryEl.innerText = dominant;
      }
    };

    [vataSlider, pittaSlider, kaphaSlider].forEach(slider => {
      if (slider) slider.addEventListener('input', updateDoshaLabels);
    });
  },

  simulateDocumentUpload() {
    // Preset mock medical documents to demonstrate automated parsing
    const samples = [
      {
        file_name: 'Diagnostic_Lab_Blood_Biochemistry_2026.pdf',
        file_type: 'Lab Report',
        extracted_summary: 'Fasting Blood Glucose and Glycated Haemoglobin elevated.',
        extracted_values: {
          "HbA1c": "8.1% (High)",
          "Fasting Glucose": "158 mg/dL",
          "Serum Creatinine": "0.88 mg/dL",
          "eGFR": ">90 mL/min"
        }
      },
      {
        file_name: 'Prior_Prescription_Cardiology_Clinic.pdf',
        file_type: 'Prescription',
        extracted_summary: 'Medication schedule identified with dosage intervals.',
        extracted_values: {
          "Metformin": "500mg (1-0-1)",
          "Telmisartan": "40mg (1-0-0)",
          "Atorvastatin": "20mg (0-0-1)"
        }
      },
      {
        file_name: 'Upper_GI_Endoscopy_Clinical_Report.pdf',
        file_type: 'Imaging',
        extracted_summary: 'Mucosal irritation compatible with Amlapitta (Hyperacidity).',
        extracted_values: {
          "Findings": "Mild antral erythema without ulceration",
          "H. Pylori": "Negative",
          "Recommendation": "Dietary regulation and mucosal healing regimen"
        }
      }
    ];

    // Pick one not yet added or random
    const sample = samples[this.uploadedDocs.length % samples.length];
    this.uploadedDocs.push(sample);
    this.renderUploadedDocs();
    showToast(`Uploaded and extracted ${sample.file_name}`, 'success');

    // Auto-populate relevant fields in draft if empty
    if (sample.file_type === 'Prescription') {
      const medInput = document.getElementById('inputCurrentMeds');
      if (medInput && !medInput.value) {
        medInput.value = Object.entries(sample.extracted_values).map(([k, v]) => `${k} ${v}`).join(', ');
      }
    }
  },

  renderUploadedDocs() {
    const listContainer = document.getElementById('patientUploadedDocsList');
    if (!listContainer) return;

    if (this.uploadedDocs.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; font-size: 0.82rem; color: var(--text-muted);">No documents attached yet. Click above to attach past reports.</p>';
      return;
    }

    listContainer.innerHTML = this.uploadedDocs.map((doc, idx) => `
      <div class="doc-pill">
        <div class="doc-info">
          <span style="font-size: 1.4rem;">📄</span>
          <div>
            <strong style="font-size: 0.88rem; color: var(--text-main);">${doc.file_name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${doc.extracted_summary}</div>
            <div class="doc-extracted-tags">
              ${Object.entries(doc.extracted_values || {}).map(([k, v]) => `
                <span class="tag-extract">${k}: ${v}</span>
              `).join('')}
            </div>
          </div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="PatientModule.removeDoc(${idx})">✕</button>
      </div>
    `).join('');
  },

  removeDoc(index) {
    this.uploadedDocs.splice(index, 1);
    this.renderUploadedDocs();
  },

  async submitFinalDraft() {
    const submitBtn = document.getElementById('btnSubmitDraft');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting Story...';
    }

    try {
      const isAyur = document.querySelector('input[name="patientSpecialty"]:checked')?.value === 'Ayurveda';
      const specialty = isAyur ? 'Ayurveda' : 'General Medicine';

      const payload = {
        specialty: specialty,
        department: isAyur ? 'Kayachikitsa (Internal Medicine)' : 'Internal Medicine',
        created_by_role: 'Patient',
        patient: {
          name: document.getElementById('inputPatientName')?.value || 'Guest Patient',
          age: parseInt(document.getElementById('inputPatientAge')?.value || '35'),
          gender: document.getElementById('inputPatientGender')?.value || 'Female',
          phone: document.getElementById('inputPatientPhone')?.value || '+91 98000 12345',
          blood_group: document.getElementById('inputPatientBlood')?.value || 'B+',
          chronic_conditions: document.getElementById('inputChronicConditions')?.value || 'None reported'
        },
        health_story: {
          chief_complaints: document.getElementById('inputChiefComplaints')?.value || 'Routine medical checkup',
          symptom_duration: document.getElementById('inputSymptomDuration')?.value || '2 weeks',
          history_present_illness: document.getElementById('inputHPI')?.value || 'Patient reported symptoms for initial doctor evaluation.',
          past_medical_history: document.getElementById('inputPastHistory')?.value || 'No prior hospitalization',
          current_medications: document.getElementById('inputCurrentMeds')?.value || 'None',
          allergies: document.getElementById('inputAllergies')?.value || 'No known allergies',
          lifestyle_notes: document.getElementById('inputLifestyle')?.value || 'Normal daily routine'
        },
        ayurveda_profile: isAyur ? {
          prakriti_vata: parseInt(document.getElementById('valVata')?.innerText || '33'),
          prakriti_pitta: parseInt(document.getElementById('valPitta')?.innerText || '33'),
          prakriti_kapha: parseInt(document.getElementById('valKapha')?.innerText || '34'),
          agni_type: document.getElementById('selectAgniType')?.value || 'Vishama Agni',
          koshtha_type: document.getElementById('selectKoshtha')?.value || 'Madhyama',
          sleep_pattern: document.getElementById('inputSleep')?.value || '6 hours/night',
          dietary_habits: document.getElementById('inputDiet')?.value || 'Regular home cooked meals'
        } : null,
        documents: this.uploadedDocs
      };

      const result = await API.createConsultation(payload);
      if (result.success) {
        showToast('Your health story draft has been submitted!', 'success');
        this.displayStoryTicket(result.token, payload);
      } else {
        showToast(result.error || 'Failed to submit health story', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while saving draft', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Health Story Draft';
      }
    }
  },

  displayStoryTicket(token, payload) {
    const ticketBox = document.getElementById('patientTicketResult');
    const wizardBox = document.getElementById('patientIntakeWizard');
    if (ticketBox && wizardBox) {
      wizardBox.style.display = 'none';
      ticketBox.style.display = 'block';

      document.getElementById('ticketTokenDisplay').innerText = token;
      document.getElementById('ticketPatientName').innerText = payload.patient.name;
      document.getElementById('ticketSpecialty').innerText = payload.specialty;
      document.getElementById('ticketComplaints').innerText = payload.health_story.chief_complaints;
      document.getElementById('ticketDocCount').innerText = `${this.uploadedDocs.length} Documents Attached`;

      // Generate a clean visual QR code SVG simulation
      const qrBox = document.getElementById('ticketQrContainer');
      if (qrBox) {
        qrBox.innerHTML = `
          <svg viewBox="0 0 100 100" width="120" height="120">
            <rect width="100" height="100" fill="#ffffff"/>
            <!-- Position Markers -->
            <rect x="10" y="10" width="25" height="25" fill="#0f172a"/>
            <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="18" y="18" width="9" height="9" fill="#0f172a"/>

            <rect x="65" y="10" width="25" height="25" fill="#0f172a"/>
            <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="73" y="18" width="9" height="9" fill="#0f172a"/>

            <rect x="10" y="65" width="25" height="25" fill="#0f172a"/>
            <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
            <rect x="18" y="73" width="9" height="9" fill="#0f172a"/>

            <!-- CareSetu Token Matrix Pattern -->
            <rect x="42" y="12" width="6" height="6" fill="#0d9488"/>
            <rect x="52" y="20" width="6" height="6" fill="#0f172a"/>
            <rect x="42" y="28" width="6" height="6" fill="#0f172a"/>
            <rect x="12" y="45" width="6" height="6" fill="#0f172a"/>
            <rect x="22" y="48" width="6" height="6" fill="#0d9488"/>
            <rect x="35" y="45" width="8" height="8" fill="#0f172a"/>
            <rect x="48" y="48" width="8" height="8" fill="#0d9488"/>
            <rect x="60" y="42" width="6" height="6" fill="#0f172a"/>
            <rect x="75" y="48" width="6" height="6" fill="#0f172a"/>
            <rect x="45" y="65" width="6" height="6" fill="#0f172a"/>
            <rect x="55" y="72" width="6" height="6" fill="#0d9488"/>
            <rect x="68" y="65" width="6" height="6" fill="#0f172a"/>
            <rect x="80" y="75" width="8" height="8" fill="#0d9488"/>
          </svg>
        `;
      }
    }
  },

  resetIntakeForm() {
    const ticketBox = document.getElementById('patientTicketResult');
    const wizardBox = document.getElementById('patientIntakeWizard');
    if (ticketBox && wizardBox) {
      ticketBox.style.display = 'none';
      wizardBox.style.display = 'block';
      this.uploadedDocs = [];
      this.renderUploadedDocs();
      this.renderStep(1);
    }
  }
};

window.PatientModule = PatientModule;
