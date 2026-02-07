const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Enhanced fetch with error handling, timeouts, and consistent error messages
 */
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || `Error: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

/**
 * Get authorization headers with bearer token
 */
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

const api = {
  // Authentication
  register: (data) =>
    fetchWithErrorHandling(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' field
    formData.append('password', password);
    
    return fetchWithErrorHandling(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
  },

  getCurrentUser: (token) =>
    fetchWithErrorHandling(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  // Jobs
  searchJobs: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithErrorHandling(`${API_BASE}/jobs?${query}`);
  },

  getJobDetail: (id) => fetchWithErrorHandling(`${API_BASE}/jobs/${id}`),

  // Alerts
  createAlert: (data) =>
    fetchWithErrorHandling(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),

  getAlerts: () => fetchWithErrorHandling(`${API_BASE}/alerts`, {
    headers: getAuthHeaders(),
  }),

  deleteAlert: (id) =>
    fetchWithErrorHandling(`${API_BASE}/alerts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  // Resume matching
  matchResume: (file, topN = 20) => {
    const formData = new FormData();
    formData.append('resume', file);
    return fetchWithErrorHandling(`${API_BASE}/match/resume?top_n=${topN}`, {
      method: 'POST',
      body: formData,
    });
  },
};

export default api;
