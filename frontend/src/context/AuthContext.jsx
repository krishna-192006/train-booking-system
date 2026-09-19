import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const data = response.data;

      const userData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role
      };

      setToken(data.token);
      setUser(userData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role = 'USER') => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/signup', { name, email, password, role });
      const data = response.data;

      const userData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role
      };

      setToken(data.token);
      setUser(userData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
