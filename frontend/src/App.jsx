import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DarkLayout } from './components/landing/DarkLayout';
import { AppDarkLayout } from './components/landing/AppDarkLayout';
import LandingPage from './pages/LandingPage';
import { JobSearch } from './pages/JobSearch';
import { AlertManager } from './pages/AlertManager';
import { ResumeMatch } from './pages/ResumeMatch';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

/**
 * Main App component
 * - Landing page has its own standalone layout
 * - Public pages (signup, signin, about, etc.) use DarkLayout (LandingNavbar + LandingFooter)
 * - Protected pages (search, alerts, resume) use AppDarkLayout (AppNavbar + LandingFooter)
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page — standalone layout */}
            <Route path="/" element={<LandingPage />} />

            {/* Public pages — dark layout with landing navbar */}
            <Route path="/signup" element={<DarkLayout><SignUp /></DarkLayout>} />
            <Route path="/signin" element={<DarkLayout><SignIn /></DarkLayout>} />
            <Route path="/about" element={<DarkLayout><About /></DarkLayout>} />
            <Route path="/blog" element={<DarkLayout><Blog /></DarkLayout>} />
            <Route path="/contact" element={<DarkLayout><Contact /></DarkLayout>} />
            <Route path="/privacy" element={<DarkLayout><Privacy /></DarkLayout>} />
            <Route path="/terms" element={<DarkLayout><Terms /></DarkLayout>} />

            {/* Protected pages — app dark layout with authenticated navbar */}
            <Route path="/search" element={<ProtectedRoute><AppDarkLayout><JobSearch /></AppDarkLayout></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AppDarkLayout><AlertManager /></AppDarkLayout></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><AppDarkLayout><ResumeMatch /></AppDarkLayout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
