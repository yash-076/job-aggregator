import React, { useState } from 'react';
import api from '../services/api';
import { FileText, Upload, X, BarChart3, Sparkles, ExternalLink, Search } from 'lucide-react';

export function ResumeMatch() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);
  const [totalScored, setTotalScored] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleUpload = async () => {
    if (!file) { setError('Please select a PDF file'); return; }
    if (!file.type.includes('pdf')) { setError('Please upload a PDF file'); setFile(null); return; }
    setLoading(true);
    setError('');
    try {
      const data = await api.matchResume(file, 20);
      setMatches(data.top_matches || []);
      setTotalScored(data.total_jobs_scored || 0);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
      setMatches([]);
      setTotalScored(0);
      setHasSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type.includes('pdf')) { setFile(droppedFile); setError(''); }
      else setError('Please drop a PDF file');
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) { setFile(selectedFile); setError(''); }
  };

  const handleReset = () => {
    setFile(null);
    setMatches([]);
    setTotalScored(0);
    setError('');
    setHasSearched(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-blue-400';
    if (score >= 30) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getScoreBarColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-blue-500';
    if (score >= 30) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="landing-card rounded-2xl p-6 sm:p-8 border border-landing-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Upload Your Resume</h2>
            <p className="text-xs text-gray-500">PDF format — AI-powered matching</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-4">
          Upload your resume in PDF format to match it against our job listings and see how well you fit each position.
        </p>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/5'
              : 'border-landing-border bg-[#0d1225] hover:border-blue-500/30'
          }`}
        >
          <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" id="resume-input" disabled={loading} />
          <label htmlFor="resume-input" className="block cursor-pointer">
            <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="font-medium text-gray-300 mb-1">
              {file ? 'Resume selected' : 'Drag and drop your PDF here'}
            </p>
            <p className="text-sm text-gray-500">{file ? file.name : 'or click to browse'}</p>
          </label>
        </div>

        {/* File Info */}
        {file && (
          <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">Change</button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button onClick={handleUpload} disabled={loading || !file} className="landing-btn-primary flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Find Matches</>
            )}
          </button>
          {file && (
            <button onClick={handleReset} disabled={loading} className="landing-btn-secondary px-5 py-3.5 rounded-xl text-sm font-semibold">Clear</button>
          )}
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="landing-card rounded-xl p-6 border border-landing-border text-center">
              <p className="text-3xl font-bold text-blue-400">{totalScored}</p>
              <p className="text-xs text-gray-500 mt-1">Jobs Analyzed</p>
            </div>
            <div className="landing-card rounded-xl p-6 border border-landing-border text-center">
              <p className="text-3xl font-bold text-green-400">{matches.length}</p>
              <p className="text-xs text-gray-500 mt-1">Matching Jobs</p>
            </div>
          </div>

          {/* Top Matches */}
          {matches.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Top Matches</h2>
                  <p className="text-xs text-gray-500">Ranked by resume compatibility</p>
                </div>
              </div>

              <div className="space-y-3">
                {matches.map((match, idx) => (
                  <div key={match.job.id} className="landing-card rounded-xl p-5 border border-landing-border hover:border-blue-500/20 transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">#{idx + 1} Match</p>
                        <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">{match.job.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{match.job.company}</p>
                        <p className="text-xs text-gray-500 mt-1">📍 {match.job.location || 'Remote'}</p>
                        <a href={match.job.apply_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-3 gap-1.5 landing-btn-primary !px-4 !py-2 rounded-lg text-xs font-medium">
                          View Job <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Score */}
                      <div className="shrink-0 bg-[#0d1225] border border-landing-border rounded-xl p-4 text-center min-w-[80px]">
                        <p className={`text-2xl font-bold ${getScoreColor(match.match_score)}`}>{Math.round(match.match_score)}</p>
                        <p className="text-xs text-gray-500 mt-1">Score</p>
                        <div className="mt-2 w-full bg-[#1a2344] rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full transition-all ${getScoreBarColor(match.match_score)}`} style={{ width: `${Math.min(match.match_score, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matches.length === 0 && !loading && (
            <div className="landing-card rounded-2xl p-12 border border-landing-border text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No strong matches found</h3>
              <p className="text-sm text-gray-400 mb-6">Try uploading a different resume</p>
              <button onClick={handleReset} className="landing-btn-secondary px-5 py-2.5 rounded-xl text-sm font-semibold">Upload Different Resume</button>
            </div>
          )}
        </>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Analyzing your resume and scanning jobs...</p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !hasSearched && !error && (
        <div className="landing-card rounded-2xl p-12 border border-landing-border text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Ready to find your perfect job match?</h3>
          <p className="text-sm text-gray-400">Upload your resume above and we'll analyze it against our entire job database.</p>
        </div>
      )}
    </div>
  );
}
