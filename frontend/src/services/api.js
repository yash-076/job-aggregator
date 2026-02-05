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

const api = {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getAlerts: (email) => fetchWithErrorHandling(`${API_BASE}/alerts?email=${email}`),

  deleteAlert: (id) =>
    fetchWithErrorHandling(`${API_BASE}/alerts/${id}`, { method: 'DELETE' }),

  // Resume matching
  matchResume: (file, topN = 20) => {
    const formData = new FormData();
    formData.append('resume', file);
    return fetchWithErrorHandling(`${API_BASE}/match/resume?top_n=${topN}`, {
      method: 'POST',
      body: formData,
    });
  },

  // Health check - keeps backend alive on free tier
  healthCheck: async () => {
    try {
      await fetch(`${API_BASE}/health`);
    } catch (error) {
      // Silently fail - this is just a keep-alive ping
      console.debug('Backend health check ping sent');
    }
  },
};

export default api;
