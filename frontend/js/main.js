// State
let currentLang = 'en';
let isRecording = false;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      navigateTo(target);
      
      // Update active state in sidebar
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Ayurveda Chips Selection
  const ayurCategories = document.querySelectorAll('.ayur-category');
  ayurCategories.forEach(cat => {
    const chips = cat.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });

  // Initialize translation
  applyTranslations();
});

// View Navigation
function navigateTo(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }
}

// Translations
function changeLanguage(lang) {
  currentLang = lang;
  applyTranslations();
  
  // If report is uploaded, update its translation
  const explanationContent = document.getElementById('explanationContent');
  if (explanationContent.style.display !== 'none') {
    document.getElementById('translatedExplanation').innerHTML = translations[currentLang].reportSummaryDetails;
  }
}

function applyTranslations() {
  const dict = translations[currentLang];
  if (!dict) return;

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });
}

// SOS Modal
function showSOS() {
  document.getElementById('sosModal').classList.add('active');
}

function closeSOS() {
  document.getElementById('sosModal').classList.remove('active');
}

// Voice Recording Mock
function toggleRecording() {
  const btn = document.getElementById('btnMic');
  const waves = document.getElementById('recWaves');
  const status = document.getElementById('micStatus');
  const textArea = document.getElementById('symptomsText');

  isRecording = !isRecording;

  if (isRecording) {
    btn.classList.add('recording');
    waves.classList.add('active');
    status.textContent = translations[currentLang].micRecording;
    status.classList.add('recording');
  } else {
    btn.classList.remove('recording');
    waves.classList.remove('active');
    status.textContent = translations[currentLang].micReady;
    status.classList.remove('recording');
    
    // Mock the recognized text
    textArea.value = "I have a severe headache and body pain for two days. I am diabetic and allergic to penicillin.";
  }
}

// Extract Symptoms Mock
function processSymptoms() {
  const text = document.getElementById('symptomsText').value;
  if (!text) {
    alert("Please enter or speak your symptoms first.");
    return;
  }
  
  // Mock Extraction Update
  document.getElementById('inpMainSymptoms').value = "Headache, Body pain";
  document.getElementById('inpDuration').value = "2 days";
  document.querySelector('input[name="sev"][value="severe"]').checked = true;
  document.getElementById('inpConditions').value = "Diabetes. Allergic to Penicillin.";
  
  alert(currentLang === 'en' ? "Information extracted successfully." : "వివరాలు విజయవంతంగా సేకరించబడ్డాయి.");
}

function saveHealthStory() {
  alert(currentLang === 'en' ? "Health story saved!" : "ఆరోగ్య వివరాలు సేవ్ చేయబడ్డాయి!");
  navigateTo('view-doctor-summary');
}

// File Upload Mock
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Show preview area
  document.getElementById('dropZone').style.display = 'none';
  document.getElementById('docPreviewWrapper').style.display = 'block';

  // Show AI Explanation area
  document.getElementById('explanationEmpty').style.display = 'none';
  document.getElementById('explanationContent').style.display = 'block';
  
  // Set translated content
  document.getElementById('translatedExplanation').innerHTML = translations[currentLang].reportSummaryDetails;
}

function clearUpload() {
  document.getElementById('fileInput').value = "";
  document.getElementById('dropZone').style.display = 'flex';
  document.getElementById('docPreviewWrapper').style.display = 'none';
  
  document.getElementById('explanationEmpty').style.display = 'flex';
  document.getElementById('explanationContent').style.display = 'none';
}

// Read Aloud TTS Mock
function playAudioSummary() {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance();
    
    // Strip HTML tags for clean reading
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = translations[currentLang].reportSummaryDetails;
    utterance.text = tempDiv.textContent || tempDiv.innerText || "";
    
    if (currentLang === 'te') {
      utterance.lang = 'te-IN';
    } else if (currentLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech is not supported in your browser.");
  }
}
