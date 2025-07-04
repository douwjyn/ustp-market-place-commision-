import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopInfo.css';

const ShopInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id_type: '',
    house_ward: '',
    id_number: '',
    district_province: '',
    image: null,
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAlreadySeller, setIsAlreadySeller] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/user/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('www', data)

        if (data.user.role === 'shop_owner') {
          setIsAlreadySeller(true);
          if (data.shop) {
            setSellerInfo(data.shop);
          }
        }
      }
    } catch (err) {
      console.error('Error checking seller status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name) return 'Shop Name is required';
    if (!formData.email) return 'Email Address is required';
    if (!formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.id_type) return 'ID Type is required';
    if (!formData.id_number) return 'ID Number is required';
    if (!formData.house_ward) return 'House# and Ward is required';
    if (!formData.district_province) return 'District and Province is required';
    if (!formData.phone) return 'Phone Number is required';
    // image is nullable, so no required check
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/own-store',
        {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        if (response.status === 409) {
          throw new Error('You are already registered as a seller.');
        }
        throw new Error(resData.message || 'Registration failed.');
      }

      const resData = await response.json();
      setSuccess(true);
      console.log('Registered seller:', resData);
    } catch (err) {
      setError(err.message);
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/app/seller/register');
  };

  const handleGoToDashboard = () => {
    navigate('/seller-dashboard');
  };

  if (isLoading) {
    return (
      <div className='flex flex-col w-screen h-screen shop-profile-container'>
        <div className='shop-profile-card'>
          <div className='loading-message'>
            <p>Checking your seller status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAlreadySeller) {
    return (
      <div className='flex flex-col w-screen h-screen shop-profile-container'>
        <div className='shop-profile-card'>
          <button className='back-button' onClick={handleBack}>
            Back
          </button>

          <div className='already-seller-message'>
            <h2>You're already registered as a seller!</h2>
            <p style={{ color: '#000' }}>
              Shop Name:{' '}
              <strong style={{ color: '#000' }}>{sellerInfo?.name}</strong>
            </p>
            <p style={{ color: '#000' }}>
              Email:{' '}
              <strong style={{ color: '#000' }}>{sellerInfo?.email}</strong>
            </p>

            <div className='button-group'>
              <button
                className='submit-button'
                onClick={() => navigate('/app/dashboard')}
              >
                Go to Dashboard
              </button>
              <button className='back-button' onClick={handleBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-screen h-screen shop-profile-container'>
      <div className='shop-profile-card'>
        <button className='back-button' onClick={handleBack}>
          Back
        </button>

        <h1 className='shop-profile-title'>Shop Profile Information</h1>

        {success ? (
          <div className='success-message'>
            <h2>Registration Successful!</h2>
            <p>Your shop has been registered successfully.</p>
            <button
              className='submit-button'
              onClick={() => window.location.href = '/app/dashboard'}
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='profile-form'>
            {error && <div className='error-message'>{error}</div>}

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='name'>Shop Name</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Input'
                  value={formData.name}
                  onChange={handleInputChange}
                  className={error && !formData.name ? 'input-error' : ''}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email Address</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Input'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={error && (!formData.email || !formData.email.includes('@')) ? 'input-error' : ''}
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='id_type'>ID Type</label>
                <input
                  type='text'
                  id='id_type'
                  name='id_type'
                  value={formData.id_type}
                  onChange={handleInputChange}
                  className={error && !formData.id_type ? 'input-error' : ''}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='house_ward'>House# and Ward</label>
                <input
                  type='text'
                  id='house_ward'
                  name='house_ward'
                  placeholder='Street/Block Lot/Barangay'
                  value={formData.house_ward}
                  onChange={handleInputChange}
                  className={error && !formData.house_ward ? 'input-error' : ''}
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='id_number'>ID Number</label>
                <input
                  type='text'
                  id='id_number'
                  name='id_number'
                  value={formData.id_number}
                  onChange={handleInputChange}
                  className={error && !formData.id_number ? 'input-error' : ''}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='district_province'>District and Province</label>
                <input
                  type='text'
                  id='district_province'
                  name='district_province'
                  value={formData.district_province}
                  onChange={handleInputChange}
                  className={error && !formData.district_province ? 'input-error' : ''}
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='image'>Photo of the valid ID</label>
                <div className='file-input-wrapper'>
                  <input
                    type='file'
                    id='image'
                    name='image'
                    onChange={handleFileChange}
                    className='file-input'
                  />
                  <button
                    type='button'
                    className={`upload-button ${error && !formData.image ? 'input-error' : ''}`}
                    onClick={() => document.getElementById('image').click()}
                  >
                    Upload Image
                  </button>
                  {formData.image && (
                    <span className='file-name'>{formData.image.name}</span>
                  )}
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='phone'>Phone Number</label>
                <div
                  className={`phone-input ${error && !formData.phone ? 'input-error' : ''}`}
                >
                  <span className='phone-prefix'>+63</span>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='phone-number-input'
                  />
                </div>
              </div>
            </div>

            <div className='submit-container'>
              <button
                type='submit'
                className='submit-button'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShopInfo;
