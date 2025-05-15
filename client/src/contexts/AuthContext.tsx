import  { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/User';

/** Contexto para manejar autenticación sin tokens */
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Inicializamos con valores por defecto que cumplen la interfaz
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
//Comprueba la autenticación del usuario y lo guarda en localStorage
  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };
  //Borra el localStorage lo que permite cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => useContext(AuthContext);