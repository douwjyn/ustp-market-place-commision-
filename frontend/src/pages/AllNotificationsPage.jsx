import { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function AllNotificationsPage() {
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'product_request',
      title: 'New Product Publish Request',
      message:
        'John Doe has submitted a new product "iPhone 14 Pro" for approval.',
      timestamp: '2 minutes ago',
      is_read: false,
      priority: 'high',
      action_required: true,
    },
    {
      id: 2,
      type: 'order',
      title: 'Order Needs Approval',
      message:
        'Order #1234 from Sarah Wilson requires your approval before processing.',
      timestamp: '1 hour ago',
      is_read: false,
      priority: 'medium',
      action_required: true,
    },
    {
      id: 3,
      type: 'user_registration',
      title: 'New User Registration',
      message: 'Mike Johnson has registered as a new seller on the platform.',
      timestamp: '3 hours ago',
      is_read: true,
      priority: 'low',
      action_required: false,
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₱2,500 has been received for Order #1233.',
      timestamp: '5 hours ago',
      is_read: true,
      priority: 'low',
      action_required: false,
    },
    {
      id: 5,
      type: 'report',
      title: 'Product Report',
      message:
        'A product has been reported for inappropriate content and needs review.',
      timestamp: '1 day ago',
      is_read: false,
      priority: 'high',
      action_required: true,
    },
    {
      id: 6,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2:00 AM - 4:00 AM.',
      timestamp: '2 days ago',
      is_read: true,
      priority: 'medium',
      action_required: false,
    },
    {
      id: 7,
      type: 'product_request',
      title: 'Product Update Request',
      message:
        'Lisa Chen wants to update product details for "Samsung Galaxy S23".',
      timestamp: '3 days ago',
      is_read: true,
      priority: 'low',
      action_required: false,
    },
    {
      id: 8,
      type: 'order',
      title: 'Order Cancelled',
      message: 'Order #1230 has been cancelled by the customer.',
      timestamp: '4 days ago',
      is_read: true,
      priority: 'low',
      action_required: false,
    },
  ]);

  const fetchNotifications = async () => {
    setNotifications([])
    try {
      const response = await axios.get('http://localhost:8000/api/v1/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        }
      })
      console.log('notif', response.data)

      if (response.data.notifications) {
        setNotifications(response.data.notifications)
      }
    } catch (err) {
      console.log(err)
    }

  }


  useEffect(() => {
    fetchNotifications()
  }, [])


  const handleGoBack = () => {
    // Navigate back to previous page
    window.history.back();
  };
  const logoutHandler = () => {
    sessionStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/admin/notifications/mark-read/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        }
      })

      // setNotifications((prev) =>
      // prev.map((notif) =>
      //   notif.id === notificationId ? { ...notif, is_read: true } : notif
      // )
      // );
      fetchNotifications()
    } catch (err) {
      console.log(err)
    }

  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/admin/notifications/mark-all-read`, {}, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        }
      })

      // setNotifications((prev) =>
      // prev.map((notif) =>
      //   notif.id === notificationId ? { ...notif, is_read: true } : notif
      // )
      // );
      fetchNotifications()
    } catch (err) {
      console.log(err)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product_request':
        return (
          <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              />
            </svg>
          </div>
        );
      case 'order':
        return (
          <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2'
              />
            </svg>
          </div>
        );
      case 'user_registration':
        return (
          <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className='w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
              />
            </svg>
          </div>
        );
      case 'report':
        return (
          <div className='w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className='w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className='w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 17h5l-5 5v-5z'
              />
            </svg>
          </div>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
            Medium
          </span>
        );
      case 'low':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
            Low Priority
          </span>
        );
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notif.is_read;
    if (selectedFilter === 'action') return notif.action_required;
    return notif.type === selectedFilter;
  });

  const unreadCount = notifications.filter((notif) => !notif.is_read).length;
const handleNavigate = (url) => {
  navigate(url)
}
  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 bg-fixed'>
      {/* Main Content */}
      <main className='p-6 min-h-[calc(100vh-80px)]'>
        <div className='max-w-4xl mx-auto'>
          {/* Page Header with Breadcrumb */}
          <div className='mb-8'>
            <div className='flex items-center space-x-2 text-sm text-gray-600 mb-4'>
              <button
                onClick={handleGoBack}
                className='flex items-center space-x-1 hover:text-blue-600 transition-colors'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                <span>Back to Dashboard</span>
              </button>
              <span>/</span>
              <span className='text-gray-800 font-medium'>Notifications</span>
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>
                  All Notifications
                </h1>
                <p className='text-gray-600'>
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''
                    }`
                    : 'All notifications are read'}
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
                >
                  Mark All as Read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-1 mb-6'>
            <div className='flex flex-wrap gap-1'>
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                {
                  key: 'action',
                  label: 'Action Required',
                  count: notifications.filter((n) => n.action_required).length,
                },
                {
                  key: 'product_request',
                  label: 'Products',
                  count: notifications.filter(
                    (n) => n.type === 'product_request'
                  ).length,
                },
                {
                  key: 'order',
                  label: 'Orders',
                  count: notifications.filter((n) => n.type === 'order').length,
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedFilter === filter.key
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
                    }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedFilter === filter.key
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className='space-y-4'>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl hover:scale-[1.01] ${!notification.is_read
                    ? 'border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50'
                    : 'border-gray-200/50'
                    }`}
                >
                  <div className='p-6'>
                    <div className='flex items-start space-x-4'>
                      {/* Notification Icon */}
                      {getNotificationIcon(notification.type)}

                      {/* Notification Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-3 mb-2'>
                              <h3
                                className={`text-lg font-semibold ${!notification.is_read
                                  ? 'text-gray-900'
                                  : 'text-gray-700'
                                  }`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.is_read && (
                                <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                              )}
                              {notification.action_required && (
                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                                  Action Required
                                </span>
                              )}
                              {getPriorityBadge(notification.priority)}
                            </div>

                            <p className='text-gray-600 mb-3 leading-relaxed'>
                              {notification.message}
                            </p>

                            <div className='flex items-center justify-between'>
                              <span className='text-sm text-gray-500 font-medium'>
                                {notification.timestamp}
                              </span>

                              {!notification.is_read && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                  className='text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors'
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center'>
                <div className='w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 17h5l-5 5v-5z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                  No notifications found
                </h3>
                <p className='text-gray-500'>
                  {selectedFilter === 'all'
                    ? "You don't have any notifications yet."
                    : `No ${selectedFilter} notifications found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
