import React, { createContext, useContext, useState, useEffect } from 'react';

const UCCartContext = createContext();

export function UCCartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('uc_cart');
        if (saved) return JSON.parse(saved);
      } catch(e) {}
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('uc_orders');
        if (saved) return JSON.parse(saved);
      } catch(e) {}
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('uc_cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('uc_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageChange = () => {
      try {
        const savedCart = window.localStorage.getItem('uc_cart');
        const savedOrders = window.localStorage.getItem('uc_orders');
        setCart(savedCart ? JSON.parse(savedCart) : []);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
      } catch(e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addOrder = (order) => {
    setOrders((prev) => [{ ...order, id: Date.now().toString(), date: new Date().toISOString() }, ...prev]);
  };

  const addToCart = (item, variant = null) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.variant?.id === variant?.id
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        };
        return newCart;
      }

      return [...prev, { ...item, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId, variantId = null) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.id === itemId && cartItem.variant?.id === variantId
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        if (newCart[existingItemIndex].quantity > 1) {
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity - 1
          };
          return newCart;
        } else {
          newCart.splice(existingItemIndex, 1);
          return newCart;
        }
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('uc_cart');
    }
  };

  const clearOrders = () => {
    setOrders([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('uc_orders');
    }
  };

  const clearAllData = () => {
    setCart([]);
    setOrders([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('uc_cart');
      window.localStorage.removeItem('uc_orders');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.variant ? item.variant.price : parseInt((item.price || '0').replace(/[^0-9]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <UCCartContext.Provider value={{ 
      cart, 
      orders, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      clearOrders, 
      clearAllData, 
      getTotalPrice, 
      addOrder, 
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </UCCartContext.Provider>
  );
}

export const useUCCart = () => useContext(UCCartContext);
