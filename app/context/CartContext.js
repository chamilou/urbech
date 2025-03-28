"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext"; // Ensure we track logged-in users

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUser();
  const [cart, setCart] = useState([]);

  // Load user-specific cart on login
  useEffect(() => {
    if (user) {
      const storedCart =
        JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
      setCart(storedCart);
    } else {
      setCart([]); // If no user, clear the cart
    }
  }, [user]);

  // Save user-specific cart on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (recipe) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === recipe.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === recipe.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...recipe, quantity: 1 }];
    });
  };
  const clearCart = () => {
    setCart([]);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCost,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
