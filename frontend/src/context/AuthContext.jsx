import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (data) => {
    await api.post('/auth/register', data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
