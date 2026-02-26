import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, RotateCcw, MapPin, Building2, Briefcase, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';

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
    setFilters({ title: '', company: '', location: '', job_type: '' });
    setJobs([]);
    setTotal(0);
    setPage(0);
    setError('');
    setHasSearched(false);
  };

  useEffect(() => {
    if (hasSearched) handleSearch();
  }, [page]);

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
      {/* Search Filters */}
      <div className="landing-card rounded-2xl p-6 sm:p-8 border border-landing-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Search Filters</h2>
            <p className="text-xs text-gray-500">Find your perfect job opportunity</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 text-xs">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
            <input value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} placeholder="e.g. Software Engineer" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
            <input value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })} placeholder="e.g. Google, Microsoft" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="e.g. San Francisco, Remote" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
            <select value={filters.job_type} onChange={(e) => setFilters({ ...filters, job_type: e.target.value })} className={inputClass + ' cursor-pointer'}>
              {jobTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPage(0); handleSearch(); }} disabled={loading} className="landing-btn-primary px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Search'}
          </button>
          <button onClick={handleReset} disabled={loading} className="landing-btn-secondary px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Found <span className="font-semibold text-white">{total}</span> {total === 1 ? 'job' : 'jobs'}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
            )}
          </div>

          {loading && (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Finding jobs...</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="landing-card rounded-xl p-5 border border-landing-border hover:border-blue-500/20 transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Briefcase className="w-3 h-3 mr-1" /> {job.job_type || 'full-time'}
                        </span>
                      </div>
                    </div>
                    <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="landing-btn-primary !px-4 !py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 shrink-0">
                      View Job <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="landing-card rounded-2xl p-12 border border-landing-border text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-sm text-gray-400 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={handleReset} className="landing-btn-secondary px-5 py-2.5 rounded-xl text-sm font-semibold">Clear Filters</button>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="landing-btn-secondary px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="landing-btn-secondary px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-30">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!hasSearched && !error && (
        <div className="landing-card rounded-2xl p-12 border border-landing-border text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Start searching for jobs</h3>
          <p className="text-sm text-gray-400">Enter your job preferences above and click Search to find opportunities</p>
        </div>
      )}
    </div>
  );
}
