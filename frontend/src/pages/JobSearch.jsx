import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';

export function JobSearch() {
  const [filters, setFilters] = useState({
    title: '',
    company: '',
    location: '',
    job_type: '',
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const jobsPerPage = 50;
  const totalPages = Math.ceil(total / jobsPerPage);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.searchJobs({
        ...filters,
        skip: page * jobsPerPage,
        limit: jobsPerPage,
      });
      setJobs(data.items || []);
      setTotal(data.total || 0);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to search jobs. Please try again.');
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      title: '',
      company: '',
      location: '',
      job_type: '',
    });
    setJobs([]);
    setTotal(0);
    setPage(0);
    setError('');
    setHasSearched(false);
  };

  useEffect(() => {
    if (hasSearched) {
      handleSearch();
    }
  }, [page]);

  const jobTypeOptions = [
    { value: '', label: 'All types' },
    { value: 'internship', label: 'Internship' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
  ];

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card title="Search Filters">
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError('')}
            dismissible
          />
        )}

        <div className="space-y-4 mt-4">
          {/* Grid Layout - responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              placeholder="e.g. Software Engineer, Designer"
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
            />
            <Input
              label="Company"
              placeholder="e.g. Google, Microsoft"
              value={filters.company}
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
            />
            <Input
              label="Location"
              placeholder="e.g. San Francisco, Remote"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <Select
              label="Job Type"
              value={filters.job_type}
              onChange={(e) =>
                setFilters({ ...filters, job_type: e.target.value })
              }
              options={jobTypeOptions}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => {
                setPage(0);
                handleSearch();
              }}
              disabled={loading}
              size="md"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              disabled={loading}
              size="md"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {hasSearched && (
        <>
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold text-gray-900">{total}</span> {total === 1 ? 'job' : 'jobs'}
              </p>
            </div>
            {totalPages > 1 && (
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{page + 1}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
              </p>
            )}
          </div>

          {/* Jobs List */}
          {loading && (
            <div className="py-12">
              <LoadingSpinner message="Finding jobs..." />
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map(job => (
                <Card key={job.id} hoverable className="group">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {job.title}
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 mt-1">{job.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        📍 {job.location || 'Remote'}
                      </p>

                      {/* Job Type Badge */}
                      <div className="mt-3 flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {job.job_type || 'full-time'}
                        </span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex-shrink-0">
                      <a
                        href={job.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                      >
                        View Job →
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your filters or search terms"
              icon="🔍"
              action={
                <Button variant="secondary" onClick={handleReset}>
                  Clear Filters
                </Button>
              }
            />
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                variant="secondary"
              >
                ← Previous
              </Button>

              <div className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </div>

              <Button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
                variant="secondary"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!hasSearched && !error && (
        <EmptyState
          title="Start searching for jobs"
          description="Enter your job preferences above and click Search to find opportunities"
          icon="🚀"
        />
      )}
    </div>
  );
}
