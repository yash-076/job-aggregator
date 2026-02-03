import React, { useState } from 'react';
import api from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';

export function ResumeMatch() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);
  const [totalScored, setTotalScored] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      setFile(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await api.matchResume(file, 20);
      setMatches(data.top_matches || []);
      setTotalScored(data.total_jobs_scored || 0);
    } catch (err) {
      setError(err.message || 'Failed to upload and analyze resume. Please try again.');
      setMatches([]);
      setTotalScored(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type.includes('pdf')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please drop a PDF file');
      }
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setMatches([]);
    setTotalScored(0);
    setError('');
  };

  // Helper function to get match score color
  const getScoreColor = (score) => {
    if (score >= 25) return 'text-green-600';
    if (score >= 20) return 'text-blue-600';
    if (score >= 15) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 25) return 'bg-green-50 border-green-100';
    if (score >= 20) return 'bg-blue-50 border-blue-100';
    if (score >= 15) return 'bg-yellow-50 border-yellow-100';
    return 'bg-gray-50 border-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card title="Upload Your Resume">
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError('')}
            dismissible
          />
        )}

        <div className="space-y-4 mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your resume in PDF format to match it against our job listings and see how well you fit each position.
          </p>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-500'
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="resume-input"
              disabled={loading}
            />
            <label
              htmlFor="resume-input"
              className="block cursor-pointer"
            >
              <div className="text-4xl mb-3">📄</div>
              <p className="font-medium text-gray-900 mb-1 dark:text-gray-600">
                {file ? 'Resume selected' : 'Drag and drop your PDF here'}
              </p>
              <p className="text-sm text-gray-600">
                {file ? file.name : 'or click to browse'}
              </p>
            </label>
          </div>

          {/* File Info */}
          {file && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
              >
                Change
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleUpload}
              disabled={loading || !file}
              fullWidth
            >
              {loading ? 'Analyzing Resume...' : 'Find Matches'}
            </Button>
            {file && (
              <Button
                onClick={handleReset}
                variant="secondary"
                disabled={loading}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {totalScored > 0 && (
        <>
          {/* Summary Card */}
          <Card
            title="Analysis Results"
            className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-indigo-50 dark:to-slate-800 border-blue-200 dark:border-blue-900"
          >
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="text-center sm:text-left">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalScored}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Jobs Analyzed</p>
              </div>
              <div className="border-l border-blue-200 dark:border-blue-800" />
              <div className="text-center sm:text-left">
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">{matches.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Matching Jobs</p>
              </div>
            </div>
          </Card>

          {/* Top Matches */}
          {matches.length > 0 && (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-600">Top Matches</h2>
                <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                  Jobs ranked by how well your resume matches the requirements
                </p>
              </div>

              <div className="space-y-3">
                {matches.map((match, idx) => (
                  <Card key={match.job.id} hoverable className="group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        {/* Rank */}
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">
                          #{idx + 1} Match
                        </p>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {match.job.title}
                        </h3>

                        {/* Company */}
                        <p className="text-base text-gray-600 dark:text-gray-400 mt-1">{match.job.company}</p>

                        {/* Location */}
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          📍 {match.job.location || 'Remote'}
                        </p>

                        {/* CTA */}
                        <a
                          href={match.job.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-3 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                        >
                          View Job →
                        </a>
                      </div>

                      {/* Match Score */}
                      <div
                        className={`flex-shrink-0 rounded-lg p-4 border text-center ${getScoreBgColor(
                          match.match_score
                        )}`}
                      >
                        <p className={`text-3xl font-bold ${getScoreColor(match.match_score)}`}>
                          {Math.round(match.match_score)}
                        </p>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">Match</p>

                        {/* Score Indicator */}
                        <div className="mt-2 w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              match.match_score >= 25
                                ? 'bg-green-500'
                                : match.match_score >= 20
                                ? 'bg-blue-500'
                                : match.match_score >= 15
                                ? 'bg-yellow-500'
                                : 'bg-gray-400'
                            }`}
                            style={{
                              width: `${Math.min(match.match_score*2, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Matches State */}
          {matches.length === 0 && !loading && (
            <EmptyState
              title="No strong matches found"
              description="Try uploading a different resume or expanding your job search criteria"
              icon="🔍"
              action={
                <Button variant="secondary" onClick={handleReset}>
                  Upload Different Resume
                </Button>
              }
            />
          )}
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-12">
          <LoadingSpinner message="Analyzing your resume and scanning jobs..." />
        </div>
      )}

      {/* Initial State */}
      {!loading && totalScored === 0 && !error && (
        <EmptyState
          title="Ready to find your perfect job match?"
          description="Upload your resume above and we'll analyze it against our entire job database to find the best opportunities for you."
          icon="🚀"
        />
      )}
    </div>
  );
}
