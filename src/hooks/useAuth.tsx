import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { getUser, getToken, saveUser, removeAuth } from '../utils/localStorage';
import { mockLogin } from '../utils/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const user = getUser();
    const token = getToken();
    
    if (user && token) {
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  }, []);

  // Función de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await mockLogin(email, password);
      
      if (result) {
        const { user, token } = result;
        saveUser(user, token);
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Credenciales inválidas'
        }));
        
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al iniciar sesión'
      }));
      
      return false;
    }
  };

  // Función de logout
  const logout = () => {
    removeAuth();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};