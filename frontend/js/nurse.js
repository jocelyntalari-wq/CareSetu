/**
 * CareSetu Nurse Triage Module
 * Enables rapid vitals logging, document verification, and priority assignment.
 */

const NurseModule = {
  activeList: [],
  selectedConsultationId: null,

  init() {
    this.bindEvents();
    State.on('specialtyChanged', () => this.loadTriageQueue());
  },

  bindEvents() {
    // Height & Weight listener for auto BMI calculation
    const wtInput = document.getElementById('nurseInputWeight');
    const htInput = document.getElementById('nurseInputHeight');
    const calcBmi = () => {
      const wt = parseFloat(wtInput?.value || 0);
      const ht = parseFloat(htInput?.value || 0);
      const bmiEl = document.getElementById('nurseCalculatedBmi');
      if (wt > 0 && ht > 0 && bmiEl) {
        const bmi = (wt / ((ht / 100) ** 2)).toFixed(1);
        bmiEl.innerText = `${bmi} kg/m²`;
      }
    };
    if (wtInput) wtInput.addEventListener('input', calcBmi);
    if (htInput) htInput.addEventListener('input', calcBmi);

    // Save vitals & dispatch button
    const btnSaveVitals = document.getElementById('btnNurseSaveVitals');
    if (btnSaveVitals) {
      btnSaveVitals.addEventListener('click', () => this.saveVitalsAndTriage());
    }
  },

  async loadTriageQueue() {
    try {
      const specialty = State.currentSpecialty;
      const data = await API.getConsultations({ specialty });
      this.activeList = data.consultations || [];
      this.renderTriageTable();
    } catch (err) {
      console.error(err);
      showToast('Failed to load nurse triage queue', 'error');
    }
  },

  renderTriageTable() {
    const tbody = document.getElementById('nurseTriageTableBody');
    if (!tbody) return;

    if (this.activeList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No patients in queue.</td></tr>';
      return;
    }

    tbody.innerHTML = this.activeList.map(c => `
      <tr style="border-bottom: 1px solid var(--border-subtle); transition: var(--transition);">
        <td style="padding: 0.85rem 1rem;">
          <span style="font-weight: 700; color: var(--text-main);">${c.token}</span>
        </td>
        <td style="padding: 0.85rem 1rem;">
          <strong>${c.patient_name}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${c.patient_age}y / ${c.patient_gender} | ${c.blood_group || 'N/A'}</div>
        </td>
        <td style="padding: 0.85rem 1rem;">
          <span style="font-size: 0.8rem; font-weight: 600; color: ${c.specialty === 'Ayurveda' ? 'var(--ayur-dark)' : 'var(--primary-hover)'};">
            ${c.specialty === 'Ayurveda' ? '🌿' : '🩺'} ${c.specialty}
          </span>
        </td>
        <td style="padding: 0.85rem 1rem; max-width: 260px;">
          <div style="font-size: 0.82rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${c.chief_complaints || 'Routine checkup'}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${c.doc_count} document(s) attached</div>
        </td>
        <td style="padding: 0.85rem 1rem;">
          <span class="badge-status priority-${c.priority}">${c.priority}</span>
        </td>
        <td style="padding: 0.85rem 1rem;">
          <span class="badge-status status-${c.status}">${c.status.replace('_', ' ')}</span>
        </td>
        <td style="padding: 0.85rem 1rem; text-align: right;">
          <button class="btn btn-sm btn-primary" onclick="NurseModule.openTriageModal(${c.id})">
            ${c.bp_sys ? 'Edit Vitals' : 'Record Vitals'}
          </button>
        </td>
      </tr>
    `).join('');
  },

  async openTriageModal(consultationId) {
    this.selectedConsultationId = consultationId;
    const modal = document.getElementById('nurseTriageModal');
    if (!modal) return;

    try {
      const data = await API.getConsultation(consultationId);
      const { consultation, patient, health_story, vitals } = data;

      document.getElementById('modalNursePatientInfo').innerText = `${patient.name} (${patient.age}y / ${patient.gender}) - Token: ${consultation.token}`;
      document.getElementById('modalNurseComplaints').innerText = `Complaints: ${health_story?.chief_complaints || 'None'}`;

      // Pre-fill existing vitals if available
      document.getElementById('nurseInputBpSys').value = vitals?.bp_sys || 120;
      document.getElementById('nurseInputBpDia').value = vitals?.bp_dia || 80;
      document.getElementById('nurseInputPulse').value = vitals?.pulse || 72;
      document.getElementById('nurseInputSpo2').value = vitals?.spo2 || 98;
      document.getElementById('nurseInputTemp').value = vitals?.temp_f || 98.6;
      document.getElementById('nurseInputSugar').value = vitals?.blood_sugar || 110;
      document.getElementById('nurseInputWeight').value = vitals?.weight_kg || 70;
      document.getElementById('nurseInputHeight').value = vitals?.height_cm || 170;
      document.getElementById('nurseInputNotes').value = vitals?.triage_notes || 'Patient ambulatory and alert. Documents verified.';

      const bmiEl = document.getElementById('nurseCalculatedBmi');
      if (bmiEl) {
        const wt = vitals?.weight_kg || 70;
        const ht = vitals?.height_cm || 170;
        bmiEl.innerText = `${(wt / ((ht/100)**2)).toFixed(1)} kg/m²`;
      }

      // Priority radio
      const priorityVal = consultation.priority || 'Routine';
      const rad = document.querySelector(`input[name="nursePriority"][value="${priorityVal}"]`);
      if (rad) rad.checked = true;

      modal.classList.add('active');
    } catch (err) {
      console.error(err);
      showToast('Error opening triage record', 'error');
    }
  },

  closeModal() {
    const modal = document.getElementById('nurseTriageModal');
    if (modal) modal.classList.remove('active');
  },

  async saveVitalsAndTriage() {
    if (!this.selectedConsultationId) return;

    const payload = {
      bp_sys: parseInt(document.getElementById('nurseInputBpSys')?.value || 120),
      bp_dia: parseInt(document.getElementById('nurseInputBpDia')?.value || 80),
      pulse: parseInt(document.getElementById('nurseInputPulse')?.value || 72),
      spo2: parseInt(document.getElementById('nurseInputSpo2')?.value || 98),
      temp_f: parseFloat(document.getElementById('nurseInputTemp')?.value || 98.6),
      blood_sugar: parseInt(document.getElementById('nurseInputSugar')?.value || 110),
      weight_kg: parseFloat(document.getElementById('nurseInputWeight')?.value || 70),
      height_cm: parseFloat(document.getElementById('nurseInputHeight')?.value || 170),
      priority: document.querySelector('input[name="nursePriority"]:checked')?.value || 'Routine',
      triage_notes: document.getElementById('nurseInputNotes')?.value || 'Vitals stable',
      recorded_by: 'Staff Nurse, RN'
    };

    try {
      const res = await API.updateVitals(this.selectedConsultationId, payload);
      if (res.success) {
        showToast('Vitals recorded and dispatched to doctor!', 'success');
        this.closeModal();
        this.loadTriageQueue();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save nurse vitals', 'error');
    }
  }
};

window.NurseModule = NurseModule;
