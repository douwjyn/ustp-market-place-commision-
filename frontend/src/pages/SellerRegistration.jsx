import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Navbar';

function SellerRegistration() {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className='flex flex-col overflow-hidden w-screen h-screen font-sans'>
      {/* Navbar component */}

      {/* Main Content */}
      <main className='flex-1 overflow-auto bg-[#FAEBD7] p-8 flex justify-center items-center'>
        <section className='w-full max-w-2xl bg-white rounded-xl shadow-md border border-black p-10'>
          <div className='text-center'>
            <h2 className='text-2xl font-medium text-[#213567]'>
              You have to register as a Seller before you can proceed to operate
              this platform. Thank you for your understanding.
            </h2>

            {/* Registration Button */}
            <div className='mt-10'>
              <button
                type='button'
                className='px-8 py-3 text-white bg-[#213567] rounded-md hover:bg-[#1a2c4d] font-medium text-lg'
                onClick={() => navigate('/app/seller/registration')} // Link to /seller-registration
              >
                Start Registration
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SellerRegistration;
