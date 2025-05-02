import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product, Image } from '../types/product';

interface CartContextProps {
  cartItems: CartItem[];
  cartOpen: boolean;
  notification: {
    show: boolean;
    message: string;
  };
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          title: product.title,
          price: product.price,
          img: product.img[0],
          quantity
        }];
      }
    });
    
    showNotification(`${product.title} added to cart!`);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleCart = () => setCartOpen(prev => !prev);
  const closeCart = () => setCartOpen(false);
  const openCart = () => setCartOpen(true);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    showNotification('Cart has been cleared');
  };

  const showNotification = (message: string) => {
    setNotification({
      show: true,
      message,
    });
    
    setTimeout(() => {
      setNotification({
        show: false,
        message: '',
      });
    }, 3000);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartOpen,
      notification,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      closeCart,
      openCart,
      getCartTotal,
      getCartCount,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
