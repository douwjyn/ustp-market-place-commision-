import React, { useEffect } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState(new Set());
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();
  const {
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const fetchCartItems = async () => {
    const response = await fetch('http://localhost:8000/api/v1/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setCartItems(data);
    }
  }

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Check if all selected items are from the same store
  const checkSameStore = () => {
    if (selectedItems.size === 0) return false;
    
    const selectedItemsData = cartItems.filter(item => selectedItems.has(item.id));
    if (selectedItemsData.length === 0) return false;
    
    const firstStoreId = selectedItemsData[0].product.shop.id;
    return selectedItemsData.every(item => item.product.shop.id === firstStoreId);
  };

  // Handle individual item selection
  const handleItemSelect = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
    setErrorMessage(''); // Clear error when selection changes
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      // If all items are selected, deselect all
      setSelectedItems(new Set());
    } else {
      // Check if all items are from the same store
      const firstStoreId = cartItems[0].product.shop.id;
      const allSameStore = cartItems.every(item => item.product.shop.id === firstStoreId);
      
      if (allSameStore) {
        // Select all items if they're from the same store
        setSelectedItems(new Set(cartItems.map(item => item.id)));
      } else {
        setErrorMessage('Cannot select all items - they are from different stores');
      }
    }
  };

  // Calculate totals for selected items only
  const getSelectedItemsTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => {
        return total + (Number(item.price) * item.quantity);
      }, 0);
  };

  const getSelectedItemsCount = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((count, item) => count + item.quantity, 0);
  };

  const totalPrice = getSelectedItemsTotal();
  const totalSelectedItems = getSelectedItemsCount();
  const totalOrders = getCartItemsCount();

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000/storage/${imagePath}`;
  };

  const handleRemoveFromCart = async (cart_id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/cart/remove`, {
        method: 'POST',
        body: JSON.stringify({ cart_id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== cart_id)
        );
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(cart_id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleIncrementQuantity = async (cart_id, quantity, stock) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/cart/increment`, {
        method: 'POST',
        body: JSON.stringify({ cart_id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        setCartItems([]);
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const handleDecrementQuantity = async (cart_id, quantity) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/cart/decrement`, {
        method: 'POST',
        body: JSON.stringify({ cart_id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        setCartItems([]);
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const handleCheckout = () => {
    if (!checkSameStore()) {
      setErrorMessage('Please select items from the same store to checkout');
      return;
    }

    const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
    sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedCartItems));
    navigate('/app/checkout');
  };

  const renderCartItems = () => {
    if (cartItems.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
          <ShoppingBag size={64} className='mb-4 text-gray-300' />
          <h3 className='text-xl font-medium mb-2'>Your cart is empty</h3>
          <p className='text-gray-400 mb-6'>Add some items to get started!</p>
          <button
            onClick={() => navigate('/app/dashboard')}
            className='flex items-center gap-2 px-6 py-3 bg-[#183B4E] text-white rounded-xl hover:bg-[#DDA853] hover:text-black transition-all duration-300'
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
        </div>
      );
    }

    return cartItems.map((item) => (
      <article
        key={item.id}
        className={`bg-white border rounded-xl p-4 md:p-6 mb-4 transition-all duration-200 ${
          selectedItems.has(item.id)
            ? 'border-[#183B4E] ring-2 ring-[#183B4E]/20 bg-blue-50/30'
            : 'border-gray-100 hover:border-gray-200'
        }`}
      >
        <div className='flex items-start gap-4'>
          <input
            type='checkbox'
            checked={selectedItems.has(item.id)}
            onChange={() => handleItemSelect(item.id)}
            className='mt-2 w-4 h-4 text-[#183B4E] rounded focus:ring-[#183B4E]'
          />
          <div className='w-20 h-20 md:w-24 md:h-24 bg-gray-50 border border-gray-100 rounded-xl flex-shrink-0 overflow-hidden'>
            <img
              src={getImageUrl(item.product.images[0].image)}
              alt={item.name}
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-grow min-w-0'>
            <div className='flex justify-between items-start'>
              <h3 className='text-gray-900 font-medium text-sm md:text-base line-clamp-2'>
                {item.name}
              </h3>
              <span className='text-xs bg-gray-100 px-2 py-1 rounded'>
                {item.product.shop.name}
              </span>
            </div>
            <div className='flex flex-col gap-1 mt-2'>
              {item.selected_size && (
                <span className='text-gray-500 text-xs'>
                  Size: {item.selected_size}
                </span>
              )}
              {item.product.variation && (
                <span className='text-gray-500 text-xs'>
                  Variation: {item.product.variation}
                </span>
              )}
              {item.product.color && (
                <span className='text-gray-500 text-xs'>
                  Color: {item.product.color}
                </span>
              )}
            </div>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-3'>
              <div className='text-[#183B4E] font-bold text-lg'>
                ₱{(item.price / item.quantity).toFixed(2)}
              </div>
              <div className='flex items-center justify-between md:justify-end gap-4'>
                <div className='flex flex-col sm:flex-row items-center gap-3'>
                  <button
                    onClick={() =>
                      handleDecrementQuantity(item.id, item.quantity)
                    }
                    className='w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
                  >
                    <Minus size={16} />
                  </button>
                  <span className='w-12 text-center font-medium text-gray-900'>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleIncrementQuantity(item.id, item.quantity, item.product.stock)
                    }
                    className='w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className='flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors'
                >
                  <Trash2 size={16} />
                  <span className='text-sm'>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    ));
  };

  const isSameStore = checkSameStore();
  const checkoutDisabled = selectedItems.size === 0 || !isSameStore;

  return (
    <main className='flex flex-col min-h-screen w-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] font-sans'>
      <section className='flex-grow p-4 md:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto'>
          <header className='mb-6 md:mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <button
                onClick={() => navigate('/app/dashboard')}
                className='flex items-center gap-2 text-[#183B4E] hover:text-[#DDA853] transition-colors'
              >
                <ArrowLeft size={20} />
                <span className='text-sm font-medium'>Continue Shopping</span>
              </button>
            </div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              Shopping Cart
            </h1>
            <p className='text-gray-600 mt-1'>
              {totalOrders} {totalOrders === 1 ? 'item' : 'items'} in your cart
              {selectedItems.size > 0 && (
                <span className='text-[#183B4E] font-medium'>
                  {' • '}{selectedItems.size} selected
                </span>
              )}
            </p>
          </header>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
            <div className='lg:col-span-2'>
              <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <label className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      checked={cartItems.length > 0 && selectedItems.size === cartItems.length}
                      onChange={handleSelectAll}
                      className='w-4 h-4 text-[#183B4E] rounded focus:ring-[#183B4E]'
                    />
                    <span className='text-gray-900 font-medium'>
                      Select All Items
                    </span>
                  </label>
                  {cartItems.length > 0 && (
                    <span className='text-sm text-gray-500'>
                      {selectedItems.size} of {cartItems.length}{' '}
                      {cartItems.length === 1 ? 'item' : 'items'} selected
                    </span>
                  )}
                </div>

                {errorMessage && (
                  <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm'>
                    {errorMessage}
                  </div>
                )}

                <div className='space-y-4'>{renderCartItems()}</div>
              </div>
            </div>

            <aside className='lg:col-span-1'>
              <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>
                  Order Summary
                </h2>

                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>
                      Selected Items ({totalSelectedItems})
                    </span>
                    <span className='text-gray-900 font-medium'>
                      ₱{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Shipping</span>
                    <span className='text-green-600 font-medium'>₱150</span>
                  </div>
                  <div className='border-t border-gray-200 pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-bold text-gray-900'>
                        Total
                      </span>
                      <span className='text-xl font-bold text-[#183B4E]'>
                        ₱{(totalPrice + 150).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {!isSameStore && selectedItems.size > 0 && (
                  <div className='mb-4 text-sm text-red-500'>
                    Please select items from the same store to checkout
                  </div>
                )}

                <button
                  className='w-full flex items-center justify-center gap-2 py-3 bg-[#183B4E] text-white font-semibold rounded-xl hover:bg-[#DDA853] hover:text-black transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'
                  onClick={handleCheckout}
                  disabled={checkoutDisabled}
                >
                  <CreditCard size={20} />
                  Proceed to Checkout ({selectedItems.size} items)
                </button>

                {selectedItems.size === 0 && cartItems.length > 0 && (
                  <p className='text-center text-sm text-gray-500 mt-2'>
                    Please select items to checkout
                  </p>
                )}

                <div className='mt-4 text-center'>
                  <p className='text-xs text-gray-500'>
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}