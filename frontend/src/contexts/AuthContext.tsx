import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '@/services/auth.service';
import { User } from '@/types';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('@Cardapios:token');
    
    if (token) {
      AuthService.getProfile()
        .then(user => {
          setUser(user);
        })
        .catch(() => {
          signOut();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await AuthService.signIn({ email, password });
      localStorage.setItem('@Cardapios:token', response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      const response = await AuthService.signUp({ name, email, password });
      localStorage.setItem('@Cardapios:token', response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('@Cardapios:token');
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
