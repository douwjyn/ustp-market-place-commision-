import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'
import { User, Mail, Lock, Calendar, MapPin, Users, ArrowLeft, ArrowRight } from 'lucide-react';

function CreateAccount() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Step 1 State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirm] = useState('');
  const [email, setEmail] = useState('');

  // Step 2 State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (password !== confirmpassword) {
        // alert('Passwords do not match!');
        toast.error('Password does not match')
        return;
      }
      setStep(2);
    } else {
      try {
        // console.log({
        //   username,
        //   email,
        //   password,
        //   password_confirmation: confirmpassword,
        //   first_name: firstName,
        //   last_name: lastName,
        //   birthdate,
        //   address,
        //   city,
        //   state,
        //   gender,
        //   phone_number: phoneNumber,
        // });

        // Send the registration request to Laravel
        const response = await axios.post(
          'http://localhost:8000/api/v1/auth/register',
          {
            email,
            password,
            password_confirmation: confirmpassword,
            first_name: firstName,
            last_name: lastName,
            birthdate,
            address,
            city,
            state,
            gender,
            phone: phoneNumber,
          }
        );

        console.log(response.data);
        navigate('/thank-you');
      } catch (error) {
        // console.log(error)
        toast.error(
          `${error.response.data.message}`
          // 'Registration failed. Please check the console for more details.'
        );
      }
    }
  };

  return (
    <main
      style={{ backgroundImage: "url('/src/assets/bg-ustp.png')" }}
      className="flex w-screen h-screen bg-cover bg-center bg-no-repeat items-center justify-center p-4 md:p-8 overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 "
        style={{
          backgroundImage: "url('/src/assets/bg-ustp.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
        }}
      />
      <section className='relative z-50 flex w-full items-center justify-center gap-8 lg:gap-16 h-full'>
        {step !== 2 &&
          <aside className='hidden lg:flex flex-col text-left text-[#DDA853] font-extrabold text-4xl xl:text-5xl leading-tight'>
            <div>YOUR</div>
            <div>JOURNEY</div>
            <div>BEGINS HERE</div>
          </aside>
        }

        <article className={`${step == 2 ? 'w-full max-w-4xl h-full max-h-[90vh]' : 'w-full max-w-lg'} bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 animate-fade-in ${step === 2 ? 'overflow-y-auto' : ''}`}>
          <header className='text-center mb-4'>
            <h1 className='text-3xl md:text-4xl font-bold text-[#183B4E] mb-2'>
              Create Account
            </h1>
            <p className='text-gray-600'>
              Step {step} of 2:{' '}
              {step === 1 ? 'Account Credentials' : 'Personal Details'}
            </p>
          </header>

          <nav className='flex mb-4 justify-center gap-2'>
            <div
              className={`w-3 h-3 rounded-full transition-colors ${step === 1 ? 'bg-[#183B4E]' : 'bg-gray-300'
                }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full transition-colors ${step === 2 ? 'bg-[#183B4E]' : 'bg-gray-300'
                }`}
            ></div>
          </nav>

          <form onSubmit={handleSubmit} className={step === 2 ? 'space-y-3' : 'space-y-4'}>
            {step === 1 && (
              <div className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <Mail
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='email'
                      placeholder='Enter your email address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Password
                  </label>
                  <div className='relative'>
                    <Lock
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='password'
                      placeholder='Enter your password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <Lock
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='password'
                      placeholder='Confirm your password'
                      value={confirmpassword}
                      onChange={(e) => setConfirm(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* First Name */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    First Name
                  </label>
                  <div className='relative'>
                    <User
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='text'
                      placeholder='Enter your first name'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Last Name
                  </label>
                  <div className='relative'>
                    <User
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='text'
                      placeholder='Enter your last name'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Date of Birth
                  </label>
                  <div className='relative'>
                    <Calendar
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='date'
                      value={birthdate}
                      onChange={(e) => setDob(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Gender
                  </label>
                  <div className='relative'>
                    <Users
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors appearance-none'
                      required
                    >
                      <option value=''>Select Gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                      <option value='Other'>Other</option>
                    </select>
                  </div>
                </div>

                {/* Phone Number */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Phone Number
                  </label>
                  <div className='relative'>
                    <User
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='tel'
                      placeholder='Enter your phone number'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    City
                  </label>
                  <div className='relative'>
                    <MapPin
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='text'
                      placeholder='Enter your city'
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                {/* State */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    State
                  </label>
                  <div className='relative'>
                    <MapPin
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='text'
                      placeholder='Enter your state'
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>

                {/* Address - Full width */}
                <div className='flex flex-col gap-2 md:col-span-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Address
                  </label>
                  <div className='relative'>
                    <MapPin
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                    <input
                      type='text'
                      placeholder='Enter your address'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 text-black border border-gray-200 rounded-xl focus:border-[#183B4E] focus:outline-none transition-colors'
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='flex gap-4 mt-6 pt-4'>
              <button
                type='button'
                onClick={() => step == 2 ? setStep(1) : navigate(-1)}
                className='flex items-center justify-center gap-2 px-6 py-3 text-[#183B4E] font-semibold bg-white border-2 border-[#183B4E] rounded-xl hover:bg-[#183B4E] hover:text-white transition-all duration-300'
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                type='submit'
                className='flex items-center justify-center gap-2 flex-1 py-3 text-white font-semibold bg-[#183B4E] rounded-xl hover:bg-[#DDA853] hover:text-black transition-all duration-300 hover:-translate-y-1'
              >
                {step === 1 ? (
                  <>
                    Continue
                    <ArrowRight size={20} />
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}

export default CreateAccount;