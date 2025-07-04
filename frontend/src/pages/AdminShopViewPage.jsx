import { useState } from 'react';

export default function AdminShopViewPage() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dummy data for the shop and seller
  const shopData = {
    shopName: "Tech Haven Store",
    status: "Active",
    seller: {
      name: "Juan Miguel Santos",
      email: "juanmiguel.santos@ustp.edu.ph",
      course: "Computer Science",
      year: "3rd Year",
      joinDate: "September 15, 2024"
    },
    products: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop",
        name: "Wireless Gaming Mouse",
        price: "₱1,299"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
        name: "Mechanical Keyboard",
        price: "₱3,500"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
        name: "USB-C Hub",
        price: "₱899"
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
        name: "Laptop Stand",
        price: "₱1,150"
      },
      {
        id: 5,
        image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop",
        name: "Phone Case",
        price: "₱299"
      },
      {
        id: 6,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
        name: "Bluetooth Earbuds",
        price: "₱2,499"
      }
    ]
  };

  const [currentShopStatus, setCurrentShopStatus] = useState(shopData.status);

  const handleSuspendShop = () => {
    if (currentShopStatus === "Active") {
      setCurrentShopStatus("Suspended");
      alert(`Shop "${shopData.shopName}" has been suspended successfully.`);
    } else {
      setCurrentShopStatus("Active");
      alert(`Shop "${shopData.shopName}" has been activated successfully.`);
    }
  };

  const handleMessageSeller = () => {
    alert(`Opening message dialog for ${shopData.seller.name} (${shopData.seller.email})`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header - copied from original code */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 mb-2">
              <img
                src="/src/assets/logo.png"
                alt="USTP Logo"
                className="absolute inset-0 w-full h-full object-contain rounded-full border-4 border-orange-400"
              />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-blue-900 leading-tight">USTP MARKETPLACE</h1>
              <h2 className="text-sm font-semibold text-blue-900">FOR STUDENTS</h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full bg-gray-50/50 hover:bg-gray-100/50 border border-gray-200/50 text-gray-600 hover:text-gray-800 transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19ZM17 11C17 8.2 14.8 6 12 6S7 8.2 7 11V18H17V11Z"/>
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 z-50">
                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Notifications</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                        <p className="text-sm text-gray-700">New product publish request</p>
                        <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                        <p className="text-sm text-gray-700">Order #1234 needs approval</p>
                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors">
                      View All
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-50/50 hover:bg-gray-100/50 border border-gray-200/50 transition-all duration-200 backdrop-blur-sm"
              >
                <span className="text-sm font-medium text-gray-700">User</span>
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 z-50">
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50/50 transition-colors">
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 font-medium hover:bg-blue-50/50 transition-colors">
                      Account
                    </button>
                    <hr className="my-1 border-gray-200/50" />
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors">
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Shops</span>
            </button>
          </div>

          {/* Shop Information Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{shopData.shopName}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentShopStatus)}`}>
                    {currentShopStatus}
                  </span>
                  <span className="text-sm text-gray-500">Joined {shopData.seller.joinDate}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleMessageSeller}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Message Seller</span>
                </button>
                
                <button
                  onClick={handleSuspendShop}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
                    currentShopStatus === "Active" 
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                      : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {currentShopStatus === "Active" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <span>{currentShopStatus === "Active" ? "Suspend Shop" : "Activate Shop"}</span>
                </button>
              </div>
            </div>

            {/* Seller Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Seller Name</h3>
                <p className="text-lg font-medium text-gray-900">{shopData.seller.name}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100/50">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Student Email</h3>
                <p className="text-sm font-medium text-gray-900 break-all">{shopData.seller.email}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100/50">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Course</h3>
                <p className="text-lg font-medium text-gray-900">{shopData.seller.course}</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100/50">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Year Level</h3>
                <p className="text-lg font-medium text-gray-900">{shopData.seller.year}</p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shop Products</h2>
              <span className="text-sm text-gray-500">{shopData.products.length} items</span>
            </div>

            {shopData.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shopData.products.map((product) => (
                  <div key={product.id} className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">{product.name}</h3>
                      <p className="text-lg font-bold text-blue-600">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-gray-500 text-lg">No products available</p>
                <p className="text-gray-400 text-sm mt-1">This shop hasn't listed any products yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}