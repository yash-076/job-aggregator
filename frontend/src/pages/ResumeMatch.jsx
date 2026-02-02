import React, { useState } from 'react';
import api from '../services/api';

export function ResumeMatch() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [totalScored, setTotalScored] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    setLoading(true);
    try {
      const data = await api.matchResume(file, 20);
      setMatches(data.top_matches);
      setTotalScored(data.total_jobs_scored);
    } catch (err) {
      alert('Error uploading resume: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
        <p className="text-gray-600 mb-4">Upload your PDF resume to match against our job listings</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="mx-auto"
          />
          {file && <p className="mt-2 text-green-600 font-semibold">{file.name}</p>}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Match Resume'}
        </button>
      </div>

      {totalScored > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-900">
            Analyzed <span className="font-bold">{totalScored}</span> jobs | Found <span className="font-bold">{matches.length}</span> matches
          </p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Top Matches</h3>
          {matches.map((match, idx) => (
            <div key={match.job.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">#{idx + 1}</p>
                  <h3 className="font-bold text-lg">{match.job.title}</h3>
                  <p className="text-gray-600">{match.job.company}</p>
                  <p className="text-sm text-gray-500">{match.job.location || 'Remote'}</p>
                  <a
                    href={match.job.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block mt-2"
                  >
                    View Job →
                  </a>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{match.match_score}</div>
                  <p className="text-xs text-gray-500">match score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {matches.length === 0 && totalScored > 0 && (
        <p className="text-center text-gray-500 py-8">No matches found. Try uploading a different resume.</p>
      )}
    </div>
  );
}
