import React, { useState, useEffect } from 'react'
import { Outlet, Navigate, useLocation, useNavigate, } from 'react-router-dom'
import { useUser } from '../context/UserProvider'
import axios from 'axios'
export default function AdminLayout() {
    const { user } = useUser();
    const navigate = useNavigate()
    const [showNotifications, setShowNotifications] = useState();
    const [showUserDropdown, setShowUserDropdown] = useState();
    // return alert(JSON.stringify(user))
    const [notifications, setNotifications] = useState();
    const location = useLocation();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/admin/notifications', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                }
            });
            setNotifications(response.data.notifications_limited); // or response.data.notifications if your API returns { notifications: [...] }
            // console.log(response.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };


    useEffect(() => {
        fetchNotifications()
    }, []);
    if (!sessionStorage.getItem('access_token')) {
        // Not logged in yet, or user info not loaded
        return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
    }

    // if (!sessionStorage.getItem('access_token')) {
    //     return <Navigate to="/" state={{ from: location }} replace />;
    // }

    if (!user || user.role !== 'admin') {
        // Not an admin, redirect to home or login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    const handleNavigate = (route) => {
        navigate(route)
    }

    const logoutHandler = () => {
        sessionStorage.removeItem('access_token');
        navigate('/');
    };

    const filteredNotifs = []

    const defineFilteredNotifs = () => {

        for (let i = 0; i < 5; i++) {
            filteredNotifs.push(notifications[i])
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Left side - USTP Logo */}
                    <div className="flex flex-row items-center gap-4">
                        <div className="relative w-16 h-16 mb-2">
                            <img
                                src="/src/assets/logo.png"
                                alt="USTP Logo"
                                className="absolute inset-0 w-full h-full object-contain rounded-full "
                            />
                        </div>
                        <div className="text-center">
                            <h1 className="text-lg font-bold text-blue-900 leading-tight">USTP MARKETPLACE</h1>
                            <h2 className="text-sm font-semibold text-blue-900">FOR STUDENTS</h2>
                        </div>
                    </div>


                    {/* Right side - User Profile and Notification */}
                    <div className="flex items-center space-x-4">
                        {/* Notification Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-full bg-gray-50/50 hover:bg-gray-100/50 border border-gray-200/50 text-gray-600 hover:text-gray-800 transition-all duration-200 backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19ZM17 11C17 8.2 14.8 6 12 6S7 8.2 7 11V18H17V11Z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 z-50">
                                    <div className="p-5">
                                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Notifications</h3>
                                        <div className="space-y-3">
                                            {notifications && notifications.length > 0 ? notifications.map((notif) => (
                                                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                                                    <p className="text-sm text-gray-700">{notif.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notif.created_at}</p>
                                                </div>
                                            )) : <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                                                <p className="text-sm text-gray-700">No recent notifications</p>
                                                {/* <p className="text-xs text-gray-500 mt-1">{notif.created_at}</p> */}
                                            </div>}
                                            {/* <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                        <p className="text-sm text-gray-700">New product publish request</p>
                        <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                        <p className="text-sm text-gray-700">Order #1234 needs approval</p>
                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
                        <p className="text-sm text-gray-700">New user registration</p>
                        <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                      </div> */}
                                        </div>
                                        <button onClick={() => {
                                            setShowNotifications(false)
                                            // setActiveTab('activity')
                                            navigate('/admin/all-notifications')
                                        }

                                        } className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors">
                                            View All
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-50/50 hover:bg-gray-100/50 border border-gray-200/50 transition-all duration-200 backdrop-blur-sm"
                            >
                                <span className="text-sm font-medium text-gray-700">Admin</span>
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* User Dropdown Menu */}
                            {showUserDropdown && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 z-50">
                                    <div className="py-2">
                                        <button onClick={() => handleNavigate('/admin/profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50/50 transition-colors">
                                            Profile
                                        </button>

                                        <button onClick={() => handleNavigate('/admin/account')} className="w-full text-left px-4 py-2 text-sm text-gray-700 font-medium hover:bg-blue-50/50 transition-colors">
                                            Account
                                        </button>
                                        <hr className="my-1 border-gray-200/50" />
                                        <button onClick={logoutHandler} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors">
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <Outlet />
        </div>
    );
}