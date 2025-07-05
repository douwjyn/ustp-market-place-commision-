import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className='flex flex-col h-screen w-screen items-center justify-center'>
      <main className='flex flex-col p-2 md:p-12 lg:p-16 bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] rounded-3xl animate-fade-in items-center justify-center backdrop-blur-sm border border-white/20'>


        <header className='flex flex-col items-center mb-8 md:mb-12'>
          <img
            src={logo}
            alt='USTP Logo'
            className='w-32 md:w-40 lg:w-44 mb-6 transition-transform hover:scale-105'
          />
          <h1 className='text-center text-[#183B4E] font-bold tracking-wide text-2xl md:text-3xl lg:text-4xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#22336c] to-[#DDA853]'>
            USTP MARKETPLACE FOR STUDENTS
          </h1>
        </header>

        <section className='flex flex-col items-center text-center space-y-6'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#22336c] to-[#DDA853]'>
            Welcome Trailblazer!
          </h2>
          <p className='text-[#22336c]/90 text-lg md:text-xl leading-relaxed font-medium max-w-2xl'>
            Discover, connect and trade in the official USTP Marketplace designed just for you!
          </p>

          <nav className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-3xl pt-6'>
            <Link
              to='/login'
              className='transform transition-all hover:scale-105 duration-200'
            >
              <button className='w-full px-8 py-4 text-white font-bold text-lg bg-[#22336c] rounded-lg shadow-sm hover:shadow-[#22336c]/40 hover:bg-[#1a2a56] transition-all duration-300 flex items-center justify-center gap-2'>
                <span>Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>

            <Link
              to='/create-account'
              className='transform transition-all hover:scale-105 duration-200'
            >
              <button className='w-full px-8 py-4 text-[#22336c] font-bold text-lg bg-white border-2 border-[#22336c] rounded-lg shadow-sm hover:shadow-[#22336c]/30 hover:bg-[#22336c] hover:text-white transition-all duration-300 flex items-center justify-center gap-2'>
                <span>Registration</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </Link>

            <Link
              to='/admin/login'
              className='transform transition-all hover:scale-105 duration-200'
            >
              <button className='w-full px-8 py-4 font-bold text-lg bg-transparent border-2 border-[#DDA853] text-[#DDA853] rounded-lg shadow-sm hover:shadow-[#DDA853]/30 hover:bg-[#DDA853] hover:text-white transition-all duration-200 flex items-center justify-center gap-2'>
                <span>Admin Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
          </nav>
        </section>
        {/* Footer note */}
        {/* <div className='text-center py-4 text-[#22336c]/60 text-sm'>
          Connecting USTP students since 2023
        </div> */}
      </main>
    </div>
  );
}
