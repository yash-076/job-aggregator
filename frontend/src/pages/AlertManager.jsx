import React, { useState, useEffect } from 'react';
import api from '../services/api';

export function AlertManager() {
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    name: '',
    filters: { title: '', company: '', location: '', job_type: '' },
  });
  const [loading, setLoading] = useState(false);

  const loadAlerts = async () => {
    if (!email) return;
    try {
      const data = await api.getAlerts(email);
      setAlerts(data);
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [email]);

  const handleCreateAlert = async () => {
    if (!email || !newAlert.name) {
      alert('Email and alert name required');
      return;
    }

    setLoading(true);
    try {
      await api.createAlert({
        email,
        name: newAlert.name,
        filters: newAlert.filters,
      });
      setNewAlert({ name: '', filters: { title: '', company: '', location: '', job_type: '' } });
      localStorage.setItem('userEmail', email);
      loadAlerts();
    } catch (err) {
      alert('Error creating alert: ' + err.message);
    }
    setLoading(false);
  };

  const handleDeleteAlert = async (id) => {
    try {
      await api.deleteAlert(id);
      loadAlerts();
    } catch (err) {
      alert('Error deleting alert: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Email</h2>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
        <p className="text-sm text-gray-500 mt-2">Your alerts will be sent to this email</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Create New Alert</h2>
        
        <input
          type="text"
          placeholder="Alert name (e.g. Senior Engineer)"
          value={newAlert.name}
          onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
          className="px-4 py-2 border rounded w-full mb-4"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title keyword"
            value={newAlert.filters.title}
            onChange={(e) => setNewAlert({
              ...newAlert,
              filters: { ...newAlert.filters, title: e.target.value }
            })}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Company"
            value={newAlert.filters.company}
            onChange={(e) => setNewAlert({
              ...newAlert,
              filters: { ...newAlert.filters, company: e.target.value }
            })}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={newAlert.filters.location}
            onChange={(e) => setNewAlert({
              ...newAlert,
              filters: { ...newAlert.filters, location: e.target.value }
            })}
            className="px-4 py-2 border rounded"
          />
          <select
            value={newAlert.filters.job_type}
            onChange={(e) => setNewAlert({
              ...newAlert,
              filters: { ...newAlert.filters, job_type: e.target.value }
            })}
            className="px-4 py-2 border rounded"
          >
            <option value="">All types</option>
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <button
          onClick={handleCreateAlert}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Alerts</h2>
        
        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts yet</p>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="border p-4 rounded flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{alert.name}</h3>
                  <p className="text-sm text-gray-600">
                    Filters: {JSON.stringify(alert.filters).substring(0, 60)}...
                  </p>
                  <p className={`text-xs mt-1 ${alert.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {alert.is_active ? '✓ Active' : '✗ Inactive'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
