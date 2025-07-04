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
          <h1 className='text-center text-[#183B4E] font-bold tracking-wide text-xl md:text-2xl lg:text-3xl leading-tight'>
            USTP MARKET PLACE FOR STUDENTS
          </h1>
        </header>

        <section className='flex flex-col items-center text-center space-y-6'>
          <h2 className='text-[#22336c] font-extrabold text-2xl md:text-3xl lg:text-4xl'>
            Welcome Trailblazer!
          </h2>
          <p className='text-[#22336c] text-base md:text-lg leading-relaxed font-medium px-4 md:px-8'>
            Welcome to the USTP Marketplace!
          </p>

          <nav className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-full items-center pt-4'>
            <Link to='/login' className='w-full'>
              <button className='w-full md:w-64 px-8 py-4 text-white font-semibold text-base md:text-lg bg-[#22336c] rounded-xl transition-all hover:bg-[#DDA853] hover:text-black duration-300 hover:-translate-y-1'>
                Login
              </button>
            </Link>

            <Link to='/create-account' className='w-full'>
              <button className='w-full md:w-64 px-8 py-4 text-[#22336c] font-semibold text-base md:text-lg bg-white border-2 border-[#22336c] rounded-xl transition-all hover:bg-[#22336c] hover:text-white duration-300 hover:-translate-y-1'>
                Start Registration
              </button>
            </Link>

            <Link to='/admin/login' className='w-full'>
              <button className='w-full md:w-64 px-8 py-4 text-[#DDA853] font-semibold text-base md:text-lg bg-transparent border-2 border-[#DDA853] rounded-xl transition-all hover:bg-[#DDA853] hover:text-black duration-300 hover:-translate-y-1'>
                Login as Admin
              </button>
            </Link>
          </nav>
        </section>
      </main>
    </div>
  );
}
