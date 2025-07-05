import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios"
import toast from 'react-hot-toast'
export default function ShopInfoPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("customize");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Add this state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const tabs = [
    { key: "customize", label: "Customize product variation" },
    { key: "orders", label: "Orders" },
    { key: "returned", label: "Returned Items" },
  ];

  const handleViewReceipt = (order) => {
    setSelectedOrder(order); // Set the selected order
    setShowReceiptModal(true); // Show the modal
  }

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false); // Hide the modal
    setSelectedOrder(null); // Clear the selected order
  }
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/own-products", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products.data); // assuming the products are in data.data
        console.log('newnew', data.products.data)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/own-store/orders", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });

        const data = response.data
        console.log('orders', data);
        setOrders(data.orders); // assuming the orders are in data.data

      } catch (err) {
        if (err.response.data.message) {
          console.error("Error fetching orders:", err.response.data.message);
        }
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  const navigateToEdit = (productId) => () => {
    navigate(`/app/product-info/${productId}`);
  };

  const handleAcceptOrder = async (order_id) => {
    // alert(order_id)
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/own-products/${order_id}/purchase-status/Accepted`, {}, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      console.log('Order accepted:', response.data);

      // Update the local state to reflect the change
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === order_id ? { ...order, status: 'Accepted' } : order
        )
      );

      toast.success('Order has been accepted', {
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  }

  const handleDeliverOrder = async (order_id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/own-products/${order_id}/purchase-status/Delivered`, {}, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      console.log('Order delivered:', response.data);

      // Update the local state to reflect the change
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === order_id ? { ...order, status: 'Delivered' } : order
        )
      );
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  }

  const handleDeclineOrder = async (order_id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/own-products/${order_id}/purchase-status/Declined`, {}, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      console.log('Order declined:', response.data);

      // Update the local state to reflect the change
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === order_id ? { ...order, status: 'Declined' } : order
        )
      );
    } catch (error) {
      console.error('Error marking order as declined:', error);
    }
  }

  // Filter orders to exclude returned orders for the orders tab
  const filteredOrders = orders.filter(order =>
    order.status !== 'Returned' &&
    order.status !== 'Cancelled' &&
    order.status !== 'returned' &&
    order.status !== 'cancelled'  // Added lowercase version for consistency
  );

  return (
    <div className="flex flex-col overflow-hidden w-screen h-screen font-sans bg-gradient-to-br from-[#FAEBD7] via-[#F5F5DC] to-[#FFF8DC]">
      {/* Main Section */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start">
        {showReceiptModal && selectedOrder && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
              <button
                onClick={handleCloseReceiptModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-600">GCash Receipt</h2>
              <div className="mb-4 flex items-center justify-center w-full border">
                <img className='w-[200px]' src={`http://localhost:8000/storage/${selectedOrder.payment.receipt}`} />
                {/* <div className="font-medium mb-2">Product: {selectedOrder.product?.name || 'N/A'}</div>
                <div>Quantity: {selectedOrder.quantity}</div>
                <div>Price: ₱{selectedOrder.price?.toLocaleString()}</div>
                <div>Total: ₱{(selectedOrder.price * selectedOrder.quantity).toLocaleString()}</div>
                <div>Status: {selectedOrder.status}</div> */}
              </div>
              <div className="mb-4">
                {selectedOrder.payment?.receipt_image && (
                  <img
                    src={`http://localhost:8000/storage/${selectedOrder.payment.receipt_image}`}
                    alt="GCash Receipt"
                    className="w-full max-h-96 object-contain rounded-lg border"
                  />
                )}
              </div>
              {selectedOrder.status !== 'Accepted' && selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Declined' && (
                <button
                  onClick={() => { handleAcceptOrder(selectedOrder.id); handleCloseReceiptModal(); }}
                  className="w-full px-4 py-2 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-medium mt-4"
                >
                  Approve Order
                </button>
              )}
            </div>
          </div>
        )}
        <section className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 text-center text-xs sm:text-sm font-medium bg-gray-50 rounded-t-2xl overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-max cursor-pointer py-3 sm:py-4 px-3 sm:px-6 transition-all duration-300 hover:bg-white whitespace-nowrap ${activeTab === tab.key
                  ? "text-[#213567] bg-white border-b-3 border-[#213567] font-semibold shadow-sm"
                  : "text-gray-600 hover:text-[#213567]"
                  } ${tab.key === 'customize' ? 'rounded-tl-2xl' : ''} ${tab.key === 'returned' ? 'rounded-tr-2xl' : ''}`}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {/* Add New Item Button - Only for Customize */}
            {activeTab === "customize" && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => navigate("/app/add-product")}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-white bg-gradient-to-r from-[#213567] to-[#1a2c4d] rounded-lg text-xs sm:text-sm font-medium hover:from-[#1a2c4d] hover:to-[#213567] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + Add New Item
                </button>
              </div>
            )}

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              {/* Customize Tab */}
              {activeTab === "customize" && (
                <div className="text-black">
                  {/* Desktop Header */}
                  <div className="hidden lg:grid grid-cols-4 gap-4 font-semibold text-gray-700 border-b border-gray-200 pb-4 mb-4">
                    <div>Item Name</div>
                    <div className="text-right pr-8">Stock</div>
                    <div className="text-right pr-8">Price</div>
                    <div className="text-right pr-8">Total</div>
                  </div>

                  {products.map((product) => (
                    <div key={product.id} className="py-4 sm:py-5 border-b border-gray-100 hover:bg-white rounded-lg transition-colors duration-200 px-2 sm:px-4">
                      {/* Desktop Layout */}
                      <div className="hidden lg:grid grid-cols-4 gap-4 items-center">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-md border border-gray-200 overflow-hidden">
                            <img
                              className='object-cover w-full h-full'
                              src={`http://localhost:8000/storage/${product.images[0].image}`}
                              alt={product.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center" style={{ display: 'none' }}>
                              <span className="text-gray-500 text-xs">IMG</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{product.name}</p>
                            <p className="text-gray-600 text-sm">Location: {product.location}</p>
                          </div>
                        </div>
                        <div className="text-gray-800 text-right pr-8 font-medium">{product.stock}</div>
                        <div className="text-gray-800 text-right pr-8 font-medium">₱{product.price.toLocaleString()}</div>
                        <div className="text-right pr-8">
                          <div className="text-gray-900 font-semibold">₱{(product.price * product.stock).toLocaleString()}</div>
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={navigateToEdit(product.id)}
                              className="px-4 py-2 text-white bg-[#213567] rounded-lg text-sm font-medium hover:bg-[#1a2c4d] transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                            <img
                              className='object-cover w-full h-full'
                              src={`http://localhost:8000/storage/${product.images[0].image}`}
                              alt={product.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center" style={{ display: 'none' }}>
                              <span className="text-gray-500 text-xs">IMG</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{product.name}</p>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">Location: {product.location}</p>

                            <div className="mt-3 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Stock:</span>
                                <span className="font-medium text-gray-800">{product.stock}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Price:</span>
                                <span className="font-medium text-gray-800">₱{product.price.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold text-gray-900">₱{(product.price * product.stock).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="mt-4">
                              <button
                                onClick={navigateToEdit(product.id)}
                                className="w-full px-4 py-2 text-white bg-[#213567] rounded-lg text-sm font-medium hover:bg-[#1a2c4d] transition-colors duration-200 shadow-sm hover:shadow-md"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="text-black">

                  {/* Desktop Header */}
                  <div className="hidden lg:grid grid-cols-4 gap-4 font-semibold text-gray-700 border-b border-gray-200 pb-4 mb-4">
                    <div>Item Name</div>
                    <div className="text-right pr-8">Quantity</div>
                    <div className="text-right pr-8">Price</div>
                    <div className="text-right pr-8">Total</div>
                  </div>

                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <div key={order.id} className="py-4 sm:py-5 border-b border-gray-100 hover:bg-white rounded-lg transition-colors duration-200 px-2 sm:px-4">
                        {/* Desktop Layout */}
                        <div className="hidden lg:grid grid-cols-4 gap-4 items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                              {order.product?.images?.[0]?.image ? (
                                <img
                                  className='object-cover w-full h-full'
                                  src={`http://localhost:8000/storage/${order.product.images[0].image}`}
                                  alt={order.product?.name || 'Product'}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">IMG</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium">{order.product?.name || 'N/A'}</p>
                              <p className="text-gray-600 text-sm">Variation: {order.product?.variation || 'N/A'}</p>
                              <p className="text-gray-600 text-sm mt-1">Location: {order.user?.address || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-gray-800 text-right pr-8 font-medium">{order.quantity}</div>
                          <div className="text-gray-800 text-right pr-8 font-medium">₱{order.price.toLocaleString()}</div>
                          <div className="text-right pr-8">
                            <div className="text-gray-900 font-semibold">₱{(order.price * order.quantity).toLocaleString()}</div>
                            <div className="mt-3 flex justify-end space-x-2">
                              {/* Accept Button - only show if status is pending */}
                              {order.status !== 'Accepted' && order.status !== 'Delivered' && order.status !== 'Declined' && (
                                order.payment_method === 'gcash' ? (
                                  <button
                                    onClick={() => handleViewReceipt(order)}
                                    className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-sm font-medium"
                                  >
                                    View Receipt
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAcceptOrder(order.id)}
                                    className="px-4 py-2 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-medium"
                                  >
                                    Accept
                                  </button>
                                )
                              )}

                              {/* Delivered Button - only show if accepted but not delivered */}
                              {order.status === 'Accepted' && (
                                <button
                                  onClick={(e) => handleDeliverOrder(order.id)}
                                  type="button"
                                  className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                  Mark as Delivered
                                </button>
                              )}

                              {/* Status indicator for delivered orders */}
                              {order.status === 'Delivered' && (
                                <span className="px-4 py-2 text-green-700 bg-green-100 rounded-lg text-sm font-medium border border-green-200">
                                  ✓ Delivered
                                </span>
                              )}

                              {/* Status indicator for declined orders */}
                              {order.status === 'Declined' && (
                                <span className="px-4 py-2 text-red-700 bg-red-100 rounded-lg text-sm font-medium border border-red-200">
                                  ✗ Declined
                                </span>
                              )}

                              {/* Decline Button - only show if not delivered and not declined */}
                              {order.status !== 'Delivered'&& (
                                <button
                                  onClick={(e) => handleDeclineOrder(order.id)}
                                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md">
                                  Decline
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="lg:hidden">
                          <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                              {order.product?.images?.[0]?.image ? (
                                <img
                                  className='object-cover w-full h-full'
                                  src={`http://localhost:8000/storage/${order.product.images[0].image}`}
                                  alt={order.product?.name || 'Product'}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">IMG</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{order.product?.name || 'N/A'}</p>
                              <p className="text-gray-600 text-xs sm:text-sm mt-1">Variation: {order.product?.variation || 'N/A'}</p>
                              <p className="text-gray-600 text-xs sm:text-sm">Location: {order.user?.address || 'N/A'}</p>

                              <div className="mt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Quantity:</span>
                                  <span className="font-medium text-gray-800">{order.quantity}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Price:</span>
                                  <span className="font-medium text-gray-800">₱{order.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-semibold text-gray-900">₱{(order.price * order.quantity).toLocaleString()}</span>
                                </div>
                              </div>

                              <div className="mt-4 space-y-2">
                                {/* First row of buttons */}
                                <div className="flex space-x-2">
                                  {/* Accept Button - only show if status is pending */}
                                  {order.status !== 'Accepted' && order.status !== 'Delivered' && order.status !== 'Declined' && (
                                    order.payment_method === 'gcash' ? (
                                      <button
                                        onClick={() => handleViewReceipt(order)}
                                        className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-sm font-medium"
                                      >
                                        View Receipt
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleAcceptOrder(order.id)}
                                        className="px-4 py-2 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-medium"
                                      >
                                        Accept
                                      </button>
                                    )
                                  )}

                                  {/* Decline Button - only show if not delivered and not declined */}
                                  {order.status !== 'Delivered' && order.status !== 'Declined' && (
                                    <button
                                      onClick={(e) => handleDeclineOrder(order.id)}
                                      className="flex-1 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md">
                                      Decline
                                    </button>
                                  )}
                                </div>

                                {/* Second row - Delivered button or status */}
                                {order.status === 'Accepted' && (
                                  <button
                                    onClick={(e) => handleDeliverOrder(order.id)}
                                    className="w-full px-3 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                  >
                                    Mark as Delivered
                                  </button>
                                )}

                                {/* Status indicator for delivered orders */}
                                {order.status === 'Delivered' && (
                                  <div className="w-full px-3 py-2 text-green-700 bg-green-100 rounded-lg text-sm font-medium border border-green-200 text-center">
                                    ✓ Delivered
                                  </div>
                                )}

                                {/* Status indicator for declined orders */}
                                {order.status === 'Declined' && (
                                  <div className="w-full px-3 py-2 text-red-700 bg-red-100 rounded-lg text-sm font-medium border border-red-200 text-center">
                                    ✗ Declined
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="text-gray-400 text-lg mb-2">📦</div>
                      <div className="text-gray-500 font-medium">No orders found</div>
                      <div className="text-gray-400 text-sm">Orders will appear here when customers place them</div>
                    </div>
                  )}
                </div>
              )}

              {/* Returned Tab */}
              {activeTab === "returned" && (
                <div className="text-black">
                  {/* Desktop Header */}
                  <div className="hidden lg:grid grid-cols-4 gap-4 font-semibold text-gray-700 border-b border-gray-200 pb-4 mb-4">
                    <div>Item Name</div>
                    <div className="text-right pr-8">Quantity</div>
                    <div className="text-right pr-8">Price</div>
                    <div className="text-right pr-8">Total</div>
                  </div>

                  {orders.filter(order => order.status === 'Returned' || order.status === 'returned').length > 0 ? (
                    orders.filter(order => order.status === 'Returned' || order.status === 'returned').map((order) => (
                      <div key={order.id} className="py-4 sm:py-5 border-b border-gray-100 hover:bg-white rounded-lg transition-colors duration-200 px-2 sm:px-4">
                        {/* Desktop Layout */}
                        <div className="hidden lg:grid grid-cols-4 gap-4 items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                              {order.product?.images?.[0]?.image ? (
                                <img
                                  className='object-cover w-full h-full'
                                  src={`http://localhost:8000/storage/${order.product.images[0].image}`}
                                  alt={order.product?.name || 'Product'}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">IMG</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium">{order.product?.name || 'N/A'}</p>
                              <p className="text-gray-600 text-sm">Variation: {order.product?.variation || 'N/A'}</p>
                              <p className="text-gray-600 text-sm mt-1">Location: {order.user?.address || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-gray-800 text-right pr-8 font-medium">{order.quantity}</div>
                          <div className="text-gray-800 text-right pr-8 font-medium">₱{order.price.toLocaleString()}</div>
                          <div className="text-right pr-8">
                            <div className="text-gray-900 font-semibold">₱{(order.price * order.quantity).toLocaleString()}</div>
                            <div className="mt-3 flex justify-end">
                              <button className="px-4 py-2 text-white bg-[#213567] rounded-lg text-sm font-medium hover:bg-[#1a2c4d] transition-colors duration-200 shadow-sm hover:shadow-md">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="lg:hidden">
                          <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                              {order.product?.images?.[0]?.image ? (
                                <img
                                  className='object-cover w-full h-full'
                                  src={`http://localhost:8000/storage/${order.product.images[0].image}`}
                                  alt={order.product?.name || 'Product'}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">IMG</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-medium text-sm sm:text-base">{order.product?.name || 'N/A'}</p>
                              <p className="text-gray-600 text-xs sm:text-sm mt-1">Variation: {order.product?.variation || 'N/A'}</p>
                              <p className="text-gray-600 text-xs sm:text-sm">Location: {order.user?.address || 'N/A'}</p>

                              <div className="mt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Quantity:</span>
                                  <span className="font-medium text-gray-800">{order.quantity}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Price:</span>
                                  <span className="font-medium text-gray-800">₱{order.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-semibold text-gray-900">₱{(order.price * order.quantity).toLocaleString()}</span>
                                </div>
                              </div>

                              <div className="mt-4 space-y-2">
                                {/* First row of buttons */}
                                <div className="flex space-x-2">
                                  {/* Accept Button - only show if not accepted or delivered */}
                                  {order.status !== 'Accepted' && order.status !== 'Delivered' && (
                                    <button
                                      onClick={(e) => handleAcceptOrder(order.id)}
                                      className="flex-1 px-3 py-2 text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                      Accept
                                    </button>
                                  )}

                                  {/* Decline Button - only show if not delivered */}
                                  {order.status !== 'Delivered' && (
                                    <button className="flex-1 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md">
                                      Decline
                                    </button>
                                  )}
                                </div>

                                {/* Second row - Delivered button or status */}
                                {order.status === 'Accepted' && (
                                  <button
                                    onClick={(e) => handleDeliverOrder(order.id)}
                                    className="w-full px-3 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                  >
                                    Mark as Delivered
                                  </button>
                                )}

                                {/* Status indicator for delivered orders */}
                                {order.status === 'Delivered' && (
                                  <div className="w-full px-3 py-2 text-green-700 bg-green-100 rounded-lg text-sm font-medium border border-green-200 text-center">
                                    ✓ Delivered
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="text-gray-400 text-lg mb-2">📦</div>
                      <div className="text-gray-500 font-medium">No orders found</div>
                      <div className="text-gray-400 text-sm">Orders will appear here when customers place them</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}