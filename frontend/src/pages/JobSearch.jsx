import React, { useState, useEffect } from 'react';
import api from '../services/api';

export function JobSearch() {
  const [filters, setFilters] = useState({
    title: '',
    company: '',
    location: '',
    job_type: '',
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await api.searchJobs({ ...filters, skip: page * 50, limit: 50 });
      setJobs(data.items);
      setTotal(data.total);
    } catch (err) {
      alert('Error fetching jobs: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Search Jobs</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Job title"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Company"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-4 py-2 border rounded"
          />
          <select
            value={filters.job_type}
            onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
            className="px-4 py-2 border rounded"
          >
            <option value="">All types</option>
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <button
          onClick={() => { setPage(0); handleSearch(); }}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div>
        <p className="text-gray-600 mb-4">Found {total} jobs</p>

        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="font-bold text-lg">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location || 'Remote'}</p>
              <p className="text-xs bg-gray-100 inline-block px-2 py-1 rounded mt-2">
                {job.job_type}
              </p>
              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block mt-2"
              >
                View Job →
              </a>
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-8">No jobs found. Try searching!</p>
        )}

        {total > 50 && (
          <div className="flex gap-2 justify-center mt-6">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="py-2 px-4">Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * 50 >= total}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
