import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
const AuthContext = createContext();

// Mock credential for demo
const MOCK_USER = {
  username: 'admin',
  password: 'password123', // demo only
  displayName: 'Administrator'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (username, password) => {
    
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to consume auth
export function useAuth() {
  return useContext(AuthContext);
}
