import React, { createContext, useContext, useState, useCallback } from 'react';
import { Gerente } from '@/types/manager';

interface Restaurant {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  restaurant: Restaurant | null;
  manager: Gerente | null;
  isRestaurantAuthenticated: boolean;
  isManagerAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  loginRestaurant: (email: string, password: string) => Promise<boolean>;
  loginManager: (managerId: string, password: string) => boolean;
  logoutRestaurant: () => void;
  logoutManager: () => void;
  logout: () => void;
}

// Mock restaurant data
const mockRestaurant: Restaurant = {
  id: 'rest-1',
  name: 'Restaurante Sabor & Arte',
  email: 'admin@restaurante.com',
};

// Mock managers data
export const mockManagers: Gerente[] = [
  {
    id: 'manager-1',
    nome: 'Carlos Oliveira',
    tipo: 'GERENTE',
    senha: '1234',
    ativo: true,
    restaurante_ref: 'rest-1',
    data_criacao: new Date('2023-01-15'),
    data_ultimo_acesso: new Date(),
  },
  {
    id: 'manager-2',
    nome: 'Ana Santos',
    tipo: 'AUXILIAR',
    senha: '1234',
    ativo: true,
    restaurante_ref: 'rest-1',
    data_criacao: new Date('2023-06-20'),
  },
  {
    id: 'manager-3',
    nome: 'Roberto Lima',
    tipo: 'AUXILIAR',
    senha: '1234',
    ativo: false,
    restaurante_ref: 'rest-1',
    data_criacao: new Date('2023-03-10'),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    restaurant: null,
    manager: null,
    isRestaurantAuthenticated: false,
    isManagerAuthenticated: false,
  });

  const loginRestaurant = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    if (email === 'admin@restaurante.com' && password === '1234') {
      setAuthState(prev => ({
        ...prev,
        restaurant: mockRestaurant,
        isRestaurantAuthenticated: true,
      }));
      return true;
    }
    return false;
  }, []);

  const loginManager = useCallback((managerId: string, password: string): boolean => {
    const manager = mockManagers.find(m => m.id === managerId && m.ativo);
    if (manager && manager.senha === password) {
      setAuthState(prev => ({
        ...prev,
        manager,
        isManagerAuthenticated: true,
      }));
      return true;
    }
    return false;
  }, []);

  const logoutRestaurant = useCallback(() => {
    setAuthState({
      restaurant: null,
      manager: null,
      isRestaurantAuthenticated: false,
      isManagerAuthenticated: false,
    });
  }, []);

  const logoutManager = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      manager: null,
      isManagerAuthenticated: false,
    }));
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      restaurant: null,
      manager: null,
      isRestaurantAuthenticated: false,
      isManagerAuthenticated: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginRestaurant,
        loginManager,
        logoutRestaurant,
        logoutManager,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
