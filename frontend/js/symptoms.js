/**
 * CareSetu Symptoms & Intake Module
 * Handles dual intake: General Medicine (Allopathy) & Ayurveda (AYUSH)
 * Includes pictorial symptom selection, severity slider, voice dictation,
 * and existing medicine recording.
 */

const SymptomsModule = {
  init() {
    this.bindEvents();
    this.renderState();
  },

  bindEvents() {
    // Track Switcher Buttons (GenMed vs Ayurveda)
    const genMedTabBtn = document.getElementById('tabTrackGenMed');
    const ayurTabBtn = document.getElementById('tabTrackAyur');
    const genMedSection = document.getElementById('sectionGenMedIntake');
    const ayurSection = document.getElementById('sectionAyurIntake');

    if (genMedTabBtn && ayurTabBtn) {
      genMedTabBtn.addEventListener('click', () => {
        State.patient.track = 'General Medicine';
        genMedTabBtn.classList.add('active', 'genmed');
        ayurTabBtn.classList.remove('active', 'ayur');
        if (genMedSection) genMedSection.style.display = 'block';
        if (ayurSection) ayurSection.style.display = 'none';
        PassportModule.renderPassport();
        Voice.playChime('start');
      });

      ayurTabBtn.addEventListener('click', () => {
        State.patient.track = 'Ayurveda';
        ayurTabBtn.classList.add('active', 'ayur');
        genMedTabBtn.classList.remove('active', 'genmed');
        if (ayurSection) ayurSection.style.display = 'block';
        if (genMedSection) genMedSection.style.display = 'none';
        PassportModule.renderPassport();
        Voice.playChime('start');
      });
    }

    // Symptom Tile Toggles
    document.querySelectorAll('.symptom-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        tile.classList.toggle('selected');
        Voice.playChime('start');
        this.updateSymptomsFromTiles();
      });
    });

    // Severity Slider
    const severitySlider = document.getElementById('inputStorySeverity');
    const severityValLabel = document.getElementById('valStorySeverity');
    if (severitySlider && severityValLabel) {
      severitySlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        let label = 'Mild';
        if (val === 2) label = 'Moderate';
        if (val === 3) label = 'Severe';
        
        State.symptoms.severity = label;
        severityValLabel.innerText = I18n.t(`severity${label.charAt(0).toUpperCase() + label.slice(1)}`);
      });
    }

    // Duration Input & Unit
    const durationInput = document.getElementById('inputStoryDurationVal');
    const durationUnitSelect = document.getElementById('inputStoryDurationUnit');
    if (durationInput) {
      durationInput.addEventListener('change', (e) => {
        State.symptoms.durationValue = e.target.value || '1';
      });
    }
    if (durationUnitSelect) {
      durationUnitSelect.addEventListener('change', (e) => {
        State.symptoms.durationUnit = e.target.value;
      });
    }

    // Free notes change
    const notesInput = document.getElementById('storyFreeNotes');
    if (notesInput) {
      notesInput.addEventListener('input', (e) => {
        State.symptoms.freeNotes = e.target.value;
      });
    }

    // Microphone Voice Input Button
    const micBtn = document.getElementById('btnRecordStoryVoice');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        Voice.toggleListening();
      });
    }

    // Audio guide for Symptoms page
    const symptomsAudioBtn = document.getElementById('btnAudioSymptoms');
    if (symptomsAudioBtn) {
      symptomsAudioBtn.addEventListener('click', () => {
        const text = I18n.currentLang === 'hi'
          ? 'यहाँ अपनी बीमारी या परेशानी के लक्षण चुनें। आप नीचे माइक का बटन दबाकर अपनी बात बोलकर भी बता सकते हैं।'
          : 'Record your health story here. Tap any symptoms you feel or tap the big microphone button to speak in your own voice.';
        Voice.speakText(text);
      });
    }

    // Ayurveda Select Cards (Agni, Koshtha, Sleep, Dosha)
    document.querySelectorAll('.ayur-select-card').forEach(card => {
      card.addEventListener('click', () => {
        const group = card.dataset.group;
        if (group) {
          // Single select per group
          document.querySelectorAll(`.ayur-select-card[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');

          const val = card.dataset.value;
          if (group === 'agni') State.ayurveda.agni = val;
          if (group === 'koshtha') State.ayurveda.koshtha = val;
          if (group === 'sleep') State.ayurveda.sleep = val;
        } else if (card.classList.contains('dosha-card')) {
          // Multi-select for dosha traits
          card.classList.toggle('selected');
          const selected = Array.from(document.querySelectorAll('.dosha-card.selected')).map(c => c.dataset.value);
          State.ayurveda.dominantDoshaTraits = selected;
        }
        Voice.playChime('start');
      });
    });

    // Save Health Story Button
    const saveBtn = document.getElementById('btnSaveHealthStory');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        State.saveLocal();
        Voice.playChime('success');
        showToast(I18n.currentLang === 'hi' ? 'स्वास्थ्य विवरण सफलतापूर्वक सुरक्षित किया गया' : 'Health story saved successfully', 'success');
        App.navigateTo('summary');
      });
    }

    // Add Regular Medicine button
    const addMedBtn = document.getElementById('btnAddRegularMed');
    if (addMedBtn) {
      addMedBtn.addEventListener('click', () => {
        this.promptAddRegularMedicine();
      });
    }
  },

  updateSymptomsFromTiles() {
    const selected = Array.from(document.querySelectorAll('.symptom-tile.selected'))
      .map(tile => tile.dataset.symptom);
    State.symptoms.chiefComplaints = selected;
    PassportModule.renderPassport();
  },

  promptAddRegularMedicine() {
    const name = prompt(I18n.currentLang === 'hi' ? 'दवा का नाम लिखें (उदा. Metformin 500mg):' : 'Enter medicine name (e.g. Amlodipine 5mg):');
    if (!name || !name.trim()) return;

    const timing = prompt(I18n.currentLang === 'hi' ? 'लेने का समय (उदा. सुबह नाश्ते के बाद):' : 'Dosage / Timing (e.g. 1 tab morning after food):') || 'As advised';

    State.patient.regularMeds.push({
      name: name.trim(),
      dosage: timing.trim(),
      note: 'Patient-recorded regular medication'
    });

    this.renderMedicinesList();
    State.saveLocal();
    Voice.playChime('success');
    showToast(I18n.currentLang === 'hi' ? 'दवा दर्ज कर ली गई है' : 'Medicine recorded', 'success');
  },

  renderMedicinesList() {
    const listEl = document.getElementById('regularMedsList');
    if (!listEl) return;

    if (!State.patient.regularMeds || State.patient.regularMeds.length === 0) {
      listEl.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); padding:6px 0;">${I18n.t('noMedsRecorded')}</div>`;
      return;
    }

    listEl.innerHTML = State.patient.regularMeds.map((m, idx) => `
      <div class="med-recorder-item">
        <span style="font-size: 1.1rem;">💊</span>
        <div style="flex:1;">
          <div class="med-name-badge">${escapeHtml(m.name)}</div>
          <div style="font-size: 0.74rem; color: var(--text-secondary);">${escapeHtml(m.dosage)}</div>
        </div>
        <button class="btn-remove-med" onclick="SymptomsModule.removeMedicine(${idx})" title="Remove" style="background:none; border:none; cursor:pointer; color:#EF4444; font-size:1.1rem;">✕</button>
      </div>
    `).join('');
  },

  removeMedicine(index) {
    if (State.patient.regularMeds[index]) {
      State.patient.regularMeds.splice(index, 1);
      this.renderMedicinesList();
      State.saveLocal();
    }
  },

  renderState() {
    // Select tiles matching current state
    document.querySelectorAll('.symptom-tile').forEach(tile => {
      const sym = tile.dataset.symptom;
      if (State.symptoms.chiefComplaints.includes(sym)) {
        tile.classList.add('selected');
      } else {
        tile.classList.remove('selected');
      }
    });

    // Free notes
    const notesInput = document.getElementById('storyFreeNotes');
    if (notesInput) {
      notesInput.value = State.symptoms.freeNotes || '';
    }

    // Severity Slider
    const severitySlider = document.getElementById('inputStorySeverity');
    const severityValLabel = document.getElementById('valStorySeverity');
    if (severitySlider && severityValLabel) {
      const sev = State.symptoms.severity;
      let val = 2;
      if (sev === 'Mild') val = 1;
      if (sev === 'Severe') val = 3;
      severitySlider.value = val;
      severityValLabel.innerText = I18n.t(`severity${sev}`);
    }

    // Medicines
    this.renderMedicinesList();

    // Ayurveda options
    document.querySelectorAll('.ayur-select-card').forEach(card => {
      const group = card.dataset.group;
      const val = card.dataset.value;
      if (group === 'agni' && State.ayurveda.agni.startsWith(val)) {
        card.classList.add('selected');
      } else if (group === 'koshtha' && State.ayurveda.koshtha.startsWith(val)) {
        card.classList.add('selected');
      } else if (group === 'sleep' && State.ayurveda.sleep.startsWith(val)) {
        card.classList.add('selected');
      }
    });
  }
};
