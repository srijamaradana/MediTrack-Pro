import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Set auth token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Set user in localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Check user role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};

export const isPatient = () => hasRole('patient');
export const isDoctor = () => hasRole('doctor');
export const isAdmin = () => hasRole('admin');

// Get user initials
export const getUserInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Get user display name
export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  return user.name || user.email || 'User';
};

export default {
  isAuthenticated,
  getCurrentUser,
  getAuthToken,
  setAuthToken,
  setUser,
  clearAuthData,
  hasRole,
  isPatient,
  isDoctor,
  isAdmin,
  getUserInitials,
  getUserDisplayName,
};