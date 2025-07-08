import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Settings,
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import toast from 'react-hot-toast'
import { updateMe } from '../service/User';
import { useUser } from '../context/UserProvider';

function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const { setUser } = useUser();
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [image, setImage] = useState(null); // This will store the actual File object
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [lastEditDate, setLastEditDate] = useState(null);
  const [canEdit, setCanEdit] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Original values to revert if cancelled
  const [originalValues, setOriginalValues] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      axios
        .get('http://localhost:8000/api/v1/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data.user;
          const profileData = {
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone_number: data.phone || '',
            // gender: data.gender || '',
            dob: data.birthdate || '',
          };

          setFirstName(profileData.first_name);
          setLastName(profileData.last_name);
          setEmail(profileData.email);
          setPhoneNumber(profileData.phone_number);
          setGender(profileData.gender);
          setDateOfBirth(profileData.dob);

          // Check last edit date
          if (data.updated_at) {
            const lastEdit = new Date(data.updated_at);
            setLastEditDate(lastEdit);
            checkEditPermission(lastEdit);
          }

          if (data.image_path) {
            const imageUrl = data.image_path.startsWith('http')
              ? data.image_path
              : `http://localhost:8000/storage/${data.image_path}`;
            setExistingImageUrl(imageUrl);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch profile:', err);
        });
    }
  }, []);

  // Check if user can edit (6 days cooldown)
  const checkEditPermission = (lastEdit) => {
    if (!lastEdit) {
      setCanEdit(true);
      return;
    }

    const now = new Date();
    const diffTime = now - lastEdit;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0) {
      setCanEdit(true);
      setTimeRemaining('');
    } else {
      setCanEdit(false);
      const remainingDays = 6 - diffDays;
      setTimeRemaining(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
    }
  };

  // Update time remaining every hour
  useEffect(() => {
    if (lastEditDate && !canEdit) {
      const interval = setInterval(() => {
        checkEditPermission(lastEditDate);
      }, 3600000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [lastEditDate, canEdit]);

  const handleEditClick = () => {
    if (!canEdit) return;

    // Store original values for cancel functionality
    setOriginalValues({
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
    });

    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Revert to original values
    setFirstName(originalValues.firstName);
    setLastName(originalValues.lastName);
    setEmail(originalValues.email);
    setPhoneNumber(originalValues.phoneNumber);
    setGender(originalValues.gender);
    setDateOfBirth(originalValues.dateOfBirth);

    // Reset image states
    setImage(null);
    setPreviewUrl(null);
    setCompletedCrop(null);

    setIsEditing(false);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!isEditing) return;
      
      const file = acceptedFiles[0];
      if (!file) return;
      
      // Ensure we have a proper File object
      if (!(file instanceof File)) {
        console.error('Selected item is not a valid file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB.');
        return;
      }

      // Reset previous crop settings
      setCompletedCrop(null);
      setCrop({ aspect: 1 / 1 });
      
      // Store the actual file object
      setImage(file);
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [isEditing]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    disabled: !isEditing,
  });

  const handleImageLoaded = useCallback((img) => {
    setImgRef(img);
  }, []);

  const getCroppedImage = () => {
    return new Promise((resolve) => {
      if (!completedCrop || !imgRef) {
        console.log('No crop or image reference available');
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      const scaleX = imgRef.naturalWidth / imgRef.width;
      const scaleY = imgRef.naturalHeight / imgRef.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imgRef,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a proper File object with a unique name
            const fileName = `cropped-profile-${Date.now()}.jpg`;
            const file = new File([blob], fileName, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            console.log('Created cropped file:', file);
            resolve(file);
          } else {
            console.log('Failed to create blob from canvas');
            resolve(null);
          }
        },
        'image/jpeg',
        0.9 // Quality setting
      );
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);
      formData.append('gender', gender);
      formData.append('dob', dateOfBirth);

      // Handle image upload - ensure we're sending a proper File object
      if (image && image instanceof File) {
        if (completedCrop && previewUrl && imgRef) {
          // Use cropped image if crop is available
          const croppedImage = await getCroppedImage();
          if (croppedImage && croppedImage instanceof File) {
            console.log('Appending cropped image:', croppedImage);
            formData.append('image_path', croppedImage, croppedImage.name);
          } else {
            console.log('Appending original image (crop failed):', image);
            formData.append('image_path', image, image.name);
          }
        } else {
          // Use original image file if no crop
          console.log('Appending original image:', image);
          formData.append('image_path', image, image.name);
        }
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (key === 'image_path') {
          console.log(`${key}:`, value, 'Type:', typeof value, 'Is File:', value instanceof File);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const res = await updateMe(formData);
      toast.success('Profile updated successfully.');

      const now = new Date();
      setLastEditDate(now);
      setIsEditing(false);
      setCanEdit(false);
      checkEditPermission(now);

      if (res.user?.image_path) {
        const imageUrl = res.user.image_path.startsWith('http')
          ? res.user.image_path
          : `http://localhost:8000/storage/${res.user.image_path}`;
        setExistingImageUrl(imageUrl);
      }

      setUser(res.user);

      // Reset image states
      setImage(null);
      setPreviewUrl(null);
      setCompletedCrop(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 font-sans'>
      <div className='max-w-6xl mx-auto p-6'>
        <section className='bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden'>
          <header className='bg-gradient-to-r from-[#183B4E] to-[#DDA853] px-8 py-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                  <User size={24} className='text-white' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white'>
                    Profile Information
                  </h1>
                  <p className='text-white/80 mt-1'>
                    Manage your personal details and preferences
                  </p>
                </div>
              </div>

              {!isEditing && (
                <div className='flex items-center gap-4'>
                  {!canEdit && (
                    <div className='flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-xl'>
                      <Shield size={16} className='text-red-200' />
                      <span className='text-sm text-red-200'>
                        Can edit again in {timeRemaining}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleEditClick}
                    disabled={!canEdit}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${canEdit
                      ? 'bg-white text-[#183B4E] hover:bg-gray-100 hover:-translate-y-1'
                      : 'bg-gray-400/50 text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                </div>
              )}
              {isEditing && (
                <div className='flex gap-3'>
                  <button
                    onClick={handleCancelEdit}
                    className='flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 font-medium'
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className='flex items-center gap-2 px-6 py-3 bg-white text-[#183B4E] rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold hover:-translate-y-1'
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className='p-8 space-y-8'>
            {/* Personal Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <User size={18} className='text-[#183B4E]' />
                  <label className='text-sm font-semibold text-gray-900'>
                    First Name
                  </label>
                </div>
                <input
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder='Enter your first name'
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${!isEditing
                    ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none'
                    }`}
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <User size={18} className='text-[#183B4E]' />
                  <label className='text-sm font-semibold text-gray-900'>
                    Last Name
                  </label>
                </div>
                <input
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Enter your last name'
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${!isEditing
                    ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none'
                    }`}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className='space-y-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Mail size={18} className='text-[#183B4E]' />
                  <label className='text-sm font-semibold text-gray-900'>
                    Email Address
                  </label>
                  <div className='flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full'>
                    <Shield size={12} className='text-gray-500' />
                    <span className='text-xs text-gray-500'>Protected</span>
                  </div>
                </div>
                <input
                  type='email'
                  value={email}
                  disabled
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed'
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Phone size={18} className='text-[#183B4E]' />
                  <label className='text-sm font-semibold text-gray-900'>
                    Phone Number
                  </label>
                </div>
                <input
                  type='text'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder='Enter your phone number'
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${!isEditing
                    ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none'
                    }`}
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Calendar size={18} className='text-[#183B4E]' />
                  <label className='text-sm font-semibold text-gray-900'>
                    Date of Birth
                  </label>
                </div>
                <input
                  type='date'
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${!isEditing
                    ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none'
                    }`}
                />
              </div>
            </div>

            {/* Profile Image Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-2'>
                <Camera size={18} className='text-[#183B4E]' />
                <label className='text-sm font-semibold text-gray-900'>
                  Profile Picture
                </label>
              </div>

              <div className='flex justify-center'>
                <div className='relative'>
                  <div className='w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                    {previewUrl || existingImageUrl ? (
                      <img
                        src={previewUrl || existingImageUrl}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='hw-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                        <User size={48} className='text-gray-400' />
                      </div>
                    )}
                  </div>

                  {/* Camera Icon Overlay */}
                  {isEditing && (
                    <div
                      {...getRootProps()}
                      className='absolute bottom-2 right-2 cursor-pointer'
                    >
                      <input {...getInputProps()} />
                      <div className='w-12 h-12 bg-[#183B4E] rounded-full flex items-center justify-center hover:bg-[#DDA853] transition-all duration-300 hover:scale-110'>
                        <Camera size={20} className='text-white' />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className='text-center'>
                  <p className='text-sm text-gray-600 mb-2'>
                    Click the camera icon to upload a new profile picture
                  </p>
                  <p className='text-xs text-gray-500'>
                    Recommended: Square image, max 10MB
                  </p>
                </div>
              )}

              {!isEditing && !existingImageUrl && !previewUrl && (
                <div className='text-center'>
                  <p className='text-sm text-gray-500'>
                    No profile picture set
                  </p>
                </div>
              )}
            </div>

            {/* Image Cropping Section */}
            {previewUrl && isEditing && (
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Settings size={18} className='text-[#183B4E]' />
                  <h3 className='text-sm font-semibold text-gray-900'>
                    Crop Your Image
                  </h3>
                </div>
                <div className='flex justify-center'>
                  <div className='max-w-md bg-white rounded-xl border border-gray-200 p-4'>
                    <ReactCrop
                      src={previewUrl}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      onImageLoaded={handleImageLoaded}
                      aspect={1}
                      circularCrop
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;