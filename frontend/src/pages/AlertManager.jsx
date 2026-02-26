import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
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

  // Load alerts when component mounts
  useEffect(() => {
    if (user?.email) {
      loadAlerts();
    }
  }, [user?.email]);

  const handleCreateAlert = async () => {
    setError('');
    setSuccess('');

    // Validation
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
      setNewAlert({
        name: '',
        filters: { title: '', company: '', location: '', job_type: '' },
      });
      setSuccess('Alert created successfully!');
      await loadAlerts();
      // Auto-dismiss success message
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

  return (
    <div className="space-y-6">
      {/* Global Messages */}
      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
          dismissible
        />
      )}
      {success && (
        <SuccessMessage
          message={success}
          onDismiss={() => setSuccess('')}
          dismissible
        />
      )}

      {/* Create Alert Section */}
      <Card title="Create New Alert" subtitle={`Alerts will be sent to ${user?.email}`}>
        <div className="space-y-4">
          <Input
            label="Alert Name"
            placeholder="e.g. Senior Engineer, Remote Design"
            value={newAlert.name}
            onChange={(e) =>
              setNewAlert({ ...newAlert, name: e.target.value })
            }
            required
          />

            {/* Filters Grid */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Filter by (optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Title Keyword"
                  placeholder="e.g. Engineer, Designer"
                  value={newAlert.filters.title}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      filters: { ...newAlert.filters, title: e.target.value },
                    })
                  }
                />
                <Input
                  label="Company"
                  placeholder="e.g. Google, Apple"
                  value={newAlert.filters.company}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      filters: { ...newAlert.filters, company: e.target.value },
                    })
                  }
                />
                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, Remote"
                  value={newAlert.filters.location}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      filters: { ...newAlert.filters, location: e.target.value },
                    })
                  }
                />
                <Select
                  label="Job Type"
                  value={newAlert.filters.job_type}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      filters: {
                        ...newAlert.filters,
                        job_type: e.target.value,
                      },
                    })
                  }
                  options={jobTypeOptions}
                />
              </div>
            </div>

            {/* Create Button */}
            <div className="pt-2">
              <Button
                onClick={handleCreateAlert}
                disabled={creatingAlert || !newAlert.name.trim()}
                fullWidth
              >
                {creatingAlert ? 'Creating Alert...' : 'Create Alert'}
              </Button>
            </div>
          </div>
        </Card>

      {/* Alerts List Section */}
      <Card title="Your Alerts">
        {loadingAlerts && (
          <div className="py-8">
            <LoadingSpinner message="Loading alerts..." />
          </div>
        )}

        {!loadingAlerts && alerts.length === 0 && (
          <EmptyState
            title="No alerts yet"
            description="Create your first alert to start receiving job notifications"
            icon="🔔"
          />
        )}

        {!loadingAlerts && alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-slate-600 transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{alert.name}</h3>
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          alert.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {alert.is_active ? '● Active' : '○ Inactive'}
                      </span>
                    </div>

                    {/* Filters Display */}
                    <div className="mt-2 space-y-1">
                      {alert.filters.title && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Title:</span> {alert.filters.title}
                        </p>
                      )}
                      {alert.filters.company && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Company:</span> {alert.filters.company}
                        </p>
                      )}
                      {alert.filters.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Location:</span> {alert.filters.location}
                        </p>
                      )}
                      {alert.filters.job_type && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Type:</span> {alert.filters.job_type}
                        </p>
                      )}
                      {!alert.filters.title &&
                        !alert.filters.company &&
                        !alert.filters.location &&
                        !alert.filters.job_type && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 italic">No filters applied</p>
                        )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  {deleteConfirm === alert.id ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDeleteAlert(alert.id)}
                        variant="danger"
                        size="sm"
                        disabled={deletingAlertId === alert.id}
                      >
                        {deletingAlertId === alert.id ? 'Deleting...' : 'Confirm'}
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirm(null)}
                        variant="secondary"
                        size="sm"
                        disabled={deletingAlertId === alert.id}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setDeleteConfirm(alert.id)}
                      variant="ghost"
                      size="sm"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
