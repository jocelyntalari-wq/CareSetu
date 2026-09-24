import re

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove desktop-controls-bar
html = re.sub(r'<aside class="desktop-controls-bar"[\s\S]*?</aside>', '', html)

# 2. Change app-container to desktop-layout and insert sidebar
html = re.sub(
    r'<div class="app-container" id="appContainer">',
    '''<div class="desktop-layout" id="appContainer">
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

    <div class="main-content-area">''',
    html
)

# 3. Remove bottom-nav-dock
html = re.sub(r'<nav class="bottom-nav-dock"[\s\S]*?</nav>', '', html)

# 4. Close main-content-area and desktop-layout
html = re.sub(r'</div>\s*<!-- ====================================================================\s*MODAL 1', '    </div>\n  </div>\n\n  <!-- ====================================================================\n       MODAL 1', html)

# 5. Remove phone-status-bar
html = re.sub(r'<!-- Phone Status Bar -->[\s\S]*?</div>', '', html)

# 6. Remove original app-brand-bar
html = re.sub(r'<!-- Brand Header -->[\s\S]*?<main class="app-scroll-content">', '<main class="app-scroll-content">', html)

# 7. Add demo dropdown to top-accessibility-header
html = re.sub(r'</header>', '''  <div>
        <select id="demoProfileSelect" style="font-size: 0.85rem; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-card); background: #FFF; color: var(--text-primary);">
          <option value="ramesh">Case 1: Ramesh (GenMed • 58M)</option>
          <option value="sunita">Case 2: Sunita Devi (Ayurveda • 62F)</option>
          <option value="new">➕ Start Fresh Patient Intake</option>
        </select>
      </div>
    </header>''', html)

# 8. View-symptoms split panel
symptoms_match = re.search(r'<!-- SECTION A: GENERAL MEDICINE INTAKE -->[\s\S]*?</section>', html)
if symptoms_match:
    symptoms_html = symptoms_match.group(0)
    new_symptoms_html = re.sub(
        r'<!-- SECTION A: GENERAL MEDICINE INTAKE -->',
        '''<div class="split-panel">
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
      <!-- SECTION A: GENERAL MEDICINE INTAKE -->''',
        symptoms_html
    )

    new_symptoms_html = re.sub(r'<!-- 2\. Voice Dictation & Spoken Notes -->[\s\S]*?</textarea>\s*</div>', '', new_symptoms_html)
    new_symptoms_html = re.sub(r'<!-- Save Story Button -->', '    </div>\n  </div>\n\n  <!-- Save Story Button -->', new_symptoms_html)
    html = html.replace(symptoms_html, new_symptoms_html)

# 9. View-documents split panel
docs_match = re.search(r'<section id="view-documents" class="view-container">[\s\S]*?</section>', html)
if docs_match:
    docs_html = docs_match.group(0)
    new_docs_html = re.sub(
        r'<!-- Upload Trigger Dropzone -->',
        '''<div class="split-panel">
    <div class="panel-left">
      <!-- Upload Trigger Dropzone -->''',
        docs_html
    )
    new_docs_html = re.sub(
        r'<!-- Attached Documents List -->',
        '''    </div>
    <div class="panel-right">
      <!-- Attached Documents List -->''',
        new_docs_html
    )
    new_docs_html = re.sub(
        r'</section>',
        '''    </div>
  </div>
</section>''',
        new_docs_html
    )
    html = html.replace(docs_html, new_docs_html)

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html refactored successfully.")
