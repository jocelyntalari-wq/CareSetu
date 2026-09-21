/**
 * CareSetu API Service
 * Handles communication with the Python REST backend.
 */

const API = {
  baseUrl: '/api',

  async getHealth() {
    const res = await fetch(`${this.baseUrl}/health`);
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${this.baseUrl}/stats`);
    return res.json();
  },

  async getConsultations(params = {}) {
    const query = new URLSearchParams();
    if (params.specialty && params.specialty !== 'All') query.append('specialty', params.specialty);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const url = `${this.baseUrl}/consultations${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url);
    return res.json();
  },

  async getConsultation(idOrToken) {
    const res = await fetch(`${this.baseUrl}/consultations/${idOrToken}`);
    if (!res.ok) throw new Error('Consultation record not found');
    return res.json();
  },

  async createConsultation(payload) {
    const res = await fetch(`${this.baseUrl}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async updateVitals(consultationId, vitalsData) {
    const res = await fetch(`${this.baseUrl}/consultations/${consultationId}/vitals`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vitalsData)
    });
    return res.json();
  },

  async correctDraft(consultationId, correctionData) {
    const res = await fetch(`${this.baseUrl}/consultations/${consultationId}/correct`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(correctionData)
    });
    return res.json();
  },

  async approveConsultation(consultationId, approvalData) {
    const res = await fetch(`${this.baseUrl}/consultations/${consultationId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(approvalData)
    });
    return res.json();
  },

  async addDocument(consultationId, documentData) {
    const res = await fetch(`${this.baseUrl}/consultations/${consultationId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentData)
    });
    return res.json();
  }
};

window.API = API;
