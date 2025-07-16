import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, User, Clock, CheckCircle, Activity, Search, Filter, Calendar, Mail, UserCheck, UserX, Package, ShoppingCart, Eye, Check, XCircle, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import dayjs from 'dayjs';
// Circular Progress Component
const CircularProgress = ({ percentage, title, subtitle, color = "#3b82f6" }) => {
  const radius = 64;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-40 h-40">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color === "#3b82f6" ? "#1d4ed8" : "#4338ca"} />
            </linearGradient>
          </defs>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={`url(#gradient-${title})`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl font-bold text-gray-800">{percentage}%</span>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-xl border border-gray-200/50">
        <p className="text-sm font-medium text-gray-800">{`${label}`}</p>
        <p className="text-sm text-blue-600">
          {`Value: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

// User Profile Modal Component
const UserProfileModal = ({ user, isOpen, onClose, onStatusChange }) => {
  if (!isOpen || !user) return null;

  const handleStatusToggle = () => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    onStatusChange(user.id, newStatus);
  };

  const handleViewShop = () => {
    // Navigate to seller's shop page
    // Replace with your actual navigation logic
    const shopUrl = `/shop/${user.id}`;
    window.open(shopUrl, '_blank');
    // Or use your router: navigate(`/shop/${user.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-2 sm:mx-0 max-h-[95vh] overflow-y-auto transform transition-all ${user.status === 'Inactive' ? 'opacity-75' : ''
        }`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {user.role === 'Seller' ? 'Seller Account Details' : 'User Profile'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${user.status === 'Inactive'
              ? 'bg-gradient-to-r from-gray-400 to-gray-500'
              : user.role === 'Seller'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}>
              {user.image_path ? <img className='rounded-full' src={`http://localhost:8000/storage/${user.image_path}`} /> : (
                <User size={20} className='text-gray-600' />
              )}
              {/* <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" /> */}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 break-words">
                {user.first_name} {user.last_name}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.is_online
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
                }`}>
                {user.is_online ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* User Details - Mobile-First Layout */}
          <div className="space-y-3 sm:space-y-4">
            {/* Name */}
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Name:</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-sm text-gray-800 font-medium break-words">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Email:</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-sm text-gray-800 break-words">{user.email}</span>
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Role:</span>
              </div>
              <div className="sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Seller'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
                  }`}>
                  {user.role == 'shop_owner' ? 'Seller' : 'Student'}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Status:</span>
              </div>
              <div className="sm:col-span-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.is_online
                  ? 'bg-green-100 text-green-800'
                  // : 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'

                  }`}>
                  {user.is_online ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Join Date:</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-sm text-gray-800">
                  <span className="sm:hidden">{dayjs(user.created_at).format('MM/DD/YYYY')}</span>
                  <span className="hidden sm:inline">{dayjs(user.created_at).format('YYYY-MM-DD')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-3">
            {/* View Shop Button - Only for Sellers */}
            {user.role === 'Seller' && (
              <button
                onClick={handleViewShop}
                className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white touch-manipulation"
              >
                <Activity className="w-5 h-5 flex-shrink-0" />
                <span>View Shop</span>
              </button>
            )}

            {/* Status Toggle Button - Only for Sellers */}
            {user.role === 'shop_owner' && (
              <button
                onClick={handleStatusToggle}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 touch-manipulation ${user.status === 'Active'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
              >
                {!user.deleted_at ? (
                  <>
                    <UserX className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">Deactivate Seller</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">Activate Seller</span>
                  </>
                )}
              </button>
            )}

            {user.deleted_at && user.role === 'Seller' && (
              <p className="text-xs text-red-600 text-center px-2">
                This seller account is currently deactivated
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// Users Table Component
const UsersTable = ({ searchTerm, setSearchTerm }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/user/fetch-users', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });
        console.log(response.data)
        setUsers(response.data.users); // Assuming the data is in the 'users' key
        // setLoading(false);
      } catch (err) {
        // setError('Error fetching users');
        // setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // const [users, setUsers] = useState([
  //   { id: 1, name: 'Janice Almonte', email: 'wakapasar@ustp.edu.ph', role: 'Student', status: 'Active', joinDate: '2025-01-15' },
  //   { id: 2, name: 'Jane Smith', email: 'jane@ustp.edu.ph', role: 'Seller', status: 'Active', joinDate: '2024-01-20' },
  //   { id: 3, name: 'Mike Johnson', email: 'mike@ustp.edu.ph', role: 'Student', status: 'Inactive', joinDate: '2024-02-01' },
  //   { id: 4, name: 'Sarah Wilson', email: 'sarah@ustp.edu.ph', role: 'Seller', status: 'Active', joinDate: '2024-02-10' },
  //   { id: 5, name: 'David Brown', email: 'david@ustp.edu.ph', role: 'Student', status: 'Active', joinDate: '2024-02-15' },
  //   { id: 6, name: 'Lisa Garcia', email: 'lisa@ustp.edu.ph', role: 'Seller', status: 'Inactive', joinDate: '2024-03-01' },
  // ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.first_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    user.last_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    user.email?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    user.role?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </div>
          {/* <button className="p-3 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200/50 hover:bg-gray-50/50 transition-colors sm:flex-shrink-0">
          <Filter className="w-5 h-5 text-gray-600" />
        </button> */}
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <div className="min-w-full">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50/50 border-b border-gray-200/50">
                  <tr>
                    <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[140px]">Name</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[180px]">Email</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[100px]">Role</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[100px]">Status</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[120px]">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className={`cursor-pointer transition-all duration-200 ${user.status === 'Inactive' && user.role === 'Seller'
                        ? 'hover:bg-red-50/50 bg-red-25/25'
                        : 'hover:bg-gray-50/50'
                        }`}
                    >
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${user.status === 'Inactive' && user.role === 'Seller'
                            ? 'bg-gradient-to-r from-red-400 to-red-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}>
                            {user.image_path ? <img className='rounded-full' src={`http://localhost:8000/storage/${user.image_path}`} /> : (
                              <User size={20} className='text-gray-600' />
                            )}
                          </div>
                          <span className={`text-sm font-medium truncate ${user.status === 'Inactive' && user.role === 'Seller'
                            ? 'text-gray-500'
                            : 'text-gray-800'
                            }`}>
                            <span className="sm:hidden">{user.first_name}</span>
                            <span className="hidden sm:inline">{user.first_name} {user.last_name}</span>
                          </span>
                        </div>
                      </td>
                      <td className={`px-3 sm:px-6 py-4 text-sm ${user.status === 'Inactive' && user.role === 'Seller'
                        ? 'text-gray-400'
                        : 'text-gray-600'
                        }`}>
                        <div className="truncate max-w-[150px] sm:max-w-none" title={user.email}>
                          {user.email}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${user.role === 'shop_owner'
                          ? user.deleted_at
                            ? 'bg-red-100 text-red-800'
                            : 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role == 'shop_owner' ? 'Seller' : 'Student'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${user.is_online ?
                          'bg-green-100 text-green-800'
                          // : 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'

                          }`}>
                          {user.is_online ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={`px-3 sm:px-6 py-4 text-sm whitespace-nowrap ${user.status === 'Inactive' && user.role === 'Seller'
                        ? 'text-gray-400'
                        : 'text-gray-600'
                        }`}>
                        <span className="sm:hidden">{dayjs(user.created_at).format('MM/DD/YY')}</span>
                        <span className="hidden sm:inline">{dayjs(user.created_at).format('YYYY-MM-DD')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile-friendly message when table is scrollable */}
          <div className="sm:hidden px-4 py-2 text-xs text-gray-500 bg-gray-50/30 border-t border-gray-200/50 text-center">
            Swipe left to see more columns
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeModal}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

// Activity Management Component
const ActivityManagement = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [filter, setFilter] = useState('all')




  const fetchActivities = async () => {
    try {
      setActivities([])
      setLoading(true)
      setError(null)

      const response = await axios.get('http://localhost:8000/api/v1/admin/activities/', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        }
      })

      console.log('activities', response.data)
      setActivities(response.data)
    } catch (err) {
      setError('Failed to load activities. Please try again.')
      console.error('Error fetching activities:', err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {


    fetchActivities()
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'product':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Add slight delay to allow modal animation to complete
    setTimeout(() => setSelectedActivity(null), 150);
  };

  const handleApproveProduct = async (product_id, user_id) => {
    try {
      // return alert(product_id)
      setActionLoading(true)

      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await axios.put(`http://localhost:8000/api/v1/admin/product/${product_id}/accepted/${user_id}`, {}, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        }
      })

      console.log(response)
      fetchActivities()

      // setActivities(prev =>
      //   prev.map(activity =>
      //     activity.id === selectedActivity.id
      //       ? { ...activity, status: 'completed', description: 'Product approved' }
      //       : activity
      //   )
      // );

      // Show success feedback
      closeModal();
      // You could add a toast notification here

    } catch (err) {
      setError('Failed to approve product. Please try again.')
    } finally {
      setActionLoading(false)
    }
  };

  const handleDeclineProduct = async () => {
    try {
      setActionLoading(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setActivities(prev =>
        prev.map(activity =>
          activity.id === selectedActivity.id
            ? { ...activity, status: 'declined', description: 'Product declined' }
            : activity
        )
      );

      closeModal();

    } catch (err) {
      setError('Failed to decline product. Please try again.')
    } finally {
      setActionLoading(false)
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.status === filter;
  });

  const renderModalContent = () => {
    if (!selectedActivity) return null;

    switch (selectedActivity.type) {
      case 'registration':
        {
          const user = selectedActivity.user;
          return (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  {user.image_path ? <img className='rounded-full' src={`http://localhost:8000/storage/${user.image_path}`} /> : (
                    <User size={20} className='text-gray-600' />
                  )}
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-800 font-medium">{user.first_name} {user.last_name}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-800">{user.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Role:</span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${user.role === 'shop_owner'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {user.role == 'shop_owner' ? 'Seller' : 'Student'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${user.is_online ?
                    'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {user.is_online ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Join Date:</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-800">{user.created_at}</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          );
        }

      case 'product':
        {
          const product = selectedActivity.product;
          return (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Product Header */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={`http://localhost:8000/storage/${product.images[0].image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkM0NC40NCAzMiA0NCA0NC40IDQ0IDQ4VjY0SDM2VjQ4QzM2IDQ4IDM2IDQwIDI0IDQwVjMyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.categories.map(category => category.name).join(', ')}
                  </p>
                  <p className="text-xl font-bold text-green-600 mt-2">₱{product.price}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <label className="text-sm font-medium text-gray-700 block mb-2">Description</label>
                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Seller:</span>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.shop.name}</p>
                    <p className="text-gray-500">{product.shop.user.first_name} {product.shop.user.last_name}</p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              {selectedActivity.accepted == 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200 animate-pulse">
                  <Clock className="w-4 h-4" />
                  <span>Pending approval since {product.created_at}</span>
                </div>
              )}
              {/* <pre className='text-black'>
                    {JSON.stringify(selectedActivity)}

              </pre> */}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                {selectedActivity.product.accepted == 0 && (
                  <>
                    <button
                      onClick={handleDeclineProduct}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      Decline
                    </button>
                    <button
                      onClick={() => handleApproveProduct(product.id, selectedActivity.user.id)}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <div className="w-4 h-4 border-2 border-green-300 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        }
      case 'order':
        {
          const order = selectedActivity;
          // console.log("www", order)
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order ID</label>
                    <p className="text-lg font-semibold text-gray-800">#{order.purchase.order_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer</label>
                    <p className="text-gray-800">{order.user.first_name} {order.user.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-xl font-bold text-green-600">₱{order.purchase.total}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status </label>
                    <span className={`inline-flex capitalize  items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {' '}{order.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Date</label>
                    <p className="text-gray-800">{order.created_at}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Items Ordered</label>
                <div className="mt-2 space-y-2">

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{order.purchase.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {order.purchase.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">₱{order.purchase.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>

              </div>
            </div>
          );
        }

      default:
        return (
          <div className="text-center py-8 animate-in fade-in duration-200">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Activity details not available</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Activity Management</h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Activity Management</h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8 text-center">
          <div className="text-red-500 mb-4">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Activity Management</h2>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'pending', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 capitalize ${filter === status
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6">
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No activities found</p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/70 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                      {activity.description}
                    </p>
                    <span className={`inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${activity.status === 'completed'
                      ? 'bg-green-100 text-green-800 group-hover:bg-green-200'
                      : activity.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
                        : activity.status === 'declined'
                          ? 'bg-red-100 text-red-800 group-hover:bg-red-200'
                          : 'bg-gray-100 text-gray-800 group-hover:bg-gray-200'
                      }`}>
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {activity.user?.first_name ? `${activity.user.first_name} ${activity.user.last_name}` : activity.user}
                    </span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{activity.created_at || activity.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedActivity?.type === 'registration' ? 'User Profile Details' :
                  selectedActivity?.type === 'product' ? 'Product Details' :
                    selectedActivity?.type === 'order' ? 'Order Details' : 'Activity Details'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 group"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdDashboard() {
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showActiveUsersModal, setShowActiveUsersModal] = useState(false);
  const [showActiveSellersModal, setShowActiveSellersModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersCount, setUsersCount] = useState([])
  const [sellersCount, setSellersCount] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsersCount()
  }, [])
  const fetchUsersCount = async () => {
    const response = await axios.get('http://localhost:8000/api/v1/user/fetch-users', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
      }
    })

    console.log("users count", response)
    setUsersCount(response.data.users_count)
    setSellersCount(response.data.sellers_count)
    setUsers(response.data.users)
  }


  // const fetchActiveUsers = async () => {
  //   const response = await axios.get('http://localhost:8000/api/v1/user/active-users', {
  //     headers: {
  //       'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
  //     }
  //   })

  //   console.log("Active users", response)
  //   setActiveUsers([response.data])
  //   // setUsersCount(response.data.users_count)
  //   // setSellersCount(response.data.sellers_count)
  // }

  const fetchInitialData = async () => {
    await fetchUsersCount()
  }



  const handleNavigate = (route) => {
    navigate(route)
  }

  // Chart data states
  const [activeUsers, setActiveUsers] = useState([])
  const [activeSellers, setActiveSellers] = useState([])
  const [visitorsData, setVisitorsData] = useState([]);
  const [sellersData, setSellersData] = useState([]);
  const [activeUsersPercent, setActiveUsersPercent] = useState(0);
  const [activeSellersPercent, setActiveSellersPercent] = useState(0);

  // Mock data for active users and sellers
  // const [activeUsers] = useState([
  //   { id: 1, name: 'John Doe', role: 'Student', lastActive: '2 minutes ago', status: 'Online' },
  //   { id: 2, name: 'Jane Smith', role: 'Student', lastActive: '5 minutes ago', status: 'Online' },
  //   { id: 3, name: 'Mike Johnson', role: 'Student', lastActive: '10 minutes ago', status: 'Away' },
  // ]);

  useEffect(() => {
    setActiveUsers(users.filter((user) => user.is_online))
    setActiveSellers(users.filter((user) => user.role === "shop_owner" && user.is_online))
    setActiveUsersPercent(((activeUsers.length / users.length) * 100).toFixed(1));
    setActiveSellersPercent(((activeSellers.length / users.length) * 100).toFixed(1));

  }, [users])


  // const [activeSellers] = useState([
  //     { id: 1, name: 'Sarah Wilson', role: 'Seller', lastActive: '1 minute ago', status: 'Online' },
  //     { id: 2, name: 'David Brown', role: 'Seller', lastActive: '8 minutes ago', status: 'Online' },
  //   ]);
  // Mock API data fetch simulation
  // useEffect(() => {
  //   const fetchData = () => {
  //     setTimeout(() => {
  //       const mockVisitorsData = [
  //         { month: 'Mar 2024', visitors: 45, fullMonth: 'March 2024' },
  //         { month: 'Apr 2024', visitors: 62, fullMonth: 'April 2024' },
  //         { month: 'May 2024', visitors: 58, fullMonth: 'May 2024' },
  //         { month: 'Jun 2024', visitors: 71, fullMonth: 'June 2024' },
  //         { month: 'Jul 2024', visitors: 85, fullMonth: 'July 2024' },
  //       ];

  //       const mockSellersData = [
  //         { month: 'Mar 2024', subscribers: 12, fullMonth: 'March 2024' },
  //         { month: 'Apr 2024', subscribers: 18, fullMonth: 'April 2024' },
  //         { month: 'May 2024', subscribers: 15, fullMonth: 'May 2024' },
  //         { month: 'Jun 2024', subscribers: 22, fullMonth: 'June 2024' },
  //         { month: 'Jul 2024', subscribers: 28, fullMonth: 'July 2024' },
  //       ];

  //       setVisitorsData(mockVisitorsData);
  //       setSellersData(mockSellersData);
  //       setActiveSellersPercent(20);
  //     }, 1000);
  //   };

  //   fetchData();
  // }, []);

  const renderActiveUsersList = (users) => (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
          {/* {JSON.stringify(user)} */}

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              {/* <User className="w-5 h-5 text-white" /> */}
              {user.image_path ? <img className='rounded-full' src={`http://localhost:8000/storage/${user.image_path}`} /> : (
                <User size={20} className='text-gray-600' />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.first_name}</p>
              <p className="text-sm text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">{user.is_online ? 'Online' : 'Away'}</span>
            </div>
            {/* <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>{user.lastActive}</span>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#22336c] rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold text-white">{usersCount ? usersCount : '0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-200 rounded-xl p-6 text-gray-700 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 text-sm font-medium">Total Registered as Sellers</p>
              <p className="text-4xl font-bold">{sellersCount ? sellersCount : 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid - 2x2 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Row */}
        {/* Visitors Over Time Chart */}
        {/* <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 p-6 h-96">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Visitors Over Time</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Overview</span>
          </div>
          <div className="h-64">
            {visitorsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="visitors"
                    fill="url(#blueGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div> */}

        {/* Active Users Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-96">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-800">Active Users</span>
            </div>
            <button
              onClick={() => setShowActiveUsersModal(true)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
            >
              View
            </button>
          </div>

          {/* Updated CircularProgress Component */}
          <div className="flex items-center justify-center h-full">
            <div className="relative w-48 h-48">
              {/* SVG Circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-300"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  stroke="#3b82f6"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="282.743"
                  strokeDashoffset={(1 - activeUsersPercent / 100) * 282.743}
                  r="45"
                  cx="50"
                  cy="50"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-gray-800">
                  {activeUsersPercent > 0 ? `${activeUsersPercent}%` : '0%'}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  of total users
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Row */}
        {/* Seller Subscribers Chart */}
        {/* <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 p-6 h-96">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Seller Subscribers</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Overview</span>
          </div>

          <div className="h-64">
            {sellersData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sellersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="subscribers"
                    fill="url(#indigoGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4338ca" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}
          </div>
        </div> */}

        {/* Active Sellers Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-96">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-800">Active Sellers</span>
            </div>
            <button
              onClick={() => setShowActiveSellersModal(true)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
            >
              View
            </button>
          </div>

          {/* Updated CircularProgress layout */}
          <div className="flex items-center justify-center h-full">
            <div className="relative w-48 h-48">
              {/* SVG Circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-300"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  stroke="#6366f1"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="282.743"
                  strokeDashoffset={(1 - activeSellersPercent / 100) * 282.743}
                  r="45"
                  cx="50"
                  cy="50"
                />
              </svg>

              {/* Centered Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-gray-800">
                  {activeSellersPercent > 0 ? `${activeSellersPercent}%` : '0%'}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  of total sellers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 bg-fixed">
      {/* Modern Top Navigation Bar */}

      {/* Main Content */}
      <main className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden">
              <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard'
                    ? 'bg-[#22336c] text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'users'
                    ? 'bg-[#22336c] text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                    }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'activity'
                    ? 'bg-[#22336c] text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                    }`}
                >
                  Activity
                </button>
              </div>
            </div>

            {/* Desktop Sidebar Navigation */}
            <aside className="hidden lg:block w-48 flex-shrink-0">
              <nav className="space-y-2 sticky top-24">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${activeTab === 'dashboard'

                    ? 'bg-[#22336c] text-white shadow-lg hover:shadow-xl'
                    // ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${activeTab === 'users'
                    ? 'bg-[#22336c] text-white shadow-lg hover:shadow-xl'
                    // ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                    }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${activeTab === 'activity'
                    ? 'bg-[#22336c] text-white shadow-lg hover:shadow-xl'
                    // ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                    }`}
                >
                  Activity Management
                </button>
              </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {activeTab === 'dashboard' && renderDashboardContent()}
              {activeTab === 'users' && <UsersTable searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
              {activeTab === 'activity' && <ActivityManagement />}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={showActiveUsersModal}
        onClose={() => setShowActiveUsersModal(false)}
        title="Active Users"
      >
        {renderActiveUsersList(activeUsers, 'users')}
      </Modal>

      <Modal
        isOpen={showActiveSellersModal}
        onClose={() => setShowActiveSellersModal(false)}
        title="Active Sellers"
      >
        {renderActiveUsersList(activeSellers, 'sellers')}
      </Modal>
    </div>
  );
}