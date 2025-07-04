import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useContext } from 'react'
import { UserContext } from '../context/UserProvider';

export default function Checkout() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const { user, token } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [debugInfo, setDebugInfo] = useState({}); // For debugging

  console.log(user)

  // Load selected cart items from sessionStorage or fetch all cart items
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const selectedItems = sessionStorage.getItem('selectedCartItems');
        if (selectedItems) {
          const parsedItems = JSON.parse(selectedItems);
          console.log('Loaded selected items from sessionStorage:', parsedItems);
          setCartItems(parsedItems);
        } else {
          // Fallback: fetch all cart items if no selection
          fetchAllCartItems();
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        fetchAllCartItems();
      }
    };

    const fetchAllCartItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched all cart items:', data);
          setCartItems(data);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    loadCartItems();
  }, []);

  const getDiscountedPrice = (item) => {
    const price = item.price;
    const discount = item.product?.discount || item.discount || 0;
    if (discount > 0) {
      return price * (1 - discount / 100);
    }
    return price;
  };
  useEffect(() => {
    const fillAddressFromUser = () => {
      console.log('jerehehr', user)
      setCustomerInfo({
        fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
      });
      setIsLoadingProfile(false);
    };

    if (user) fillAddressFromUser();
  }, []);

  // Calculate totals based on actual cart items
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + Number(item.price), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // const totalPrice = getCartTotal();
  const totalOrders = getCartItemsCount();
  const shippingFee = 150;
  const totalPrice = getCartTotal();
  const finalTotal = totalPrice;

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000/storage/${imagePath}`;
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Fix: Check for address input OR selectedAddressId
    if (!customerInfo.address.trim() && !selectedAddressId) {
      newErrors.address = 'Address is required';
    }

    if (!customerInfo.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Payment method validation
    if (!selectedPayment) {
      newErrors.payment = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePaymentChange = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    if (errors.payment) {
      setErrors((prev) => ({
        ...prev,
        payment: '',
      }));
    }
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ receipt: 'Please upload a valid image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ receipt: 'File size must be less than 5MB' });
        return;
      }

      setReceiptFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear errors
      if (errors.receipt) {
        setErrors((prev) => ({
          ...prev,
          receipt: '',
        }));
      }
    }
  };

  const handlePlaceOrder = async () => {
    console.log('🛒 Placing order with customer info:', customerInfo);
    console.log('🛒 Cart items for order:', cartItems);

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    if (cartItems.length === 0) {
      setErrors({ general: 'No items in cart to place order.' });
      return;
    }

    // If GCash is selected, show receipt modal
    if (selectedPayment === 'gcash') {
      setShowReceiptModal(true);
      return;
    }

    // For COD, proceed directly
    await submitOrder();
  };

  const submitOrder = async () => {
    setIsProcessing(true);

    try {
      // Prepare form data for file upload
      const formData = new FormData();

      // Add customer info
      formData.append('email', customerInfo.email);
      formData.append('address', customerInfo.address);
      formData.append('city', customerInfo.city);
      formData.append('phone', customerInfo.phone);
      formData.append('state', customerInfo.state || 'N/A');
      formData.append('payment_method', selectedPayment);

      // Add cart items
      cartItems.forEach((item, index) => {
        formData.append(`cart_items[${index}][product_id]`, item.product_id || item.product?.id || item.id);
        formData.append(`cart_items[${index}][quantity]`, item.quantity);
        formData.append(`cart_items[${index}][price]`, item.price);
      });

      // Add receipt file if GCash payment
      if (selectedPayment === 'gcash' && receiptFile) {
        formData.append('receipt', receiptFile);
      }

      console.log('📦 Submitting order with payment method:', selectedPayment);

      // Submit order to API
      const response = await axios.post(
        'http://localhost:8000/api/v1/products/products/placeorder',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        }
      );

      console.log('✅ Order placed successfully:', response);
      setOrderPlaced(true);
      setShowSuccessModal(true);
      setShowReceiptModal(false);

      // Clear selected items from sessionStorage
      sessionStorage.removeItem('selectedCartItems');

      // Clear cart
      clearCart();

      // Reset receipt state
      setReceiptFile(null);
      setReceiptPreview(null);
    } catch (error) {
      console.error('❌ Order failed:', error);
      console.error('❌ Order Error Response:', error.response?.data);

      // Laravel validation errors
      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        const newErrors = {};

        // If phone error exists, set it
        if (msg.phone && Array.isArray(msg.phone)) {
          newErrors.phone = msg.phone[0];
        }
        // Handle other possible field errors
        if (msg.email && Array.isArray(msg.email)) {
          newErrors.email = msg.email[0];
        }
        if (msg.address && Array.isArray(msg.address)) {
          newErrors.address = msg.address[0];
        }
        if (msg.city && Array.isArray(msg.city)) {
          newErrors.city = msg.city[0];
        }
        if (msg.state && Array.isArray(msg.state)) {
          newErrors.state = msg.state[0];
        }
        if (msg.receipt && Array.isArray(msg.receipt)) {
          newErrors.receipt = msg.receipt[0];
        }
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        } else {
          setErrors({ general: 'Failed to place order. Please try again.' });
        }
      } else {
        setErrors({ general: 'Failed to place order. Please try again.' });
      }
    } finally {
      setIsProcessing(false);
    }
  };


  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/app/dashboard');
  };

  const handleViewPurchaseHistory = () => {
    setShowSuccessModal(false);
    navigate('/app/profile/purchase-history'); // Adjust this route to your purchase history page
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setReceiptFile(null);
    setReceiptPreview(null);
    setErrors((prev) => ({
      ...prev,
      receipt: '',
    }));
  };

  const handleConfirmGCashPayment = () => {
    if (!receiptFile) {
      setErrors({ receipt: 'Please upload a receipt image' });
      return;
    }
    submitOrder();
  };



  // Receipt Upload Modal Component
  const ReceiptModal = () => {
    if (!showReceiptModal) return null;

    return (
      <div className="fixed inset-0 bg-white backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Upload GCash Receipt
              </h3>
              <button
                onClick={handleCloseReceiptModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Instructions */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Please upload a clear image of your GCash payment receipt for verification.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Total Amount: ₱{finalTotal.toFixed(2)}
              </p>
            </div>

            {/* Upload Area */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Image *
              </label>

              {!receiptPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload receipt image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => {
                      setReceiptFile(null);
                      setReceiptPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.receipt && (
                <p className="text-red-500 text-sm mt-1">{errors.receipt}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCloseReceiptModal}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGCashPayment}
                disabled={isProcessing || !receiptFile}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${isProcessing || !receiptFile
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Success Modal Component
  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
          <div className="p-6 text-center">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Success icon */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            {/* Success message */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Checked Out Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Please see purchase history to track your order.
            </p>

            {/* Order details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Order Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ₱{finalTotal.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totalOrders} item{totalOrders > 1 ? 's' : ''} • {selectedPayment === 'gcash' ? 'GCash' : 'Cash on Delivery'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewPurchaseHistory}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Purchase History
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Debug component to show debugging information (remove in production)
  const DebugPanel = () => {
    if (process.env.NODE_ENV === 'production') return null;

    return (
      <div className='bg-gray-100 p-4 rounded-lg mb-6 text-xs text-black'>
        <details >
          <summary className='cursor-pointer font-bold'>
            🐛 Debug Info (Click to expand)
          </summary>
          <pre className='mt-2 whitespace-pre-wrap '>
            {JSON.stringify(
              {
                debugInfo,
                customerInfo,
                selectedAddressId,
                selectedPayment,
                receiptFile: receiptFile?.name,
                userFromAuth: user,
                tokenExists: !!token,
                cartItemsCount: cartItems.length,
                cartItems: cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  product_id: item.product_id || item.product?.id
                }))
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    );
  };

  // Loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className='flex flex-col min-h-screen w-screen bg-[#FAEBD7] font-sans'>
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading your profile information...</p>
            <p className='text-xs text-gray-500 mt-2'>
              Fetching user data from server...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className='flex flex-col min-h-screen w-screen bg-[#FAEBD7] font-sans'>
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-6xl text-gray-300 mb-4'>🛒</div>
            <div className='text-xl text-gray-600 mb-4'>No items selected for checkout</div>
            <p className='text-gray-500 mb-6'>
              Please go back to your cart and select items to checkout
            </p>
            <button
              onClick={() => navigate('/app/cart')}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4'
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate('/app/dashboard')}
              className='px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className='flex flex-col min-h-screen w-screen bg-[#FAEBD7] font-sans'>
      {/* Modals */}
      <SuccessModal />
      <ReceiptModal />

      <div className='flex-1 container mx-auto px-4 py-8 max-w-6xl'>
        {/* Debug Panel - Remove in production */}
        <DebugPanel />

        {/* Header */}
        <div className='flex items-center mb-8'>
          <button
            onClick={() => navigate('/app/cart')}
            className='mr-4 p-2 hover:bg-white rounded-full transition-colors'
          >
            <ArrowLeft className='w-6 h-6' />
          </button>
          <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700'>
            <AlertCircle className='w-5 h-5 mr-2' />
            {errors.general}
          </div>
        )}

        {/* Warning if profile data is empty */}
        {!customerInfo.fullName && !customerInfo.email && !isLoadingProfile && (
          <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center text-yellow-700'>
            <AlertCircle className='w-5 h-5 mr-2' />
            <div>
              <p className='font-medium'>Profile information not found</p>
              <p className='text-sm'>
                Please fill in your information below or update your profile.
              </p>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Forms */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Customer Information */}
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  <User className='w-5 h-5 mr-2 text-gray-600' />
                  <h2 className='text-lg font-semibold text-gray-800'>
                    Customer Information
                  </h2>
                </div>
                {user && (
                  <button
                    onClick={() => navigate('/profile')}
                    className='text-sm text-blue-600 hover:text-blue-800 underline'
                  >
                    Update Profile
                  </button>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    name='fullName'
                    value={customerInfo.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder='Enter your full name'
                  />
                  {errors.fullName && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder='Enter your email'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder='Enter your phone number'
                  />
                  {errors.phone && (
                    <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='flex items-center mb-4'>
                <MapPin className='w-5 h-5 mr-2 text-gray-600' />
                <h2 className='text-lg font-semibold text-gray-800'>
                  Shipping Address
                </h2>
              </div>

              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Address *
                  </label>
                  <textarea
                    name='address'
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows='3'
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400 ${errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder='Enter your complete address'
                  />
                  {errors.address && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      City *
                    </label>
                    <input
                      type='text'
                      name='city'
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder='Enter your city'
                    />
                    {errors.city && (
                      <p className='text-red-500 text-sm mt-1'>{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Province / State
                    </label>
                    <input
                      type='text'
                      name='state'
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400'
                      placeholder='Enter province or state'
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Payment Method */}
            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className='flex items-center mb-4'>
                <CreditCard className='w-5 h-5 mr-2 text-gray-600' />
                <h2 className='text-lg font-semibold text-gray-800'>
                  Payment Method
                </h2>
              </div>

              <div className='space-y-4'>
                {/* GCash Option */}
                <div className='flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors'>
                  <input
                    type='radio'
                    id='gcash'
                    name='payment'
                    value='gcash'
                    checked={selectedPayment === 'gcash'}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                    className='w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                  />
                  <label htmlFor='gcash' className='flex-1 cursor-pointer'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-gray-800 font-medium'>GCash</p>
                        <p className='text-sm text-gray-500'>Upload payment receipt</p>
                      </div>
                      <div className='text-blue-600 font-bold'>GCash</div>
                    </div>
                  </label>
                </div>

                {/* Cash on Delivery Option */}
                <div className='flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors'>
                  <input
                    type='radio'
                    id='cod'
                    name='payment'
                    value='cod'
                    checked={selectedPayment === 'cod'}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                    className='w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                  />
                  <label htmlFor='cod' className='flex-1 cursor-pointer'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-gray-800 font-medium'>Cash on Delivery</p>
                        <p className='text-sm text-gray-500'>Pay when you receive your order</p>
                      </div>
                      <div className='text-green-600 font-bold'>COD</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method Error */}
              {errors.payment && (
                <p className='text-red-500 text-sm mt-2'>{errors.payment}</p>
              )}

              {/* GCash Info */}
              {selectedPayment === 'gcash' && (
                <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <h4 className='font-medium text-blue-900 mb-2'>GCash Payment Instructions:</h4>
                  <ol className='text-sm text-blue-800 space-y-1'>
                    <li>1. Send payment to: <strong>09XX-XXX-XXXX</strong></li>
                    <li>2. Amount: <strong>₱{finalTotal.toFixed(2)}</strong></li>
                    <li>3. Take a screenshot of your payment receipt</li>
                    <li>4. Upload the receipt when placing your order</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-lg shadow-sm sticky top-4'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className='space-y-3 mb-4 max-h-60 overflow-y-auto'>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex items-center space-x-3'>
                    <img
                      src={getImageUrl(item.product?.images?.[0]?.image || item.images?.[0]?.image)}
                      alt={item.name}
                      className='w-12 h-12 object-cover rounded'
                      onError={(e) => {
                        e.target.src = '/src/assets/placeholder.jpg';
                      }}
                    />
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-800'>
                        {item.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        Qty: {item.quantity}

                      </p>
                    </div>
                    <p className='text-sm font-medium text-gray-800'>
                      ₱{Number(item.price).toFixed(2)}
                    </p>
                    {(item.product?.discount || item.discount) > 0 && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        ₱{(item.price * item.quantity).toFixed(2)}
                        {/* ₱{Number(item.price).toFixed(2)} */}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className='border-t pt-4 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>
                    Subtotal ({totalOrders} items)
                  </span>
                  <span>₱{totalPrice.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Shipping Fee</span>
                  <span className='text-gray-600'>₱{shippingFee.toFixed(2)}</span>
                </div>
                <div className='flex text-blue-700 justify-between text-lg font-semibold border-t pt-2'>
                  <span>Total</span>
                  <span>₱{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
              >
                {isProcessing ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - ₱${finalTotal.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}