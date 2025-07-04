import React from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function FloatingElements({ user, cartItemsCount }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Floating Cart Button */}
      <button
        className='fixed bottom-6 right-6 flex items-center justify-center w-16 h-16 bg-[#DDA853] text-black rounded-full hover:bg-[#183B4E] hover:text-white transition-all duration-300 hover:scale-110 z-50'
        onClick={() => navigate('/my-cart')}
      >
        <ShoppingCart size={24} />
        {cartItemsCount > 0 && (
          <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center'>
            {cartItemsCount}
          </div>
        )}
      </button>

      {/* Welcome Message */}
      {user && (
        <div className='fixed bottom-6 left-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-[#183B4E] rounded-full flex items-center justify-center'>
              <User size={20} className='text-white' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Welcome back,</p>
              <h3
                className='font-semibold text-[#183B4E] cursor-pointer hover:text-[#DDA853] transition-colors'
                onClick={() => navigate('/profile')}
              >
                {user.first_name}!
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingElements;