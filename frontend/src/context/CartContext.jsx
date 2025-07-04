import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
      };

    case 'ADD_TO_CART':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.cartItemId !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      const { cartItemId, newQuantity } = action.payload;

      if (newQuantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':



      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] });

  const getCartStorageKey = () => 'cart_items';

  useEffect(() => {
    const loadCart = async () => {
      const token = sessionStorage.getItem('access_token');
      if (token) {
        try {
          const res = await fetch('http://localhost:8000/api/v1/cart', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error('Failed to fetch backend cart');
          const items = await res.json();

          const formatted = items.map((item) => ({
            cartItemId: `${item.id}_${Date.now()}`,
            id: item.product_id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images || '/src/assets/placeholder.jpg',
            quantity: item.quantity,
            addedAt: item.created_at,
            selectedSize: '', // optional if needed
            variation: item.product.variation || '',
            color: item.product.color || '',
            stock: item.product.stock || 0,
          }));

          dispatch({ type: 'SET_CART', payload: formatted });
          return;
        } catch (error) {
          console.error('Backend cart load error:', error);
        }
      }

      // fallback to localStorage
      let cartItems = [];
      try {
        const stored = localStorage.getItem(getCartStorageKey());
        cartItems = stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Local cart load error:', error);
      }

      dispatch({ type: 'SET_CART', payload: cartItems });
    };

    loadCart();
  }, []);


  const addToCart = async (product_id, selectedSize = '', quantity = 1) => {
    alert(`${product_id}, ${selectedSize}, ${quantity} here`);
    // const cartItemId = `${product.id || product.product_id}_${selectedSize || 'default'}_${Date.now()}`;

    // const newItem = {
    //   cartItemId,
    //   id: product.id || product.product_id,
    //   name: product.name,
    //   price: product.price,
    //   image:
    //     Array.isArray(product.image_urls) && product.image_urls.length > 0
    //       ? product.image_urls[0]
    //       : Array.isArray(product.images) && product.images.length > 0
    //         ? product.images[0]
    //         : product.image || '/src/assets/placeholder.jpg',
    //   selectedSize: selectedSize || '',
    //   quantity,
    //   variation: product.variation || '',
    //   color: product.color || '',
    //   stock: product.stock || 0,
    //   addedAt: new Date().toISOString(),
    // };

    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const response = await fetch('http://localhost:8000/api/v1/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product_id,
            quantity: quantity,
            selected_size: selectedSize,
          }),
        });

        if (!response.ok) throw new Error('Failed to add item to cart');

        const result = await response.json();
        console.log('Item added to backend cart:', result);
      } catch (error) {
        console.error('Error syncing cart with backend:', error);
      }
    }

    // dispatch({
    //   type: 'ADD_TO_CART',
    //   payload: newItem,
    // });
  };

  const removeFromCart = (cartItemId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: cartItemId,
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { cartItemId, newQuantity },
    });
  };

  const clearCart = async () => {
    const response = await fetch('http://localhost:8000/api/v1/cart/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      alert('Failed to clear cart on backend');
      return;
    }

    dispatch({ type: 'CLEAR_CART' });
  };

    const getCartTotal = () => {
      return cartState.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    };

    const getCartItemsCount = () => {
      return cartState.items.reduce((count, item) => count + item.quantity, 0);
    };

    const getCartItem = (productId, selectedSize = '') => {
      return cartState.items.find(
        (item) => item.id === productId && item.selectedSize === selectedSize
      );
    };

    useEffect(() => {
      try {
        localStorage.setItem(
          getCartStorageKey(),
          JSON.stringify(cartState.items)
        );
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }, [cartState.items]);

    const value = {
      cartItems: cartState.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      getCartItem,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
  };

  export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  };
