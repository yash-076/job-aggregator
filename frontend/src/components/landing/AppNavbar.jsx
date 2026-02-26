import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const appTabs = [
  { label: 'Search Jobs', icon: Search, path: '/search' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Resume Match', icon: FileText, path: '/resume' },
];

export function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = (() => {
    const name = user?.full_name || user?.email || '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  })();

  const userInitial = (user?.full_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060918]/70 backdrop-blur-xl border-b border-landing-border'
          : 'bg-[#060918]/80 backdrop-blur-md border-b border-landing-border/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <img src="/logoHead.png" alt="RoleSync" className="w-40 rounded-lg object-contain" />
          </button>

          {/* Desktop App Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0d1225] border border-landing-border rounded-xl p-1">
            {appTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a2344]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right side - User */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-400">{userInitial}</span>
              </div>
              <span className="text-sm text-gray-300 max-w-[120px] truncate">{displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-400 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 border-t border-landing-border mt-2 pt-4 animate-fade-in">
            {/* User info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-landing-border">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <span className="text-base font-semibold text-blue-400">{userInitial}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{displayName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* App tabs */}
            <nav className="flex flex-col gap-1">
              {appTabs.map((tab) => {
                const Icon = tab.icon;
                const active = isActive(tab.path);
                return (
                  <button
                    key={tab.path}
                    onClick={() => { setMobileOpen(false); navigate(tab.path); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-[#0d1225]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Sign out */}
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="flex items-center gap-3 px-4 py-3 mt-4 pt-4 border-t border-landing-border text-sm text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
