import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // 'CUSTOMER' | 'WORKER'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState('CUSTOMER'); // Default to customer login

  useEffect(() => {
    // Load from local storage on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    if (storedUser && storedToken && storedRole) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      setRole(storedRole);
      if (parsedUser?.city && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('metromitra:city_change', {
          detail: typeof parsedUser.city === 'string'
            ? { name: parsedUser.city, slug: parsedUser.city.toLowerCase().replace(/\s+/g, '-') }
            : parsedUser.city
        }));
      }
    }
  }, []);

  const login = (userData, jwtToken, userRole) => {
    setUser(userData);
    setToken(jwtToken);
    setRole(userRole);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role', userRole);

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
      user, token, role, login, logout,
      isAuthModalOpen, openAuthModal, closeAuthModal, authIntent
    }}>
      {children}
    </AuthContext.Provider>
  );
};
