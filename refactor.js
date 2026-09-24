const fs = require('fs');

let html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. Remove desktop-controls-bar
html = html.replace(/<aside class="desktop-controls-bar"[\s\S]*?<\/aside>/, '');

// 2. Change app-container to desktop-layout and insert sidebar
html = html.replace(/<div class="app-container" id="appContainer">/, `<div class="desktop-layout" id="appContainer">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="app-brand-bar">
        <div class="brand-identity">
          <div class="brand-icon-wrap" title="CareSetu - Health Bridge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 18h18" />
              <path d="M4 18v-5a7 7 0 0 1 14 0v5" />
              <path d="M10 18v-6" />
              <path d="M14 18v-6" />
            </svg>
          </div>
          <div>
            <div class="brand-title">CareSetu</div>
            <div class="brand-subtitle" data-i18n="brandTagline">“My Health Story ➔ My Doctor”</div>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav" aria-label="Main Navigation">
        <button class="nav-dock-item active" data-view="passport">
          <span class="nav-icon">🛡️</span>
          <span data-i18n="navPassport">Passport</span>
        </button>
        <button class="nav-dock-item" data-view="symptoms">
          <span class="nav-icon">📖</span>
          <span data-i18n="navStory">Health Story</span>
        </button>
        <button class="nav-dock-item" data-view="documents">
          <span class="nav-icon">📁</span>
          <span data-i18n="navDocs">Documents</span>
        </button>
        <button class="nav-dock-item" data-view="summary">
          <span class="nav-icon">📋</span>
          <span data-i18n="navSummary">Doctor Summary</span>
        </button>
      </nav>
    </aside>

    <div class="main-content-area">`);

// 3. Remove bottom-nav-dock
html = html.replace(/<nav class="bottom-nav-dock"[\s\S]*?<\/nav>/, '');

// 4. Close main-content-area and desktop-layout
html = html.replace(/<\/div>\s*<!-- ====================================================================\s*MODAL 1/, '    </div>\n  </div>\n\n  <!-- ====================================================================\n       MODAL 1');

// 5. Remove phone-status-bar
html = html.replace(/<!-- Phone Status Bar -->[\s\S]*?<\/div>/, '');

// 6. Remove original app-brand-bar
html = html.replace(/<!-- Brand Header -->[\s\S]*?<main class="app-scroll-content">/, '<main class="app-scroll-content">');

// 7. Add demo dropdown to top-accessibility-header
html = html.replace(/<\/header>/, `  <div>
        <select id="demoProfileSelect" style="font-size: 0.85rem; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-card); background: #FFF; color: var(--text-primary);">
          <option value="ramesh">Case 1: Ramesh (GenMed • 58M)</option>
          <option value="sunita">Case 2: Sunita Devi (Ayurveda • 62F)</option>
          <option value="new">➕ Start Fresh Patient Intake</option>
        </select>
      </div>
    </header>`);

// 8. View-symptoms split panel
let symptomsHTML = html.match(/<!-- SECTION A: GENERAL MEDICINE INTAKE -->[\s\S]*?<\/section>/)[0];
let newSymptomsHTML = symptomsHTML.replace(
  /<!-- SECTION A: GENERAL MEDICINE INTAKE -->/,
  `<div class="split-panel">
    <div class="panel-left">
      <!-- 2. Voice Dictation & Spoken Notes -->
      <div class="voice-dictation-wrap">
        <div style="font-size: 0.84rem; font-weight: 700; margin-bottom: 4px;" data-i18n="speakStory">
          Or tap to speak your symptoms:
        </div>
        <button id="btnRecordStoryVoice" class="btn-mic-large" title="Tap to Speak">
          🎤
        </button>
        <div class="voice-status-text" id="voiceMicStatusText" data-i18n="micPrompt">
          Tap microphone and speak in Hindi or English
        </div>
        <div class="soundwave-bars">
          <div class="soundwave-bar"></div>
          <div class="soundwave-bar"></div>
          <div class="soundwave-bar"></div>
          <div class="soundwave-bar"></div>
          <div class="soundwave-bar"></div>
        </div>
        <textarea id="storyFreeNotes" class="form-textarea" style="margin-top: 10px;" placeholder="Spoken or written details will appear here..."></textarea>
      </div>
    </div>
    <div class="panel-right">
      <!-- SECTION A: GENERAL MEDICINE INTAKE -->`
);

// We need to remove the original voice-dictation-wrap from the right panel
newSymptomsHTML = newSymptomsHTML.replace(/<!-- 2\. Voice Dictation & Spoken Notes -->[\s\S]*?<\/textarea>\s*<\/div>/, '');

// Close the split-panel before the "Save Story Button"
newSymptomsHTML = newSymptomsHTML.replace(/<!-- Save Story Button -->/, `    </div>\n  </div>\n\n  <!-- Save Story Button -->`);

html = html.replace(symptomsHTML, newSymptomsHTML);

// 9. View-documents split panel
let documentsHTML = html.match(/<section id="view-documents" class="view-container">[\s\S]*?<\/section>/)[0];
let newDocumentsHTML = documentsHTML.replace(
  /<!-- Upload Trigger Dropzone -->/,
  `<div class="split-panel">
    <div class="panel-left">
      <!-- Upload Trigger Dropzone -->`
);
newDocumentsHTML = newDocumentsHTML.replace(
  /<!-- Attached Documents List -->/,
  `    </div>
    <div class="panel-right">
      <!-- Attached Documents List -->`
);
newDocumentsHTML = newDocumentsHTML.replace(
  /<\/section>/,
  `    </div>
  </div>
</section>`
);
html = html.replace(documentsHTML, newDocumentsHTML);

fs.writeFileSync('frontend/index.html', html);
console.log("index.html refactored successfully.");
