import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, loginWithGoogle, logout } from '../services/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logoutUser: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login", error);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao deslogar", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
