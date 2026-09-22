import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserDoc, logoutUser } from '../services/authService';
import type { UsuarioDoc, UserRole } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  userData: UsuarioDoc | null;
  role: UserRole | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  role: null,
  loading: true,
  logout: async () => {},
  refreshUserData: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UsuarioDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = async (uid: string) => {
    try {
      const docData = await getUserDoc(uid);
      setUserData(docData);
    } catch {
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser.uid);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        role: userData?.role || null,
        loading,
        logout: handleLogout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
