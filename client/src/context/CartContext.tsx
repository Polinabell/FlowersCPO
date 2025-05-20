import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Flower } from '../types';

interface CartItem {
  flower: Flower;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (flower: Flower) => void;
  removeFromCart: (flowerId: number) => void;
  clearCart: () => void;
  updateQuantity: (flowerId: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (flower: Flower) => {
    setItems(prevItems => {

      const existingItem = prevItems.find(item => item.flower.id === flower.id);

      if (existingItem) {

        return prevItems.map(item => 
          item.flower.id === flower.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {

        return [...prevItems, { flower, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (flowerId: number) => {
    setItems(prevItems => prevItems.filter(item => item.flower.id !== flowerId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateQuantity = (flowerId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(flowerId);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.flower.id === flowerId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.flower.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
}; 