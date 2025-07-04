import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserProvider';

export default function HeroSection() {
  const { user } = useUser();
  const [isSeller, setIsSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (user?.role === import.meta.env.VITE_SHOP_OWNER_ROLE) {
        setIsSeller(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 max-w-7xl mx-auto'>
      <div>
        <h1 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
          Marketplace
        </h1>
        <p className='text-gray-600 text-sm md:text-base'>
          Discover amazing products from local sellers
        </p>
      </div>
      {isSeller && !isLoading && (
        <nav>
          <button
            onClick={() => navigate('/app/add-product')}
            className='flex items-center gap-2 px-6 py-3 bg-[#183B4E] text-white rounded-xl hover:bg-[#DDA853] hover:text-black transition-all duration-300 font-semibold hover:-translate-y-1'
          >
            <Package size={20} />
            Add Product
          </button>
        </nav>
      )}
    </header>
  );
}
