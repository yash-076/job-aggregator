import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

function parseJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const normalized = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

function clearStoredAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        clearStoredAuth();
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    const payload = parseJwtPayload(token);
    if (!payload?.exp) {
      logout();
      return;
    }

    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }

    const timeoutId = setTimeout(() => {
      logout();
    }, msUntilExpiry);

    return () => clearTimeout(timeoutId);
  }, [token]);

  const login = (accessToken, userData) => {
    if (isTokenExpired(accessToken)) {
      clearStoredAuth();
      setToken(null);
      setUser(null);
      return;
    }

    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !isTokenExpired(token),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
