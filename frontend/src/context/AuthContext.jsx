import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// ============================
// AuthContext
// ============================
// Provides authentication state and functions (login, register, logout)
// to the entire app using React Context API.

const AuthContext = createContext(null);

// ============================
// AuthProvider Component
// ============================
// Wraps the app and makes auth-related data/functions available
// anywhere in the component tree via useAuth().
export const AuthProvider = ({ children }) => {
  // Store the logged-in user object
  const [user, setUser] = useState(null);

  // Track whether auth state is still being loaded (useful for preventing flicker)
  const [loading, setLoading] = useState(true);

  // On first load, check localStorage for saved user info
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser)); // restore user session
    setLoading(false);
  }, []);

  // ----------------------------
  // Login: authenticate user via API
  // ----------------------------
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Save token + user in localStorage for persistence
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Update React state
    setUser(data.user);
  };

  // ----------------------------
  // Register: create a new account via API
  // ----------------------------
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  // ----------------------------
  // Logout: clear localStorage + reset user state
  // ----------------------------
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Provide auth state and functions to the app
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================
// useAuth Hook
// ============================
// Custom hook to easily access auth state/functions anywhere in the app
export const useAuth = () => useContext(AuthContext);
