/**
 * CareSetu Documents Module
 * Medical Document Locker: Prescriptions, Lab Reports, Scans
 * Supports photo capture simulation, file upload, extracted key tags, and preview modal.
 */

const DocumentsModule = {
  init() {
    this.renderDocuments();
    this.bindEvents();
  },

  bindEvents() {
    // Dropzone upload trigger
    const dropzone = document.getElementById('docUploadDropzone');
    const fileInput = document.getElementById('hiddenDocFileInput');
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleFileUpload(file);
        }
      });
    }

    // Audio guide for Documents
    const docAudioBtn = document.getElementById('btnAudioDocuments');
    if (docAudioBtn) {
      docAudioBtn.addEventListener('click', () => {
        const text = I18n.currentLang === 'hi'
          ? 'यहाँ आप अपने पुराने पर्चे, खून की जांच और एक्स-रे की फोटो सुरक्षित रख सकते हैं। डॉक्टर को दिखाने के लिए यह बेहद उपयोगी है।'
          : 'This is your Medical Document Locker. Keep your old prescriptions, blood test reports, and scans organized here to show your doctor.';
        Voice.speakText(text);
      });
    }

    // Close preview modal
    const closePreviewBtn = document.getElementById('btnCloseDocPreview');
    const previewModal = document.getElementById('docPreviewModal');
    if (closePreviewBtn && previewModal) {
      closePreviewBtn.addEventListener('click', () => {
        previewModal.style.display = 'none';
      });
    }
  },

  handleFileUpload(file) {
    Voice.playChime('start');
    showToast(I18n.currentLang === 'hi' ? 'दस्तावेज़ स्कैन व अपलोड किया जा रहा है...' : 'Scanning and attaching document...', 'info');

    // Simulate smart OCR / tag extraction
    setTimeout(() => {
      const isPrescription = file.name.toLowerCase().includes('rx') || file.name.toLowerCase().includes('presc') || file.type.includes('image');
      const newDoc = {
        id: 'doc-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        date: 'Today',
        category: isPrescription ? 'Prescription' : 'Lab Report',
        categoryClass: isPrescription ? 'rx' : 'lab',
        extractedData: isPrescription 
          ? 'Identified Medication Schedule • Attached for Doctor Review' 
          : 'Recent Diagnostic Report • Clinical Parameters Extracted',
        icon: isPrescription ? '💊' : '🩸',
        fileName: file.name
      };

      State.documents.unshift(newDoc);
      State.saveLocal();
      this.renderDocuments();
      Voice.playChime('success');
      showToast(I18n.currentLang === 'hi' ? 'दस्तावेज़ सुरक्षित जोड़ दिया गया!' : 'Document attached successfully!', 'success');
    }, 1200);
  },

  renderDocuments() {
    const listEl = document.getElementById('docListContainer');
    if (!listEl) return;

    if (!State.documents || State.documents.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">No documents attached yet. Tap above to upload.</div>`;
      return;
    }

    listEl.innerHTML = State.documents.map((doc, idx) => `
      <div class="doc-item-card" onclick="DocumentsModule.openPreview('${doc.id}')" style="cursor: pointer;">
        <div class="doc-thumb">${doc.icon}</div>
        <div class="doc-info">
          <div class="doc-name">${escapeHtml(doc.title)}</div>
          <div class="doc-date-type">📅 ${escapeHtml(doc.date)} • <span class="doc-badge-pill ${doc.categoryClass}">${escapeHtml(doc.category)}</span></div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 4px; background: var(--bg-subtle); padding: 3px 6px; border-radius: 4px;">
            🔍 <strong>Findings:</strong> ${escapeHtml(doc.extractedData)}
          </div>
        </div>
        <div style="font-size: 1.2rem; color: var(--primary);">➔</div>
      </div>
    `).join('');
  },

  openPreview(docId) {
    const doc = State.documents.find(d => d.id === docId);
    if (!doc) return;

    const modal = document.getElementById('docPreviewModal');
    const titleEl = document.getElementById('docPreviewTitle');
    const metaEl = document.getElementById('docPreviewMeta');
    const bodyEl = document.getElementById('docPreviewBody');

    if (modal && titleEl && metaEl && bodyEl) {
      titleEl.innerText = doc.title;
      metaEl.innerText = `Category: ${doc.category} • Date: ${doc.date}`;
      bodyEl.innerHTML = `
        <div style="background: var(--bg-cream); border: 1.5px solid var(--border-card); border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 12px;">
          <div style="font-size: 3rem; margin-bottom: 8px;">${doc.icon}</div>
          <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${escapeHtml(doc.fileName)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Secure Patient Health Record • CareSetu Document Locker</div>
        </div>
        <div style="background: #FFFFFF; border: 1px solid var(--border-card); border-radius: 8px; padding: 12px;">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 4px;">Extracted Key Information for Doctor</div>
          <div style="font-size: 0.86rem; color: var(--text-primary); line-height: 1.4;">${escapeHtml(doc.extractedData)}</div>
        </div>
      `;
      modal.style.display = 'flex';
    }
  }
};
