/**
 * CareSetu Main Mobile Application Controller
 * Manages tab navigation, accessibility scaling, bilingual triggers,
 * desktop frame toggles, and demo profiles.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
  let toast = document.getElementById('caresetuToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'caresetuToast';
    toast.className = 'caresetu-toast';
    document.body.appendChild(toast);
  }

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    emergency: '🚨'
  };

  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  toast.classList.add('visible');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2800);
}

const App = {
  currentView: 'passport',

  init() {
    State.loadLocal();
    I18n.applyTranslations();
    Voice.init();

    PassportModule.init();
    SymptomsModule.init();
    DocumentsModule.init();
    SummaryModule.init();

    this.bindNavigation();
    this.bindAccessibility();
    this.bindDesktopControls();

    // Default to passport view
    this.navigateTo('passport');
  },

  bindNavigation() {
    // Bottom Dock Items
    document.querySelectorAll('.nav-dock-item').forEach(item => {
      item.addEventListener('click', () => {
        const targetView = item.dataset.view;
        if (targetView) {
          this.navigateTo(targetView);
          Voice.playChime('start');
        }
      });
    });

    // Quick action cards from Passport view
    document.querySelectorAll('.action-card').forEach(card => {
      card.addEventListener('click', () => {
        const targetView = card.dataset.targetView;
        if (targetView) {
          if (card.dataset.track) {
            State.patient.track = card.dataset.track;
            // Activate corresponding tab in symptoms
            if (card.dataset.track === 'Ayurveda') {
              const btn = document.getElementById('tabTrackAyur');
              if (btn) btn.click();
            } else {
              const btn = document.getElementById('tabTrackGenMed');
              if (btn) btn.click();
            }
          }
          this.navigateTo(targetView);
          Voice.playChime('start');
        }
      });
    });

    // Back buttons
    document.querySelectorAll('.btn-back-circle').forEach(btn => {
      btn.addEventListener('click', () => {
        const backTarget = btn.dataset.back || 'passport';
        this.navigateTo(backTarget);
      });
    });
  },

  navigateTo(viewId) {
    this.currentView = viewId;

    // Toggle active view container
    document.querySelectorAll('.view-container').forEach(v => {
      v.classList.toggle('active', v.id === `view-${viewId}`);
    });

    // Toggle bottom dock items
    document.querySelectorAll('.nav-dock-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Refresh view data if required
    if (viewId === 'passport') PassportModule.renderPassport();
    if (viewId === 'summary') SummaryModule.renderSummary();
    if (viewId === 'documents') DocumentsModule.renderDocuments();
    if (viewId === 'symptoms') SymptomsModule.renderState();

    // Scroll to top of scroll container
    const scrollContainer = document.querySelector('.app-scroll-content');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  },

  bindAccessibility() {
    // Language Switcher Button
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const nextLang = I18n.toggleLanguage();
        PassportModule.renderPassport();
        SymptomsModule.renderState();
        SummaryModule.renderSummary();
        showToast(nextLang === 'hi' ? 'भाषा: हिंदी चुनी गई' : 'Language: English selected', 'info');
      });
    }

    // Font Sizing Buttons (A / A+ / A++)
    document.querySelectorAll('.btn-font-size').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.size;
        document.documentElement.setAttribute('data-font-size', size);
        document.querySelectorAll('.btn-font-size').forEach(b => {
          b.style.fontWeight = (b === btn) ? '900' : '400';
          b.style.borderColor = (b === btn) ? 'var(--primary)' : 'var(--border-subtle)';
        });
        showToast(`Text size: ${size.toUpperCase()}`, 'info');
      });
    });
  },

  bindDesktopControls() {
    // Viewport Mode Buttons (Phone Frame vs Fullscreen)
    const phoneModeBtn = document.getElementById('btnModePhone');
    const fullModeBtn = document.getElementById('btnModeFull');
    const appContainer = document.getElementById('appContainer');

    if (phoneModeBtn && fullModeBtn && appContainer) {
      phoneModeBtn.addEventListener('click', () => {
        phoneModeBtn.classList.add('active');
        fullModeBtn.classList.remove('active');
        appContainer.classList.remove('fullscreen-mode');
      });

      fullModeBtn.addEventListener('click', () => {
        fullModeBtn.classList.add('active');
        phoneModeBtn.classList.remove('active');
        appContainer.classList.add('fullscreen-mode');
      });
    }

    // Demo Case Switcher Dropdown
    const demoSelect = document.getElementById('demoProfileSelect');
    if (demoSelect) {
      demoSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'ramesh' || val === 'sunita') {
          State.loadDemo(val);
          PassportModule.renderPassport();
          SymptomsModule.renderState();
          DocumentsModule.renderDocuments();
          SummaryModule.renderSummary();
          showToast(`Loaded: ${State.patient.name} (${State.patient.track})`, 'success');
        } else if (val === 'new') {
          State.patient = {
            id: 'CS-NEW-' + Math.floor(1000 + Math.random() * 9000),
            name: 'New Patient',
            age: 40,
            gender: 'Female',
            bloodGroup: 'O+',
            emergencyContact: 'Family Member: +91 98000 00000',
            allergies: 'None recorded',
            track: 'General Medicine',
            chronicConditions: [],
            regularMeds: []
          };
          State.symptoms = {
            chiefComplaints: [],
            severity: 'Mild',
            durationValue: '1',
            durationUnit: 'Days',
            freeNotes: '',
            updatedAt: 'Just now'
          };
          State.saveLocal();
          PassportModule.renderPassport();
          SymptomsModule.renderState();
          SummaryModule.renderSummary();
          this.navigateTo('symptoms');
          showToast('Loaded fresh patient intake form', 'info');
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
