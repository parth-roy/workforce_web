import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || null;
  });
  const [role, setRole] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('role');
    if (stored) return stored;
    try {
      const u = localStorage.getItem('user');
      const parsed = u ? JSON.parse(u) : null;
      return parsed?.role || null;
    } catch {
      return null;
    }
  }); // 'CUSTOMER' | 'WORKER'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState('CUSTOMER'); // Default to customer login

  const isWorker = role === 'WORKER' || user?.role === 'WORKER';

  useEffect(() => {
    if (user?.city && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('metromitra:city_change', {
        detail: typeof user.city === 'string'
          ? { name: user.city, slug: user.city.toLowerCase().replace(/\s+/g, '-') }
          : user.city
      }));
    }
  }, []);

  const login = (userData, jwtToken, userRole) => {
    setUser(userData);
    setToken(jwtToken);
    const resolvedRole = userRole || userData?.role || 'CUSTOMER';
    setRole(resolvedRole);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role', resolvedRole);

    if (userData?.city && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('metromitra:city_change', {
        detail: typeof userData.city === 'string'
          ? { name: userData.city, slug: userData.city.toLowerCase().replace(/\s+/g, '-') }
          : userData.city
      }));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('uc_cart');
    localStorage.removeItem('uc_orders');
    try {
      window.dispatchEvent(new Event('storage'));
    } catch(e) {}
  };

  const openAuthModal = (intent = 'CUSTOMER') => {
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user, token, role, isWorker, login, logout,
      isAuthModalOpen, openAuthModal, closeAuthModal, authIntent
    }}>
      {children}
    </AuthContext.Provider>
  );
};
