'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export default function Providers({ children }) {
  const [user, setUser] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('hmsToken');
    const savedUser = localStorage.getItem('hmsUser');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('hmsToken');
        localStorage.removeItem('hmsUser');
      }
    }

    setSessionReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, sessionReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within the HMS providers.');
  }

  return context;
}
