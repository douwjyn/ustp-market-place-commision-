import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios'
export default function AdminAccountPage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '+639',
  });
  const [errors, setErrors] = useState({});
  const [showImageError, setShowImageError] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get('/admin/profile', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });

        setFormData({
          name: response.data.first_name,
          address: response.data.address,
          email: response.data.email,
          mobile: response.data.phone,
        });


        // Set initial image preview if available
        if (response.data.image_path) {
          setImagePreview(response.data.image_path);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile validation
    if (!formData.mobile || formData.mobile === '+639') {
      newErrors.mobile = 'Mobile number is required';
    } else if (formData.mobile.length < 13) {
      newErrors.mobile = 'Mobile number must be complete (+639XXXXXXXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === 'mobile') {
      // Ensure mobile always starts with +639
      if (!value.startsWith('+639')) {
        value = '+639';
      }

      // Only allow numbers after +639
      const numberPart = value.slice(4);
      if (numberPart && !/^\d*$/.test(numberPart)) {
        setErrors(prev => ({
          ...prev,
          mobile: 'Please enter a valid mobile number starting with +639...'
        }));
        return;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.mobile;
          return newErrors;
        });
      }

      // Limit total length (including +639)
      if (value.length > 13) {
        value = value.slice(0, 13);
      }
    }

    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (event) => {
    if (!isEditMode) {
      setShowImageError(true);
      setTimeout(() => setShowImageError(false), 4000);
      return;
    }

    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitToAPI = async (data) => {
    try {
      const formData = new FormData();

      formData.append('first_name', data.first_name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);

      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

    
      const response = await axios.post('http://localhost:8000/api/v1/admin/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        },
      });

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const submitData = {
        first_name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.mobile,
        profileImage: profileImage,
      };

      const result = await submitToAPI(submitData);

      setSubmitSuccess(true);
      setIsEditMode(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Submit error:', error);
      setErrors({
        submit: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setErrors({});
    setSubmitSuccess(false);
    // Reset image preview to original if available
    // You might want to fetch the original image again here
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <main className="p-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex gap-6 h-full">
            <div className="flex-1 min-w-0">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 p-8 h-full">
                <button
                  onClick={() => navigate(-1)}
                  className='text-gray-700 text-sm mb-4 shadow-sm rounded-sm px-2 py-1.5 hover:bg-gray-100 transition-colors'
                >
                  Back
                </button>

                {/* Success Message */}
                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800 font-medium">Profile updated successfully! please refresh the page</span>
                    </div>
                  </div>
                )}

                {/* Global Error Message */}
                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-800">{errors.submit}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 h-full">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-72 h-96 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 backdrop-blur-sm relative overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview.startsWith('profile_images/') ? `http://localhost:8000/storage/${imagePreview}` : imagePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      ) : (
                        <>
                          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500 font-medium">
                            {isEditMode ? 'Add Image' : 'Edit Profile to Add Image'}
                          </span>
                        </>
                      )}
                      {isEditMode && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      )}
                    </div>
                    {showImageError && (
                      <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        Please click 'Edit Profile' before updating your profile picture.
                      </div>
                    )}
                    {errors.image && (
                      <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        {errors.image}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        disabled={!isEditMode}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed ${errors.name ? 'border-red-300' : 'border-gray-200'
                          }`}
                      />
                      {errors.name && (
                        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        disabled={!isEditMode}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed ${errors.email ? 'border-red-300' : 'border-gray-200'
                          }`}
                      />
                      {errors.email && (
                        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Mobile (#)</label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        placeholder="Enter your mobile number"
                        disabled={!isEditMode}
                        onKeyDown={(e) => {
                          // Prevent deletion of +639 prefix
                          if ((e.key === 'Backspace' || e.key === 'Delete') &&
                            e.target.selectionStart <= 4 && e.target.selectionEnd <= 4) {
                            e.preventDefault();
                          }
                        }}
                        onFocus={(e) => {
                          // Set cursor after +639 if field is empty beyond prefix
                          if (e.target.value === '+639') {
                            setTimeout(() => e.target.setSelectionRange(4, 4), 0);
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed ${errors.mobile ? 'border-red-300' : 'border-gray-200'
                          }`}
                      />
                      {errors.mobile && (
                        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                          {errors.mobile}
                        </div>
                      )}
                    </div>

                    <div className="pt-6">
                      {!isEditMode ? (
                        <button
                          onClick={() => setIsEditMode(true)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-4">
                          <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                          >
                            {isLoading && (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            )}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-700 px-8 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}