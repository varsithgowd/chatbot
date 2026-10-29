import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, adminLogout, getAdminMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('supportsense_token');
    } catch {
      return null;
    }
  });
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          // Strictly verify the token with the backend API before granting admin status
          const data = await getAdminMe();
          if (data?.user && data.user.role === 'admin') {
            setUser(data.user);
            setIsVerifiedAdmin(true);
            try {
              localStorage.setItem('supportsense_user', JSON.stringify(data.user));
            } catch {
              // ignore
            }
          } else {
            await logout();
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          await logout();
        }
      } else {
        setUser(null);
        setIsVerifiedAdmin(false);
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await adminLogin({ email, password });
    if (data.token && data.user && data.user.role === 'admin') {
      setToken(data.token);
      setUser(data.user);
      setIsVerifiedAdmin(true);
      try {
        localStorage.setItem('supportsense_token', data.token);
        localStorage.setItem('supportsense_user', JSON.stringify(data.user));
      } catch {
        // ignore
      }
      return data.user;
    }
    throw new Error('Authentication failed: Administrator role required.');
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      setIsVerifiedAdmin(false);
      try {
        localStorage.removeItem('supportsense_token');
        localStorage.removeItem('supportsense_user');
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: isVerifiedAdmin,
        isVerifiedAdmin,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
