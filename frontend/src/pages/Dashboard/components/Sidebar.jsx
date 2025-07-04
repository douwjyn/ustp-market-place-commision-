import React from 'react';

function Sidebar() {
  return (
    <aside className='hidden lg:block w-64 flex-shrink-0'>
      <div className='sticky top-6'>
        <div className='bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 h-80'>
          <img
            src='/src/assets/ad.jpg'
            alt='Advertisement'
            className='object-cover w-full h-full rounded-xl'
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
