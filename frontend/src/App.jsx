import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Nav, Footer } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
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
 * Handles page routing with React Router
 * Follows accessible, semantic HTML practices
 */
function AppContent() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Protected routes - require authentication */}
      <Route path="/" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertManager /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumeMatch /></ProtectedRoute>} />
    </Routes>
  );
}

function AppLayout() {
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
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
