import React, { useState } from 'react';
import styles from './AddLogin.module.css';
import pancakes from '../assets/logo.png';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserProvider';

const AdLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = React.useContext(UserContext);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (ev) => {
    ev.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/admin/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      sessionStorage.setItem('access_token', data.access_token);


      // navigate('/admin/dashboard');
      // window.location.href= '/admin/dashboard'
      window.location.reload()
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
        'A network error occurred. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Card Header */}
        <div className="bg-[#22336c] p-6 text-center">
          <img 
            src={pancakes} 
            alt='USTP Logo' 
            className="w-20 h-20 mx-auto mb-3 object-contain" 
          />
          <h1 className="text-white font-bold text-xl">USTP MARKETPLACE</h1>
          <h2 className="text-[#DDA853] text-sm font-medium mt-1">Administrator Portal</h2>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-gray-700 placeholder-gray-400 bg-gray-50 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#22336c] focus:border-transparent outline-none transition-colors`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 text-gray-700 placeholder-gray-400 bg-gray-50 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#22336c] focus:border-transparent outline-none transition-colors`}
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#22336c] hover:bg-[#1a2a56] text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-4 flex justify-between text-sm">
            <a 
              href="/forgot-password" 
              className="text-gray-500 hover:text-[#DDA853] transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">© 2025 USTP Marketplace. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdLogin;