import HeroSection from './components/HeroSection';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';

function BuyerDashboard() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 font-sans'>
      <div className='p-6 md:p-8 lg:p-12 space-y-8'>
        <HeroSection />
        <div className='flex flex-1 gap-6 max-w-7xl mx-auto'>
          <ProductGrid />
        </div>
      </div>
    </main>
  );
}

export default BuyerDashboard;
