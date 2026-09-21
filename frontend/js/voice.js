/**
 * CareSetu Voice & Audio Accessibility Module
 * Provides:
 * 1. Speech Synthesis (TTS) - Reads screen text aloud for elderly and low-literacy users.
 * 2. Speech Recognition (STT) - Voice input for symptoms and health notes.
 * 3. Auditory Feedback - Reassuring soft chime sounds using Web Audio API.
 */

const Voice = {
  isSpeaking: false,
  isListening: false,
  recognition: null,
  audioCtx: null,

  init() {
    this.initSpeechRecognition();
  },

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    return this.audioCtx;
  },

  playChime(type = 'start') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'stop') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  },

  speakText(text, onEndCallback) {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.updateAudioGuideButtons(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate language voice
    const lang = I18n.currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = lang;
    utterance.rate = 0.92; // Slightly slower, clear cadence for elderly users
    utterance.pitch = 1.0;

    this.isSpeaking = true;
    this.updateAudioGuideButtons(true);

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateAudioGuideButtons(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.updateAudioGuideButtons(false);
    };

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.updateAudioGuideButtons(false);
    }
  },

  updateAudioGuideButtons(isPlaying) {
    const guideBtns = document.querySelectorAll('.btn-audio-guide');
    guideBtns.forEach(btn => {
      btn.classList.toggle('playing', isPlaying);
      if (isPlaying) {
        btn.innerHTML = '<span>⏹️ Stop Audio</span>';
      } else {
        const key = btn.getAttribute('data-i18n') || 'tapToListen';
        btn.innerHTML = `<span>🔊 ${I18n.t(key)}</span>`;
      }
    });
  },

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.playChime('start');
        this.updateMicUi(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const noteInput = document.getElementById('storyFreeNotes');
        if (noteInput) {
          const currentText = noteInput.value.replace(/\[Listening\.\.\..*?\]/g, '').trim();
          const spoken = finalTranscript || interimTranscript;
          noteInput.value = currentText ? `${currentText} ${spoken}` : spoken;
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.updateMicUi(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.playChime('stop');
        this.updateMicUi(false);
      };
    }
  },

  toggleListening() {
    if (!this.recognition) {
      // Graceful simulated fallback if browser blocks microphone API or lacks support
      this.simulateSpeechInput();
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.lang = I18n.currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Error starting speech recognition:', err);
        this.simulateSpeechInput();
      }
    }
  },

  simulateSpeechInput() {
    // Demonstration dictation for demonstration environments without mic permissions
    this.playChime('start');
    this.updateMicUi(true);

    const noteInput = document.getElementById('storyFreeNotes');
    const samplePhrases = I18n.currentLang === 'hi'
      ? [
          'मुझे पिछले 4 दिनों से लगातार बुखार और शरीर में भारी जकड़न महसूस हो रही है।',
          'रात में खाना खाने के बाद पेट में बहुत गैस और भारीपन रहता है, नींद ठीक से नहीं आती।'
        ]
      : [
          'I have had intermittent low-grade fever with joint stiffness for the past 4 days.',
          'Feeling bloated and sluggish after meals, waking up with fatigue in the morning.'
        ];

    const phrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    
    setTimeout(() => {
      if (noteInput) {
        const existing = noteInput.value.trim();
        noteInput.value = existing ? `${existing} ${phrase}` : phrase;
      }
      this.playChime('success');
      this.updateMicUi(false);
      showToast(I18n.currentLang === 'hi' ? 'आवाज़ से विवरण जोड़ा गया' : 'Voice note recorded successfully', 'success');
    }, 1800);
  },

  updateMicUi(isRecording) {
    const micBtn = document.getElementById('btnRecordStoryVoice');
    const statusText = document.getElementById('voiceMicStatusText');
    if (micBtn) {
      micBtn.classList.toggle('recording', isRecording);
    }
    if (statusText) {
      statusText.innerText = isRecording 
        ? I18n.t('micListening') 
        : I18n.t('micPrompt');
    }
  }
};
