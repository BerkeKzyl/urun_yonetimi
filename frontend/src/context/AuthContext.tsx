import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      firstName
      lastName
      isStaff
    }
  }
`;

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
}

interface MeQueryData {
  me: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const { data, loading, error } = useQuery<MeQueryData>(ME_QUERY, {
    skip: !token,
    errorPolicy: 'all'
  });

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    } else if (error && token) {
      console.error('Auth error:', error);
      logout();
    }
  }, [data, error, token]);

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading: loading && !!token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
