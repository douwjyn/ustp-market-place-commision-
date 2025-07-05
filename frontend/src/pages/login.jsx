import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import { Eye, EyeOff, User, Lock, XIcon } from 'lucide-react';

export default function Login() {
  const [access_token, setAccess_token] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    try {
      await api.post('/auth/login', data).then((response) => {
        console.log(response);
        setAccess_token(response.data.access_token);
        sessionStorage.setItem('access_token', response.data.access_token);

        const setOnline = async () => {
          const response = await api.post('/user/status', {
            status: 'online'
          })
        }
        setOnline()

      });
    } catch (err) {
      setError("Invalid login, please try again.");
    }
  }

  useEffect(() => {
    if (access_token) {
      window.location.href = '/app/dashboard';
    }
  }, [access_token]);

  return (
    <main
      // style={{ backgroundImage: "url('/src/assets/bg-ustp.png')" }}
      className='relative flex flex-col w-screen h-screen items-center justify-center p-4 md:p-8  bg-cover bg-center bg-no-repeat'
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
      <section className=' relative z-10 flex flex-col w-full items-center justify-center space-y-2'>
        <article className='border border-gray-200 w-full max-w-md bg-gray-100 rounded-xl p-6 md:p-8 space-y-2'>
          <div className=' space-y-2'>
            {/* <Link
              to='/'
              className='text-white bg-gray-700 rounded-sm px-2 py-1.5 text-sm hover:underline'
            >
              Home
            </Link> */}
            <header className='flex flex-col items-center mb-4'>

              <img
                src='/src/assets/logo.png'
                alt='USTP Logo'
                className='w-20'
              />
              <h1 className='text-center text-[#183B4E] tracking-wide text-3xl font-bold leading-tight'>
                USTP MARKETPLACE
              </h1>
              {/* <h2 className='text-[#183B4E]'></h2> */}
              <p className='text-gray-400 text-sm'>Welcome Back! Sign in to your account.</p>
            </header>

          </div>

          {/* Error card */}
          {error && (
            <div className='bg-red-50 border border-red-200 px-2 py-4 text-center rounded-sm  text-red-500 relative'>
              <button onClick={() => setError('')} className='absolute top-2 right-2'>
                <XIcon size={16}/>
              </button>
              {error}
            </div>

          )}

          <form
            className='space-y-4 text-[#183B4E]'
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(e);
            }}
          >
            <div className='space-y-4'>
              <div className='flex flex-col gap-2'>
                <label htmlFor='email'>Email</label>
                <div className='relative'>
                  <User
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={20}
                  />
                  <input
                    type='text'
                    placeholder='Email'
                    name='email'
                    className={`w-full pl-12 pr-4 py-3 text-black placeholder-gray-500 bg-white border ${error ? 'border-2 border-red-400' : 'border-gray-200'} rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition-colors`}
                    required
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor='password'>Password</label>
                <div className='relative'>
                  <Lock
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={20}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    name='password'
                    autoComplete='current-password'
                    className={`w-full pl-12 pr-4 py-3 text-black placeholder-gray-500 bg-white border ${error ? 'border-2 border-red-400' : 'border-gray-200'} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors`}
                    required
                  />
                  {showPassword && (
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
              </div>


              {/* {error ? error : ''} */}

            </div>


            {/* <Link
              to='/'
              className='hover:text-[#183B4E] transition-colors text-sm hover:underline'
            >
              Home
            </Link> */}
            <button
              type='submit'
              className='w-full mt-4 py-3 px-6 text-white font-semibold bg-[#183B4E] rounded-md hover:bg-[#DDA853] hover:text-black transition-all duration-300 hover:-translate-y-1'
            >
              Sign In
            </button>

            <nav className='flex text-sm text-gray-600 justify-between'>
              <Link
                to='/create-account'
                className='hover:text-[#183B4E] transition-colors'
              >
                Create account
              </Link>
              <Link
                to='/forgot-password'
                className='hover:text-[#183B4E] transition-colors'
              >
                Forgot Password?
              </Link>

            </nav>
          </form>
        </article>
      </section>
    </main>
  );
}
