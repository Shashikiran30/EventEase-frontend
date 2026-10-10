import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('eventease_token') || localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('eventease_token');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, user: userData } = res.data;
      if (token) {
        localStorage.setItem('eventease_token', token);
      }
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Invalid username or password';
      return { success: false, error: msg };
    }
  };

  const quickLogin = async (username) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password: 'password123' });
      const { token, user: userData } = res.data;
      if (token) {
        localStorage.setItem('eventease_token', token);
      }
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error('Quick login failed', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('eventease_token');
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, quickLogin, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
