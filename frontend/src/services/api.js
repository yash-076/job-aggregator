const API_BASE = '/api';

const api = {
  // Jobs
  searchJobs: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/jobs?${query}`).then(r => r.json());
  },
  getJobDetail: (id) => fetch(`${API_BASE}/jobs/${id}`).then(r => r.json()),

  // Alerts
  createAlert: (data) => fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  getAlerts: (email) => fetch(`${API_BASE}/alerts?email=${email}`).then(r => r.json()),
  deleteAlert: (id) => fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' }),

  // Resume matching
  matchResume: (file, topN = 20) => {
    const formData = new FormData();
    formData.append('resume', file);
    return fetch(`${API_BASE}/match/resume?top_n=${topN}`, {
      method: 'POST',
      body: formData,
    }).then(r => r.json());
  },
};

export default api;
