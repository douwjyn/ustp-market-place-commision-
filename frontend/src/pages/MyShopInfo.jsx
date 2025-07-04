import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './ShopInfo.css';
import { UserContext } from '../context/UserProvider';
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
const MyShopInfo = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    idType: '',
    houseAndWard: '',
    idNumber: '',
    districtAndProvince: '',
    phoneNumber: '',
    photoId: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [canEdit, setCanEdit] = useState(true);
  const [photoIdUrl, setPhotoIdUrl] = useState(null);
  const [newPhotoId, setNewPhotoId] = useState(null);
  const [isSeller, setIsSeller] = useState(null);

  useEffect(() => {
    const checkSellerStatus = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        if (!token || user.role !== 'shop_owner') {
          setIsSeller(false);
          setLoading(false);
          return;
        }

        setIsSeller(true);
        await fetchSellerInfo();
      } catch (err) {
        console.error('Error checking seller status:', err);
        setIsSeller(false);
        setLoading(false);
      }
    };

    const fetchSellerInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/own-store/', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch seller information');

        const data = await response.json();
        setFormData({
          shopName: data.shop.name || '',
          email: data.shop.email || '',
          idType: data.shop.id_type || '',
          houseAndWard: data.shop.house_ward || '',
          idNumber: data.shop.id_number || '',
          districtAndProvince: data.shop.district_province || '',
          phoneNumber: data.shop.phone || '',
          photoId: null,
        });

        if (data.shop.image) {
          setPhotoIdUrl(data.shop.image);
        }

        setLastUpdatedAt(data.shop.updated_at);

        if (data.shop.updated_at) {
          const lastEditDate = new Date(data.shop.updated_at);
          const now = new Date();
          const diffDays = Math.floor((now - lastEditDate) / (1000 * 60 * 60 * 24));
          console.log("Days since last update:", diffDays);
          setCanEdit(diffDays >= 7);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkSellerStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoId(file);
      setFormData({
        ...formData,
        photoId: file,
      });
    }
  };

  const validateForm = () => {
    if (!formData.shopName) return 'Shop Name is required';
    if (!formData.email) return 'Email Address is required';
    if (!formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.idType) return 'ID Type is required';
    if (!formData.idNumber) return 'ID Number is required';
    if (!formData.houseAndWard) return 'House# and Ward is required';
    if (!formData.districtAndProvince) return 'District and Province is required';
    if (!formData.phoneNumber) return 'Phone Number is required';
    return null;
  };

  const handleEdit = async () => {
    setSuccess(false);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.shopName);
      data.append('email', formData.email);
      data.append('id_type', formData.idType);
      data.append('id_number', formData.idNumber);
      data.append('house_ward', formData.houseAndWard);
      data.append('district_province', formData.districtAndProvince);
      data.append('phone', formData.phoneNumber);
      data.append('user_id', user.id);

      if (newPhotoId) {
        data.append('image', newPhotoId);
      }

      // Console log the data here pls
      // console.log('Form data to be submitted:', Object.fromEntries(data.entries()));

      const response = await fetch(`http://localhost:8000/api/v1/own-store/${formData.idNumber}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update seller information');
      }

      const responseData = await response.json();
       toast.success('Shop Profile updated successfully.', {
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
      setSuccess(true);
      setIsEditing(false);
      setNewPhotoId(null);
      // navigate('/app/dashboard')
      // if (responseData.photo_id_url) {
      //   setPhotoIdUrl(responseData.photo_id_url);
      // }

      // console.log('Updated seller info:', responseData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegisterAsSeller = () => {
    navigate('/app/seller/register');
  };

  if (loading) {
    return <div className='text-center mt-12'>Loading...</div>;
  }

  if (isSeller === false) {
    return (
      <div className='flex flex-col w-screen min-h-screen font-sans'>
        <main className='flex-1 bg-[#FAEBD7]'>
          <div className='flex flex-col px-20 py-6 items-center'>
            <section className='w-full max-w-4xl bg-white rounded-2xl border border-black shadow-md p-6'>
              <div className='text-center py-12'>
                <div className='mb-6'>
                  <svg
                    className='mx-auto h-16 w-16 text-gray-400 mb-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                    />
                  </svg>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                    Access Restricted
                  </h2>
                  <p className='text-gray-600 mb-6'>
                    You are not a seller. Register first to become a seller and
                    access your shop profile.
                  </p>
                </div>

                <button
                  onClick={handleRegisterAsSeller}
                  className='px-8 py-3 bg-[#213567] text-white font-semibold rounded-lg hover:bg-[#1a2c4d] transition-colors duration-200 shadow-md'
                >
                  Register as Seller
                </button>

                <p className='text-sm text-gray-500 mt-4'>
                  Already registered? Please contact support if you believe this
                  is an error.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-screen min-h-screen font-sans'>
      <main className='flex-1 bg-[#FAEBD7]'>
        <div className='flex flex-col px-4 md:px-20 py-4 md:py-6 items-center'>
          <section className='w-full max-w-4xl bg-white rounded-2xl border border-black shadow-md p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-800'>My Shop Profile</h2>
              {canEdit && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {error && <div className='mb-4 p-3 bg-red-100 text-red-700'>{error}</div>}
            {success && <div className='mb-4 p-3 bg-green-100 text-green-700'>Profile updated successfully!</div>}

            {!canEdit && (
              <div className='mb-4 p-3 bg-yellow-100 text-yellow-700'>
                You can only edit your shop profile once every 7 days.
                {lastUpdatedAt && (
                  <span className='block text-sm mt-1'>
                    Last updated: {new Date(lastUpdatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}

            <form
              className='space-y-6'
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
            >
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='shopName'
                    className='block text-sm font-semibold text-gray-700 mb-1'
                  >
                    Shop Name
                  </label>
                  <input
                    type='text'
                    id='shopName'
                    name='shopName'
                    value={formData.shopName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } ${error && !formData.shopName ? 'border-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-semibold text-gray-700 mb-1'
                  >
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } ${error &&
                        (!formData.email || !formData.email.includes('@'))
                        ? 'border-red-500'
                        : ''
                      }`}
                  />
                </div>
              </div>

              {/* ID Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='idType'
                    className='block text-sm font-semibold text-gray-700 mb-1'
                  >
                    ID Type
                  </label>
                  <input
                    type='text'
                    id='idType'
                    name='idType'
                    value={formData.idType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } ${error && !formData.idType ? 'border-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label
                    htmlFor='idNumber'
                    className='block text-sm font-semibold text-gray-700 mb-1'
                  >
                    ID Number
                  </label>
                  <input
                    type='text'
                    id='idNumber'
                    name='idNumber'
                    value={formData.idNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } ${error && !formData.idNumber ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='houseAndWard'
                    className='block text-sm font-semibold text-gray-700 mb-1'
                  >
                    House# and Ward
                  </label>
                  <input
                    type='text'
                    id='houseAndWard'
                    name='houseAndWard'
                    placeholder='Street/Block Lot/Barangay'
                    value={formData.houseAndWard}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } ${error && !formData.houseAndWard ? 'border-red-500' : ''
                      }`}
                  />
                </div>
                <div>
                  <label
                    htmlFor='districtAndProvince'
                    className='block text-sm font-semibold text-gray-700 mb-1'
                  >
                    District and Province
                  </label>
                  <input
                    type='text'
                    id='districtAndProvince'
                    name='districtAndProvince'
                    value={formData.districtAndProvince}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 text-black border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } ${error && !formData.districtAndProvince
                        ? 'border-red-500'
                        : ''
                      }`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='phoneNumber'
                    className='block text-sm font-semibold text-gray-700 mb-1'
                  >
                    Phone Number
                  </label>
                  <div
                    className={`flex w-full border border-gray-300 rounded-lg ${!isEditing ? 'bg-gray-100' : 'bg-white'
                      } ${error && !formData.phoneNumber ? 'border-red-500' : ''
                      }`}
                  >
                    <span className='px-3 py-2 bg-gray-200 border-r border-gray-300 rounded-l-lg text-gray-700'>
                      +63
                    </span>
                    <input
                      type='tel'
                      id='phoneNumber'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`flex-1 px-4 py-2 text-black rounded-r-lg border-0 focus:ring-0 ${!isEditing
                          ? 'bg-gray-100 cursor-not-allowed'
                          : 'bg-white'
                        }`}
                    />
                  </div>
                </div>
              </div>

              {/* Photo ID Section */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>
                    Photo of Valid ID
                  </label>

                  {/* Current Photo Display */}
                  {photoIdUrl && (
                    <div className='mb-4'>
                      <p className='text-sm text-gray-600 mb-2'>
                        Current ID Photo:
                      </p>
                      <div className='border border-gray-300 rounded-lg p-4 bg-gray-50'>
                        <img
                          src={`http://localhost:8000/storage/${photoIdUrl}`}
                          alt='Current ID'
                          className='md:max-w-xs md:max-h-48 object-contain mx-auto block'
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <p
                          className='text-center text-gray-500 text-sm mt-2'
                          style={{ display: 'none' }}
                        >
                          Image not available
                        </p>
                      </div>
                    </div>
                  )}

                  {/* File Upload (only when editing) */}
                  {isEditing && (
                    <div>
                      <p className='text-sm text-gray-600 mb-2'>
                        {photoIdUrl
                          ? 'Upload new ID photo (optional):'
                          : 'Upload ID photo:'}
                      </p>
                      <div className='file-input-wrapper'>
                        <input
                          type='file'
                          id='photoId'
                          name='photoId'
                          accept='image/*'
                          onChange={handleFileChange}
                          className='hidden'
                        />
                        <button
                          type='button'
                          className='px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors'
                          onClick={() =>
                            document.getElementById('photoId').click()
                          }
                        >
                          {newPhotoId
                            ? `Selected: ${newPhotoId.name}`
                            : 'Choose File'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* You can paste the rest of your input fields here — truncated for brevity */}

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-green-600 flex text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className='mr-2' size={18} /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyShopInfo;
