import React, { useState } from 'react';
import { Header, Nav, Footer } from './components/Layout';
import { JobSearch } from './pages/JobSearch';
import { AlertManager } from './pages/AlertManager';
import { ResumeMatch } from './pages/ResumeMatch';
import './index.css';

export default function App() {
  const [active, setActive] = useState('search');

  const renderPage = () => {
    switch (active) {
      case 'search':
        return <JobSearch />;
      case 'alerts':
        return <AlertManager />;
      case 'resume':
        return <ResumeMatch />;
      default:
        return <JobSearch />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Nav active={active} setActive={setActive} />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}
