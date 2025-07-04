import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import axios for API requests
const CreateAdminAccount = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_confirmation: '',
    email: '',
    firstName: '',
    lastName: '',
    contactNumber: '+639',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for contact number to maintain +639 prefix
    if (name === 'contactNumber') {
      if (!value.startsWith('+639')) {
        return; // Don't allow changes that remove the prefix
      }
      // Only allow numbers after +639
      const numericPart = value.slice(4);
      if (numericPart && !/^\d*$/.test(numericPart)) {
        return; // Don't allow non-numeric characters
      }
      if (numericPart.length > 9) {
        return; // Limit to 9 digits after +639
      }
    }

    setFormData((prev) => ({
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

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (
      formData.contactNumber === '+639' ||
      formData.contactNumber.length < 13
    ) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = validateStep1();

    if (isValid) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    // For a single step form, back button might go to login or do nothing
    navigate('/admin/login');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:8000/api/v1/admin/register', {
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.contactNumber,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (response.status !== 200 && response.status !== 201) {
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setErrors({ general: data.message });
        } else {
          setErrors({
            general: 'An unexpected error occurred. Please try again.',
          });
        }
        return;
      }

      setCurrentStep(4); // Move to success step
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({
          general:
            'A network error occurred. Please check your connection and try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/admin/login'); // Redirect to admin dashboard
  };

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8'>
      <div className='flex items-center'>
        <div
          className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold ${currentStep >= 1
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-110'
            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
        >
          {currentStep > 1 ? '✓' : 1}
        </div>
      </div>
    </div>
  );

  const PasswordToggleIcon = ({ show, onClick }) => (
    <button
      type='button'
      onClick={onClick}
      className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors p-1 rounded-md hover:bg-gray-100'
    >
      {show ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
        >
          <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
          <line x1='1' y1='1' x2='23' y2='23' />
        </svg>
      ) : (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
        >
          <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
          <circle cx='12' cy='12' r='3' />
        </svg>
      )}
    </button>
  );

  const renderStep1 = () => (
    <div className='w-full max-w-md mx-auto'>
      <div className='text-center mb-8'>
        <div className='w-28 h-28 mx-auto mb-6 relative rounded-full border-4 border-orange-400 overflow-hidden'>
          <img
            src='/src/assets/logo.png'
            alt='USTP Logo'
            className='absolute inset-0 w-full h-full object-contain'
          />
        </div>

        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          USTP MARKET PLACE FOR STUDENTS
        </h1>
      </div>

      <div className='bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6 sm:p-8'>
        <div className='text-center mb-4'>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1'>
            Sign Up
          </h2>
          <p className='text-xs text-gray-700 font-medium'>
            Provide Admin Account Details
          </p>
        </div>

        {renderStepIndicator()}

        <div className='space-y-4'>

          {/* Email */}
          <div>
            <label className='block text-xs font-semibold text-gray-900 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              placeholder='Enter your email address'
              value={formData.email}
              onChange={handleInputChange}
              className={`text-gray-900 w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium placeholder:text-gray-500 text-sm ${errors.email
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-300 hover:border-gray-400 bg-white/50'
                }`}
            />
            {errors.email && (
              <p className='text-red-600 text-xs mt-1 font-medium'>
                {errors.email}
              </p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className='block text-xs font-semibold text-gray-900 mb-1'>
              First Name
            </label>
            <input
              type='text'
              name='firstName'
              placeholder='Enter your First Name'
              value={formData.firstName}
              onChange={handleInputChange}
              className={`text-gray-900 w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium placeholder:text-gray-500 text-sm ${errors.firstName
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-300 hover:border-gray-400 bg-white/50'
                }`}
            />
            {errors.firstName && (
              <p className='text-red-600 text-xs mt-1 font-medium'>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className='block text-xs font-semibold text-gray-900 mb-1'>
              Last Name
            </label>
            <input
              type='text'
              name='lastName'
              placeholder='Enter your Last Name'
              value={formData.lastName}
              onChange={handleInputChange}
              className={`text-gray-900 w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium placeholder:text-gray-500 text-sm ${errors.lastName
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-300 hover:border-gray-400 bg-white/50'
                }`}
            />
            {errors.lastName && (
              <p className='text-red-600 text-xs mt-1 font-medium'>
                {errors.lastName}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className='block text-xs font-semibold text-gray-900 mb-1'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='••••••••••••'
                value={formData.password}
                onChange={handleInputChange}
                className={`text-gray-900 w-full px-3 py-2 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium placeholder:text-gray-600 text-sm ${errors.password
                  ? 'border-red-400 bg-red-50/50'
                  : 'border-gray-300 hover:border-gray-400 bg-white/50'
                  }`}
                style={{ fontSize: '14px', letterSpacing: showPassword ? 'normal' : '2px' }}
              />
              <PasswordToggleIcon
                show={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <p className='text-red-600 text-xs mt-1 font-medium'>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className='block text-xs font-semibold text-gray-900 mb-1'>
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='password_confirmation'
                placeholder='••••••••••••'
                value={formData.password_confirmation}
                onChange={handleInputChange}
                className={`text-gray-900 w-full px-3 py-2 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium placeholder:text-gray-600 text-sm ${errors.password_confirmation
                  ? 'border-red-400 bg-red-50/50'
                  : 'border-gray-300 hover:border-gray-400 bg-white/50'
                  }`}
                style={{ fontSize: '14px', letterSpacing: showConfirmPassword ? 'normal' : '2px' }}
              />
              <PasswordToggleIcon
                show={showConfirmPassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {errors.password_confirmation && (
              <p className='text-red-600 text-xs mt-1 font-medium'>
                {errors.password_confirmation}
              </p>
            )}
          </div>


          {/* Contact Number */}
          <div>
            <label className='block text-xs font-semibold text-gray-900 mb-1'>
              Contact Number
            </label>
            <input
              type='tel'
              name='contactNumber'
              placeholder='+639'
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={`text-gray-900 w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium placeholder:text-gray-500 text-sm ${errors.contactNumber
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-300 hover:border-gray-400 bg-white/50'
                }`}
            />
            {errors.contactNumber && (
              <p className='text-red-600 text-xs mt-1 font-medium'>
                {errors.contactNumber}
              </p>
            )}
          </div>
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            onClick={handleBack}
            className='flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm'
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm ${isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]'
              }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2'></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className='w-full max-w-lg mx-auto'>
      <div className='bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12 text-center'>
        <div className='w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl'>
          <svg
            className='w-12 h-12 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            strokeWidth='3'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>

        <h1 className='text-4xl font-bold text-gray-800 mb-4'>
          Registration Successful!
        </h1>

        <p className='text-lg text-gray-600 mb-8 font-medium'>
          You have successfully registered as an administrator.
        </p>

        <button
          onClick={handleBackToLogin}
          className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl'
        >
          Go to Login →
        </button>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col'>
      <div className='flex-1 flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-2xl'>
          {currentStep === 1 && renderStep1()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>

      <footer className='text-center text-gray-700 text-sm py-6 font-medium'>
        © 2025 USTP Market Place. All Rights Reserved.
      </footer>
    </div>
  );
};

export default CreateAdminAccount;
