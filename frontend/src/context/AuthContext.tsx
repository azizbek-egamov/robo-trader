import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, phone: string, pass: string, refCode?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('xf_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile/');
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('xf_access_token');
      localStorage.removeItem('xf_refresh_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (phone: string, pass: string) => {
    try {
      const cleanPhone = phone.trim().replace(/[^\d+]/g, '');
      const res = await api.post('/users/auth/login/', {
        phone: cleanPhone,
        password: pass,
      });
      const access = res.data.access;
      const refresh = res.data.refresh;
      localStorage.setItem('xf_access_token', access);
      localStorage.setItem('xf_refresh_token', refresh);
      setToken(access);
      setUser(res.data.user);
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Telefon raqami yoki parol noto‘g‘ri.";
      return { success: false, error: msg };
    }
  };

  const register = async (fullName: string, phone: string, pass: string, refCode?: string) => {
    try {
      const cleanPhone = phone.trim().replace(/[^\d+]/g, '');
      await api.post('/users/auth/register/', {
        full_name: fullName,
        phone: cleanPhone,
        password: pass,
        referral_code: refCode || undefined,
      });
      // Register bo'lgach darhol login qilish
      return await login(cleanPhone, pass);
    } catch (err: any) {
      const msg = err.response?.data?.phone?.[0] || err.response?.data?.detail || "Ro‘yxatdan o‘tishda xatolik yuz berdi.";
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('xf_access_token');
    localStorage.removeItem('xf_refresh_token');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

