import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Plus, Trash2, X, AlertCircle, CheckCircle, BellRing } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AlertManager() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    name: '',
    filters: { title: '', company: '', location: '', job_type: '' },
  });
  const [creatingAlert, setCreatingAlert] = useState(false);
  const [deletingAlertId, setDeletingAlertId] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadAlerts = async () => {
    if (!user?.email) return;
    setLoadingAlerts(true);
    setError('');
    try {
      const data = await api.getAlerts();
      setAlerts(data || []);
    } catch (err) {
      setError('Failed to load alerts. Please try again.');
      setAlerts([]);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    if (user?.email) loadAlerts();
  }, [user?.email]);

  const handleCreateAlert = async () => {
    setError('');
    setSuccess('');
    if (!newAlert.name.trim()) {
      setError('Alert name is required');
      return;
    }
    setCreatingAlert(true);
    try {
      await api.createAlert({
        email: user.email,
        name: newAlert.name,
        filters: newAlert.filters,
      });
      setNewAlert({ name: '', filters: { title: '', company: '', location: '', job_type: '' } });
      setSuccess('Alert created successfully!');
      await loadAlerts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create alert. Please try again.');
    } finally {
      setCreatingAlert(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    setError('');
    setDeletingAlertId(id);
    try {
      await api.deleteAlert(id);
      setDeleteConfirm(null);
      setSuccess('Alert deleted successfully');
      await loadAlerts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete alert. Please try again.');
    } finally {
      setDeletingAlertId(null);
    }
  };

  const jobTypeOptions = [
    { value: '', label: 'All types' },
    { value: 'internship', label: 'Internship' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
  ];

  const inputClass =
    'w-full bg-[#0d1225] border border-landing-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200';

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400" /><p className="text-sm text-red-400">{error}</p></div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /><p className="text-sm text-green-400">{success}</p></div>
          <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-300"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Create Alert */}
      <div className="landing-card rounded-2xl p-6 sm:p-8 border border-landing-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Create New Alert</h2>
            <p className="text-xs text-gray-500">Alerts sent to {user?.email}</p>
          </div>
        </div>

        <div className="space-y-5 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Alert Name</label>
            <input value={newAlert.name} onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })} placeholder="e.g. Senior Engineer, Remote Design" className={inputClass} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-400 mb-3">Filter by (optional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Title Keyword</label>
                <input value={newAlert.filters.title} onChange={(e) => setNewAlert({ ...newAlert, filters: { ...newAlert.filters, title: e.target.value } })} placeholder="e.g. Engineer" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Company</label>
                <input value={newAlert.filters.company} onChange={(e) => setNewAlert({ ...newAlert, filters: { ...newAlert.filters, company: e.target.value } })} placeholder="e.g. Google" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Location</label>
                <input value={newAlert.filters.location} onChange={(e) => setNewAlert({ ...newAlert, filters: { ...newAlert.filters, location: e.target.value } })} placeholder="e.g. Remote" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Job Type</label>
                <select value={newAlert.filters.job_type} onChange={(e) => setNewAlert({ ...newAlert, filters: { ...newAlert.filters, job_type: e.target.value } })} className={inputClass + ' cursor-pointer'}>
                  {jobTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button onClick={handleCreateAlert} disabled={creatingAlert || !newAlert.name.trim()} className="landing-btn-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {creatingAlert ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
            ) : (
              <><Plus className="w-4 h-4" /> Create Alert</>
            )}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="landing-card rounded-2xl p-6 sm:p-8 border border-landing-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Your Alerts</h2>
        </div>

        {loadingAlerts && (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading alerts...</p>
          </div>
        )}

        {!loadingAlerts && alerts.length === 0 && (
          <div className="py-12 text-center">
            <BellRing className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No alerts yet</h3>
            <p className="text-sm text-gray-400">Create your first alert to start receiving job notifications</p>
          </div>
        )}

        {!loadingAlerts && alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-[#0d1225] border border-landing-border rounded-xl p-4 hover:border-blue-500/20 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{alert.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${
                        alert.is_active
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {alert.is_active ? '● Active' : '○ Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {alert.filters.title && <span className="text-xs px-2 py-1 rounded-lg bg-[#1a2344] text-gray-400">Title: {alert.filters.title}</span>}
                      {alert.filters.company && <span className="text-xs px-2 py-1 rounded-lg bg-[#1a2344] text-gray-400">Company: {alert.filters.company}</span>}
                      {alert.filters.location && <span className="text-xs px-2 py-1 rounded-lg bg-[#1a2344] text-gray-400">Location: {alert.filters.location}</span>}
                      {alert.filters.job_type && <span className="text-xs px-2 py-1 rounded-lg bg-[#1a2344] text-gray-400">Type: {alert.filters.job_type}</span>}
                      {!alert.filters.title && !alert.filters.company && !alert.filters.location && !alert.filters.job_type && (
                        <span className="text-xs text-gray-500 italic">No filters applied</span>
                      )}
                    </div>
                  </div>

                  {deleteConfirm === alert.id ? (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleDeleteAlert(alert.id)} disabled={deletingAlertId === alert.id} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50">
                        {deletingAlertId === alert.id ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} disabled={deletingAlertId === alert.id} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 border border-landing-border hover:border-gray-500 transition-all">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(alert.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
