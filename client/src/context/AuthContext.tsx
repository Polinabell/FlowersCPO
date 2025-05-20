import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { authAPI } from '../api/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { user } = await authAPI.getProfile();
          setUser(user);
          setIsLoading(false);
        } catch (err) {
          console.error('Ошибка загрузки пользователя:', err);
          logout();
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: AuthResponse = await authAPI.login(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при входе');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await authAPI.register(data);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}; 