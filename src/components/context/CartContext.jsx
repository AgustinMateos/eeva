"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [lastProductOpen, setLastProductOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedColor, selectedSize, images) => {
    if (!selectedSize || !selectedColor) {
      alert("Por favor selecciona color y talla");
      return;
    }

    const discountedPrice = product.discount
      ? product.price - product.price * (product.discount / 100)
      : product.price;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product._id &&
          item.color === selectedColor &&
          item.size === selectedSize
      );

      if (existingItemIndex >= 0) {
        return prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 } // Nuevo objeto
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: product._id,
            name: product.displayName,
            price: discountedPrice,
            originalPrice: product.price,
            discount: product.discount,
            color: selectedColor,
            size: selectedSize,
            image: product.image,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => {
      // Si es el último producto
      if (prevCart.length === 1) {
        setProductToRemove(index);
        setLastProductOpen(true);
        return prevCart;
      }

      return prevCart.filter((_, i) => i !== index);
    });
  };

  const updateQuantity = (index, newQuantity) => {
    setCart((prevCart) => {
      // Si es el último producto y la cantidad llegará a 0
      if (prevCart.length === 1 && newQuantity < 1) {
        setProductToRemove(index); // Guarda el índice del producto a eliminar
        setLastProductOpen(true); // Abre el modal de confirmación
        return prevCart; // No modifiques el carrito aún
      }

      if (newQuantity < 1) {
        return prevCart.filter((_, i) => i !== index);
      }

      const newCart = [...prevCart];
      newCart[index].quantity = newQuantity;
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const confirmRemoveLastItem = () => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== productToRemove));
    setLastProductOpen(false);
    setProductToRemove(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lastProductOpen,
        setLastProductOpen,
        productToRemove,
        setProductToRemove,
        confirmRemoveLastItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
