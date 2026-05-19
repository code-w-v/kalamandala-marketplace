import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {

    const savedCart = localStorage.getItem('cart');

    return savedCart ? JSON.parse(savedCart) : [];

  });

  // SAVE TO LOCALSTORAGE
  useEffect(() => {

    localStorage.setItem('cart', JSON.stringify(cart));

  }, [cart]);

  // ADD TO CART
  const addToCart = (product) => {

    const existing = cart.find(item => item._id === product._id);

    if (existing) {

      const updatedCart = cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      );

      setCart(updatedCart);

    } else {

      setCart([
        ...cart,
        {
          ...product,
          qty: 1
        }
      ]);

    }

  };

  // REMOVE
  const removeFromCart = (id) => {

    setCart(cart.filter(item => item._id !== id));

  };

  // CLEAR
  const clearCart = () => {

    setCart([]);

  };

  // TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>

  );

};

export const useCart = () => useContext(CartContext);