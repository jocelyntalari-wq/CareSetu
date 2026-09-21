/**
 * CareSetu Doctor Workbench Module
 * Allows doctors to inspect, check, correct, annotate, and approve patient health story drafts.
 * Features dual-lens clinical assessment: General Medicine & Ayurveda.
 */

const DoctorModule = {
  currentRecord: null,
  activeQueue: [],

  init() {
    this.bindEvents();
    State.on('activeConsultationChanged', (id) => this.loadConsultation(id));
    State.on('specialtyChanged', () => this.loadQueue());
  },

  bindEvents() {
    // Search input in doctor queue
    const searchInput = document.getElementById('doctorQueueSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterQueue(e.target.value.trim().toLowerCase());
      });
    }

    // Save corrections button
    const btnSaveCorrect = document.getElementById('btnDoctorSaveCorrect');
    if (btnSaveCorrect) {
      btnSaveCorrect.addEventListener('click', () => this.saveCorrections());
    }

    // Final Approve Consultation button
    const btnApprove = document.getElementById('btnDoctorApprove');
    if (btnApprove) {
      btnApprove.addEventListener('click', () => this.approveConsultation());
    }

    // Print summary button
    const btnPrint = document.getElementById('btnDoctorPrint');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }
  },

  async loadQueue() {
    try {
      const specialty = State.currentSpecialty;
      const data = await API.getConsultations({ specialty });
      this.activeQueue = data.consultations || [];
      this.renderQueueList();

      // Automatically select first consultation or active ID
      if (this.activeQueue.length > 0) {
        const found = this.activeQueue.find(c => c.id === State.activeConsultationId);
        const toLoad = found ? found.id : this.activeQueue[0].id;
        this.loadConsultation(toLoad);
      } else {
        this.renderEmptyState();
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading doctor queue', 'error');
    }
  },

  filterQueue(term) {
    const items = document.querySelectorAll('.doctor-queue-item');
    items.forEach(item => {
      const text = item.innerText.toLowerCase();
      item.style.display = text.includes(term) ? 'block' : 'none';
    });
  },

  renderQueueList() {
    const container = document.getElementById('doctorQueueList');
    if (!container) return;

    if (this.activeQueue.length === 0) {
      container.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No consultations found.</div>';
      return;
    }

    container.innerHTML = this.activeQueue.map(c => `
      <div class="doctor-queue-item queue-item ${c.id === State.activeConsultationId ? 'active' : ''}"
           onclick="DoctorModule.loadConsultation(${c.id})">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
          <strong style="font-size: 0.92rem; color: var(--text-main);">${c.patient_name} (${c.patient_age}${c.patient_gender ? c.patient_gender[0] : ''})</strong>
          <span class="badge-status priority-${c.priority}">${c.priority}</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
          <span>${c.token}</span>
          <span class="badge-status status-${c.status}">${c.status.replace('_', ' ')}</span>
        </div>
        <div style="font-size: 0.75rem; color: ${c.specialty === 'Ayurveda' ? 'var(--ayur-dark)' : 'var(--primary-hover)'}; font-weight: 600; margin-top: 0.25rem;">
          ${c.specialty === 'Ayurveda' ? '🌿' : '🩺'} ${c.specialty}
        </div>
      </div>
    `).join('');
  },

  async loadConsultation(id) {
    State.activeConsultationId = id;
    this.renderQueueList(); // update active class

    const container = document.getElementById('doctorWorkbenchContainer');
    if (!container) return;

    try {
      const data = await API.getConsultation(id);
      this.currentRecord = data;
      this.renderWorkbench(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading consultation details', 'error');
    }
  },

  renderWorkbench(data) {
    const { consultation, patient, health_story, ayurveda_profile, documents, vitals, clinical_notes } = data;
    const isAyur = consultation.specialty === 'Ayurveda';

    // Header info
    document.getElementById('docPatientHeaderName').innerText = `${patient.name} (${patient.age}y / ${patient.gender})`;
    document.getElementById('docPatientHeaderMeta').innerText = `Token: ${consultation.token} | ABHA: ${patient.abha_id || 'N/A'} | Blood Group: ${patient.blood_group || 'N/A'}`;
    document.getElementById('docHeaderSpecialty').innerText = `${isAyur ? '🌿 Ayurveda' : '🩺 General Medicine'} - ${consultation.department}`;
    
    const statusBadge = document.getElementById('docHeaderStatusBadge');
    if (statusBadge) {
      statusBadge.className = `badge-status status-${consultation.status}`;
      statusBadge.innerText = consultation.status.replace('_', ' ');
    }

    // Left Panel: Patient's Submitted Draft Story
    document.getElementById('docDraftComplaints').innerText = health_story?.chief_complaints || 'No complaints logged';
    document.getElementById('docDraftDuration').innerText = health_story?.symptom_duration || 'Not specified';
    document.getElementById('docDraftHPI').innerText = health_story?.history_present_illness || 'None';
    document.getElementById('docDraftPastMeds').innerText = health_story?.current_medications || 'None';
    document.getElementById('docDraftAllergies').innerText = health_story?.allergies || 'No known allergies';

    // Nurse Vitals
    const vitalsBox = document.getElementById('docDraftVitalsBox');
    if (vitalsBox) {
      if (vitals) {
        vitalsBox.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center;">
            <div class="vital-metric-card"><div class="vital-metric-label">BP</div><div class="vital-metric-value" style="font-size: 1.1rem;">${vitals.bp_sys}/${vitals.bp_dia}</div><div style="font-size: 0.7rem; color: var(--text-dim);">mmHg</div></div>
            <div class="vital-metric-card"><div class="vital-metric-label">Pulse</div><div class="vital-metric-value" style="font-size: 1.1rem;">${vitals.pulse}</div><div style="font-size: 0.7rem; color: var(--text-dim);">bpm</div></div>
            <div class="vital-metric-card"><div class="vital-metric-label">SpO2</div><div class="vital-metric-value" style="font-size: 1.1rem;">${vitals.spo2}%</div><div style="font-size: 0.7rem; color: var(--text-dim);">Room air</div></div>
            <div class="vital-metric-card"><div class="vital-metric-label">Glucose</div><div class="vital-metric-value" style="font-size: 1.1rem;">${vitals.blood_sugar}</div><div style="font-size: 0.7rem; color: var(--text-dim);">mg/dL</div></div>
          </div>
          <div style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--text-muted);">
            <strong>Triage Note (${vitals.recorded_by}):</strong> ${vitals.triage_notes || 'Vitals verified.'}
          </div>
        `;
      } else {
        vitalsBox.innerHTML = '<div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic;">Nurse vitals not yet logged.</div>';
      }
    }

    // Documents section on left
    const docBox = document.getElementById('docDraftDocumentsList');
    if (docBox) {
      if (documents && documents.length > 0) {
        docBox.innerHTML = documents.map(d => `
          <div class="doc-pill" style="margin-bottom: 0.5rem;">
            <div class="doc-info">
              <span>📄</span>
              <div>
                <strong style="font-size: 0.85rem;">${d.file_name}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${d.extracted_summary}</div>
                <div class="doc-extracted-tags">
                  ${d.extracted_values ? Object.entries(d.extracted_values).map(([k, v]) => `
                    <span class="tag-extract">${k}: ${v}</span>
                  `).join('') : ''}
                </div>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        docBox.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">No prior documents uploaded.</div>';
      }
    }

    // Ayurveda Profile on left (if applicable)
    const ayurLeftSection = document.getElementById('docDraftAyurSection');
    if (ayurLeftSection) {
      if (isAyur && ayurveda_profile) {
        ayurLeftSection.style.display = 'block';
        document.getElementById('docAyurDoshaVals').innerText = `Vata: ${ayurveda_profile.prakriti_vata}% | Pitta: ${ayurveda_profile.prakriti_pitta}% | Kapha: ${ayurveda_profile.prakriti_kapha}%`;
        document.getElementById('docAyurAgni').innerText = ayurveda_profile.agni_type || 'Vishama Agni';
        document.getElementById('docAyurKoshtha').innerText = ayurveda_profile.koshtha_type || 'Madhyama';
        document.getElementById('docAyurHabits').innerText = ayurveda_profile.dietary_habits || 'Standard';
      } else {
        ayurLeftSection.style.display = 'none';
      }
    }

    // Right Panel: Doctor Correction & Approval Form
    // Pre-populate with existing doctor corrections or draft
    const inputDiag = document.getElementById('docInputDiagnosis');
    const inputCorrectHPI = document.getElementById('docInputCorrectHPI');
    const inputPrescriptions = document.getElementById('docInputPrescriptions');
    const ayurClinicalSection = document.getElementById('docAyurClinicalSection');
    const genMedClinicalSection = document.getElementById('docGenMedClinicalSection');

    if (isAyur) {
      if (ayurClinicalSection) ayurClinicalSection.style.display = 'block';
      if (genMedClinicalSection) genMedClinicalSection.style.display = 'none';
    } else {
      if (ayurClinicalSection) ayurClinicalSection.style.display = 'none';
      if (genMedClinicalSection) genMedClinicalSection.style.display = 'block';
    }

    if (clinical_notes) {
      if (inputDiag) inputDiag.value = clinical_notes.diagnosis || '';
      if (inputCorrectHPI) inputCorrectHPI.value = health_story?.history_present_illness || '';
      
      // Prescriptions / herbal meds
      if (!isAyur && clinical_notes.prescriptions && inputPrescriptions) {
        inputPrescriptions.value = typeof clinical_notes.prescriptions === 'string' 
          ? clinical_notes.prescriptions 
          : JSON.stringify(clinical_notes.prescriptions, null, 2);
      }

      // If approved, show signature stamp
      this.renderApprovedStamp(clinical_notes);
    } else {
      // Default initial templates for doctor convenience
      if (inputDiag && !inputDiag.value) {
        inputDiag.value = isAyur 
          ? 'Amlapitta (Functional dyspepsia with Pitta-Vata vitiation)'
          : 'Type 2 Diabetes Mellitus with sub-optimal glycaemic control, Bilateral Knee Osteoarthritis';
      }
      if (inputCorrectHPI) {
        inputCorrectHPI.value = health_story?.history_present_illness || '';
      }
      this.hideApprovedStamp();
    }
  },

  renderApprovedStamp(notes) {
    const stamp = document.getElementById('docApprovalStamp');
    const btnApprove = document.getElementById('btnDoctorApprove');
    if (stamp && notes.is_approved) {
      stamp.style.display = 'flex';
      document.getElementById('stampSignerText').innerText = notes.digital_signature;
      document.getElementById('stampDateText').innerText = `Approved on: ${notes.approved_at}`;
      if (btnApprove) {
        btnApprove.innerText = '✓ Approved & Signed';
        btnApprove.disabled = true;
      }
    }
  },

  hideApprovedStamp() {
    const stamp = document.getElementById('docApprovalStamp');
    const btnApprove = document.getElementById('btnDoctorApprove');
    if (stamp) stamp.style.display = 'none';
    if (btnApprove) {
      btnApprove.innerText = 'Approve & Finalize Consultation';
      btnApprove.disabled = false;
    }
  },

  async saveCorrections() {
    if (!this.currentRecord) return;
    const cId = this.currentRecord.consultation.id;

    const correctedHPI = document.getElementById('docInputCorrectHPI')?.value || '';
    const payload = {
      health_story: {
        history_present_illness: correctedHPI
      },
      correction_summary: 'Doctor corrected history and timeline in draft'
    };

    try {
      const res = await API.correctDraft(cId, payload);
      if (res.success) {
        showToast('Clinical draft corrections saved!', 'success');
        this.loadConsultation(cId);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save doctor corrections', 'error');
    }
  },

  async approveConsultation() {
    if (!this.currentRecord) return;
    const cId = this.currentRecord.consultation.id;
    const isAyur = this.currentRecord.consultation.specialty === 'Ayurveda';

    const doctorName = isAyur 
      ? 'Vaidya Meera Namboodiri, BAMS, MD (Ayu)'
      : 'Dr. Arvind Swaminathan, MD';

    const diagnosis = document.getElementById('docInputDiagnosis')?.value.trim() || 'Clinical evaluation finalized';
    const ayurNidana = document.getElementById('docInputAyurNidana')?.value.trim() || 'Pitta-Vata Prakopa';
    const advice = document.getElementById('docInputAdvice')?.value.trim() || 'Follow up in 2 weeks or SOS';

    // Herbal formulations for Ayurveda or General Medicine prescriptions
    let prescriptions = [];
    let ayurMedicines = [];
    let pathyaApathya = {};

    if (isAyur) {
      ayurMedicines = [
        { name: "Avipattikar Churna", dose: "3g with warm water", frequency: "Twice daily before meals", duration: "15 days" },
        { name: "Kamadudha Rasa (Mukta Yukta)", dose: "1 Tablet (250mg)", frequency: "Twice daily with milk", duration: "30 days" },
        { name: "Sutshekhar Rasa", dose: "1 Tablet", frequency: "Morning and evening after meals", duration: "15 days" }
      ];
      pathyaApathya = {
        pathya: ["Pomegranate (Dadima)", "Barley (Yava)", "Cool boiled water", "Fresh buttermilk with roasted cumin"],
        apathya: ["Spicy, oily, sour foods", "Late-night dinner after 9 PM", "Caffeine on empty stomach", "Excessive sunlight exposure"]
      };
    } else {
      prescriptions = [
        { drug: "Tab. Metformin", strength: "500 mg", dosage: "1-0-1", instructions: "With meals strictly" },
        { drug: "Tab. Telmisartan", strength: "40 mg", dosage: "1-0-0", instructions: "Morning post-breakfast" },
        { drug: "Tab. Paracetamol", strength: "650 mg", dosage: "SOS", instructions: "For knee pain if needed (Max 3/day)" }
      ];
    }

    const payload = {
      doctor_name: doctorName,
      diagnosis: diagnosis,
      ayurvedic_nidana: ayurNidana,
      prescriptions: prescriptions,
      ayurvedic_medicines: ayurMedicines,
      pathya_apathya: pathyaApathya,
      follow_up_advice: advice,
      digital_signature: `Digitally Verified & Approved by ${doctorName} (CareSetu Signature Hash: CS-${Date.now().toString(36).toUpperCase()})`
    };

    try {
      const res = await API.approveConsultation(cId, payload);
      if (res.success) {
        showToast('Consultation successfully approved and finalized!', 'success');
        this.loadConsultation(cId);
        this.loadQueue(); // Refresh queue list status
      }
    } catch (err) {
      console.error(err);
      showToast('Error approving consultation', 'error');
    }
  },

  renderEmptyState() {
    const container = document.getElementById('doctorWorkbenchContainer');
    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🩺</div>
          <h3>Doctor Consultation Workbench</h3>
          <p>No consultations matching filter. Select another specialty or wait for nurse triage handoff.</p>
        </div>
      `;
    }
  }
};

window.DoctorModule = DoctorModule;
