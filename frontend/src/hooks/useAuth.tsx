import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getStoredAuth, setStoredAuth, clearStoredAuth } from '../store/authStore';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const { token: savedToken, user: savedUser } = getStoredAuth();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      // Verify token freshness with /auth/me
      authService.getMe()
        .then((res) => {
          if (res.data?.data) {
            setUser(res.data.data);
            setStoredAuth(savedToken, res.data.data);
          }
        })
        .catch(() => {
          // If token expired, clear auth
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setStoredAuth(newToken, newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedFields };
      setUser(updated);
      if (token) setStoredAuth(token, updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
