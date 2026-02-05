import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Nav, Footer } from './components/Layout';
import { JobSearch } from './pages/JobSearch';
import { AlertManager } from './pages/AlertManager';
import { ResumeMatch } from './pages/ResumeMatch';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { ThemeProvider } from './context/ThemeContext';
import api from './services/api';
import './index.css';

/**
 * Main App component
 * Handles page routing with React Router
 * Follows accessible, semantic HTML practices
 */
function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<JobSearch />} />
      <Route path="/search" element={<JobSearch />} />
      <Route path="/alerts" element={<AlertManager />} />
      <Route path="/resume" element={<ResumeMatch />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}

function AppLayout() {
  // Health check every 10 minutes to keep backend alive on free tier
  useEffect(() => {
    // Run health check immediately on mount
    api.healthCheck();

    // Set up interval for every 10 minutes (600000 ms)
    const interval = setInterval(api.healthCheck, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-slate-950 transition-colors duration-200">
      <Header />
      <Nav />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <div className="container-max py-8">
          <AppContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
