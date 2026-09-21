/**
 * CareSetu Support Staff & Care Navigator Module
 * Empowers hospital staff to assist walk-in patients on any tablet/computer without kiosk hardware.
 */

const StaffModule = {
  init() {
    this.bindEvents();
    State.on('specialtyChanged', () => this.loadStaffData());
  },

  bindEvents() {
    const searchBtn = document.getElementById('btnStaffSearch');
    const searchInput = document.getElementById('staffTokenSearch');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const query = searchInput?.value.trim();
        if (query) this.lookupToken(query);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) this.lookupToken(query);
        }
      });
    }

    // Assisted intake button
    const btnAssisted = document.getElementById('btnStaffAssistedIntake');
    if (btnAssisted) {
      btnAssisted.addEventListener('click', () => {
        State.setRole('patient');
        showToast('Switched to Patient Intake mode for assisted entry', 'info');
      });
    }
  },

  async loadStaffData() {
    await this.loadStats();
    await this.loadRecentRegistrations();
  },

  async loadStats() {
    try {
      const stats = await API.getStats();
      document.getElementById('statTotalConsultations').innerText = stats.total_consultations || 0;
      document.getElementById('statDrafts').innerText = stats.draft_submitted || 0;
      document.getElementById('statTriaged').innerText = stats.triaged || 0;
      document.getElementById('statInConsult').innerText = stats.in_consultation || 0;
      document.getElementById('statApproved').innerText = stats.approved || 0;
      document.getElementById('statGenMed').innerText = stats.general_medicine || 0;
      document.getElementById('statAyurveda').innerText = stats.ayurveda || 0;
    } catch (err) {
      console.error(err);
    }
  },

  async loadRecentRegistrations() {
    try {
      const data = await API.getConsultations();
      const listContainer = document.getElementById('staffRecentConsultations');
      if (!listContainer) return;

      const list = data.consultations || [];
      if (list.length === 0) {
        listContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No records registered.</div>';
        return;
      }

      listContainer.innerHTML = list.map(c => `
        <div class="doc-pill" style="margin-bottom: 0.65rem; cursor: pointer;" onclick="StaffModule.lookupToken('${c.token}')">
          <div class="doc-info">
            <span style="font-size: 1.5rem;">${c.specialty === 'Ayurveda' ? '🌿' : '🩺'}</span>
            <div>
              <strong style="color: var(--text-main); font-size: 0.9rem;">${c.patient_name} (${c.patient_age}y / ${c.patient_gender})</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Token: <b style="color: var(--primary);">${c.token}</b> | Phone: ${c.patient_phone || 'N/A'}</div>
              <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.2rem;">${c.chief_complaints || 'Routine checkup'}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="badge-status status-${c.status}">${c.status.replace('_', ' ')}</span>
            <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.3rem;">${c.created_at.split(' ')[0]}</div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
    }
  },

  async lookupToken(tokenOrQuery) {
    try {
      const modal = document.getElementById('staffLookupModal');
      const data = await API.getConsultation(tokenOrQuery);
      const { consultation, patient, health_story, vitals, clinical_notes, documents } = data;

      document.getElementById('lookupPatientName').innerText = `${patient.name} (${patient.age}y / ${patient.gender})`;
      document.getElementById('lookupToken').innerText = consultation.token;
      document.getElementById('lookupSpecialty').innerText = `${consultation.specialty} (${consultation.department})`;
      document.getElementById('lookupStatusBadge').className = `badge-status status-${consultation.status}`;
      document.getElementById('lookupStatusBadge').innerText = consultation.status.replace('_', ' ');

      document.getElementById('lookupComplaints').innerText = health_story?.chief_complaints || 'None';
      document.getElementById('lookupMeds').innerText = health_story?.current_medications || 'None';
      
      const vBox = document.getElementById('lookupVitalsBox');
      if (vBox) {
        if (vitals) {
          vBox.innerText = `BP: ${vitals.bp_sys}/${vitals.bp_dia} mmHg | Pulse: ${vitals.pulse} bpm | SpO2: ${vitals.spo2}% | Sugar: ${vitals.blood_sugar} mg/dL | BMI: ${vitals.bmi || 'N/A'}`;
        } else {
          vBox.innerText = 'Vitals not yet recorded by Nurse Triage.';
        }
      }

      const notesBox = document.getElementById('lookupDoctorNotesBox');
      if (notesBox) {
        if (clinical_notes && clinical_notes.is_approved) {
          notesBox.innerHTML = `
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.75rem; border-radius: 8px;">
              <strong style="color: #065f46;">✓ Finalized by ${clinical_notes.doctor_name}</strong>
              <p style="font-size: 0.8rem; margin-top: 0.25rem;"><b>Diagnosis:</b> ${clinical_notes.diagnosis}</p>
              <p style="font-size: 0.75rem; color: var(--text-muted);">${clinical_notes.digital_signature}</p>
            </div>
          `;
        } else {
          notesBox.innerHTML = '<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Doctor review pending.</span>';
        }
      }

      if (modal) modal.classList.add('active');
    } catch (err) {
      console.error(err);
      showToast('Token or patient record not found', 'warning');
    }
  },

  closeLookupModal() {
    const modal = document.getElementById('staffLookupModal');
    if (modal) modal.classList.remove('active');
  }
};

window.StaffModule = StaffModule;
