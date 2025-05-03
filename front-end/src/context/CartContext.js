import React, { useState, useEffect, createContext } from "react";

export const CartContext = createContext();

// Crea el proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const findItem = (cartItems, id) => {
    return cartItems.find((item) => item.id === id);
  };

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = findItem(prevItems, product.id);
      if (existingItem) {
        // Si el producto ya existe, actualiza la cantidad sumando la nueva cantidad.
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        // Si el producto no existe, agrégalo al carrito con la cantidad especificada
        return [...prevItems, { ...product, quantity: product.quantity }];
      }
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId, quantityToRemove = 0) => {
    setCartItems((prevItems) => {
      const existingItem = findItem(prevItems, productId);
      if (!existingItem) return prevItems;

      if (quantityToRemove > 0) {
        // Disminuir cantidad
        if (existingItem.quantity > quantityToRemove) {
          return prevItems.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - quantityToRemove }
              : item
          );
        } else {
          // Eliminar el artículo si la cantidad es igual o menor a quantityToRemove
          return prevItems.filter((item) => item.id !== productId);
        }
      } else {
        // Remover item completamente
        return prevItems.filter((item) => item.id !== productId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
