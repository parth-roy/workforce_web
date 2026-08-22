import React, { createContext, useContext, useState } from 'react';

const UCCartContext = createContext();

export function UCCartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item, variant = null) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.variant?.id === variant?.id
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
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
          newCart[existingItemIndex].quantity -= 1;
          return newCart;
        } else {
          newCart.splice(existingItemIndex, 1);
          return newCart;
        }
      }
      return prev;
    });
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <UCCartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotalPrice }}>
      {children}
    </UCCartContext.Provider>
  );
}

export const useUCCart = () => useContext(UCCartContext);
