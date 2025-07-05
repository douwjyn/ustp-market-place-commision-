import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import {
  Home,
  Bell,
  ShoppingCart,
  ChevronDown,
  User,
  Search,
} from 'lucide-react';
import logo from '../assets/logo.png';
import Loader from '../components/Loader';
import { useUser } from '../context/UserProvider';
import axios from 'axios'

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const [isUser, setIsUser] = useState(null);

  const handleNavigation = (path) => {
    setShowDropdown(false);
    setShowNotifications(false);
    navigate(path);
  };

  // const logout = () => {
  //   setIsLoggingOut(true);
  //   sessionStorage.removeItem('access_token');
  //   navigate('/');
  //   setIsLoading(false);
  // };

  const logout = async () => {
    setIsLoggingOut(true);

    await axios.post('http://localhost:8000/api/v1/user/status', {
      status: 'offline'
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
      }
    });

    sessionStorage.removeItem('access_token');
    setIsLoggingOut(false)
    // navigate('/');
    window.location.href = '/'
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    logout();
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !showDropdown;
    setShowDropdown(newState);

    // Close notifications if it's open
    if (showNotifications) {
      setShowNotifications(false);
    }
  };

  // Add a separate handler for notifications
  const toggleNotifications = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggling notifications, current state:', showNotifications);
    const newState = !showNotifications;
    setShowNotifications(newState);
    console.log('New state will be:', newState);

    // Close user dropdown if it's open
    if (showDropdown) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsUser(user);
        console.log('User data:', user);
        // Add safety check for notifications
        if (user && user.notifications) {
          setNotifications(user.notifications);
          console.log('Notifications set:', user.notifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log('Click outside detected');

      // Check if click is outside user dropdown
      const userDropdown = document.querySelector('[data-dropdown="user"]');
      if (userDropdown && !userDropdown.contains(event.target) && showDropdown) {
        console.log('Closing user dropdown');
        setShowDropdown(false);
      }

      // Check if click is outside notification dropdown
      const notificationDropdown = document.querySelector('[data-dropdown="notifications"]');
      if (notificationDropdown && !notificationDropdown.contains(event.target) && showNotifications) {
        console.log('Closing notification dropdown');
        setShowNotifications(false);
      }
    };

    // Use a small delay to prevent immediate closing due to event bubbling
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showNotifications]);

  return (
    <>
      <header className='sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <nav className='flex items-center justify-between py-6 px-8'>
          <div className='flex items-center gap-4 md:gap-8'>
            <img
              src={logo}
              alt='Logo'
              className='h-8 md:h-12 w-auto cursor-pointer transition-transform hover:scale-105'
              onClick={() => navigate('/app/profile/')}
            />

            <div className='hidden md:flex items-center gap-6'>
              <button
                onClick={() => navigate('/app/dashboard')}
                className='flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200'
              >
                <Home size={20} />
                <span className='hidden lg:inline'>Home</span>
              </button>

              <div data-dropdown="notifications" className='relative'>
                <button
                  onClick={toggleNotifications}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative'
                >
                  <Bell size={20} />
                  <span className='hidden lg:inline'>Notifications</span>
                  {notifications && notifications.length > 0 && (
                    <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full'></span>
                  )}
                </button>
                {showNotifications && (
                  <div className='absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] overflow-hidden'>
                    <div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
                      <h3 className='text-sm font-semibold text-gray-900'>
                        Notifications ({notifications ? notifications.length : 0})
                      </h3>
                    </div>
                    <div className='max-h-64 overflow-y-auto'>
                      {notifications && notifications.length > 0 ? (
                        notifications.map((notification, i) => (
                          <div
                            key={i}
                            className='px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0'
                          >
                            {notification.message}
                          </div>
                        ))
                      ) : (
                        <div className='px-4 py-3 text-sm text-gray-500 text-center'>
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/app/cart')}
                className='flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200'
              >
                <ShoppingCart size={20} />
                <span className='hidden lg:inline'>Cart</span>
              </button>
            </div>
          </div>

          <div className='flex-1 max-w-md mx-4 md:mx-8'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={18}
              />
              <input
                type='text'
                placeholder='Search products...'
                className='w-full pl-10 pr-4 py-2 md:py-3 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black'
              />
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='md:hidden flex items-center gap-2 relative'>
              <button
                onClick={() => navigate('/app/dashboard')}
                className='p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200'
              >
                <Home size={20} />
              </button>
              <div data-dropdown="notifications" className='relative'>
                <button
                  onClick={toggleNotifications}
                  className='p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative'
                >
                  <Bell size={20} />
                  {notifications && notifications.length > 0 && (
                    <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full'></span>
                  )}
                </button>
                {/* Mobile notification dropdown */}
                {showNotifications && (
                  <div className='absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] overflow-hidden'>
                    <div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
                      <h3 className='text-sm font-semibold text-gray-900'>
                        Notifications ({notifications ? notifications.length : 0})
                      </h3>
                    </div>
                    <div className='max-h-64 overflow-y-auto'>
                      {notifications && notifications.length > 0 ? (
                        notifications.map((notification, i) => (
                          <div
                            key={i}
                            className='px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0'
                          >
                            {notification.message}
                          </div>
                        ))
                      ) : (
                        <div className='px-4 py-3 text-sm text-gray-500 text-center'>
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate('/app/cart')}
                className='p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200'
              >
                <ShoppingCart size={20} />
              </button>
            </div>

            {isUser && !isLoading ? (
              <div data-dropdown="user" className='relative'>
                <button
                  onClick={toggleDropdown}
                  className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200'
                >
                  <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                    {user?.image_path ? (
                      <img
                        className='w-full h-full object-cover rounded-full'
                        src={`http://localhost:8000/storage/${user.image_path}`}
                        alt={`${user.first_name}'s profile`}
                        onError={(e) => {
                          // Fallback to default icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <User
                      size={20}
                      className={`text-gray-600 ${user?.image_path ? 'hidden' : 'block'}`}
                    />
                  </div>
                  <div className='hidden md:flex items-center gap-1'>
                    <span className='text-sm font-medium text-gray-700'>
                      {user?.middle_name
                        ? `${user?.first_name} ${user?.middle_name} ${user?.last_name}`
                        : `${user?.first_name} ${user?.last_name}`}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </button>

                {showDropdown && (
                  <div className='absolute top-12 right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden'>
                    <div className='py-2'>
                      <button
                        onClick={() => handleNavigation('/app/profile')}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        Profile Information
                      </button>
                      <button
                        onClick={() =>
                          handleNavigation('/app/profile/address')
                        }
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        My Address
                      </button>
                      <button
                        onClick={() => handleNavigation('/app/profile/purchase-history')}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        Purchase History
                      </button>
                      <button
                        onClick={() => handleNavigation('/app/shop/myshop')}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        My Shop
                      </button>
                      {user && user.role === 'shop_owner' && (
                        <button
                          onClick={() => handleNavigation('/app/shop/info-page')}
                          className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                        >
                          Item Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => handleNavigation('/app/seller/register')}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        Start Selling Here
                      </button>
                      <hr className='my-2 border-gray-200' />
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? <Loader /> : 'Logout'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to='/login'
                className='px-6 py-2 text-sm font-medium text-gray-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:text-white transition-colors duration-200'
              >
                {isLoading ? <Loader /> : 'Login'}
              </Link>
            )}
          </div>
        </nav>
      </header>
      {/* <main> */}
      {/* <Outlet /> */}
      {/* </main> */}
    </>
  );
};

export default Navbar;