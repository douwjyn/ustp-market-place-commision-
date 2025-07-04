import React, { useState, useEffect, act } from 'react';
import {
  ShoppingCart,
  Package,
  Clock,
  X,
  RotateCcw,
  Calendar,
  User,
  CheckCircle,
  Check,
  XCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import dayjs from 'dayjs';

export default function PurchaseHistory() {
  const [activeTab, setActiveTab] = useState('purchased');
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchPurchases();
  }, [activeTab, page]);

  const fetchPurchases = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/v1/user/purchases`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        }
      )
      .then((res) => {
        console.log('Fetched purchases:', res.data);
        setPurchases(res.data.purchases);
        // setLastPage(res.data.last_page);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching purchases:', err);
        setLoading(false);
      });
  };

  const handleAction = (id, action) => {
    // return alert(`Action: ${action} on purchase ID: ${id}`);
    axios
      .post(
        `http://localhost:8000/api/v1/products/${id}/purchase/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        }
      )
      .then(() => fetchPurchases());
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className='flex items-center justify-center py-16'>
          <div className='text-center'>
            <div className='relative'>
              <div className='animate-spin rounded-full h-12 w-12 border-4 border-[#183B4E]/20 border-t-[#183B4E] mx-auto mb-6'></div>
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-[#183B4E]/10 to-[#DDA853]/10 animate-pulse'></div>
            </div>
            <p className='text-gray-600 font-medium text-lg'>
              Loading your orders...
            </p>
            <p className='text-gray-500 text-sm mt-2'>
              Please wait while we fetch your purchase history
            </p>
          </div>
        </div>
      );
    }

    if (purchases.length === 0) {
      return (
        <div className='flex items-center justify-center py-16'>
          <div className='text-center max-w-md'>
            <div className='w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Package size={40} className='text-gray-400' />
            </div>
            <h3 className='text-gray-800 text-xl font-bold mb-2'>
              No purchases found
            </h3>
            <p className='text-gray-500 text-base leading-relaxed'>
              Your order history will appear here once you make your first
              purchase
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        {purchases
          .filter((item) => {
            if (activeTab === 'purchased') return true;
            if (activeTab === 'processing') return item.status === 'Processing';
            if (activeTab === 'accepted') return item.status === 'Accepted';
            if (activeTab === 'delivered') return item.status === 'Delivered';
            if (activeTab === 'cancelled') return item.status === 'Cancelled';
            if (activeTab === 'declined') return item.status === 'Declined';
            if (activeTab === 'returned') return item.status === 'Returned';
            return true;
          })
          .map((item) => (
            <article
              key={item.id}
              className='bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-8 hover:border-[#DDA853]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group'
            >
              <div className='flex flex-col lg:flex-row gap-8'>
                <div className='w-full lg:w-40 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0'>
                  <img
                    src={`http://localhost:8000/storage/${item.product.images[0].image}`}
                    alt={item.product_name}
                    className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
                  />
                </div>
                <div className='flex-grow space-y-4'>
                  <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3'>
                    <h3 className='text-gray-900 font-bold text-xl leading-tight'>
                      {item.product_name}
                    </h3>
                    <div className='text-[#DDA853] font-bold text-2xl'>
                      ₱{item.total}
                      {/* {JSON.stringify(item.total)} */}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50'>
                      <div className='w-8 h-8 bg-[#183B4E]/10 rounded-lg flex items-center justify-center'>
                        <Package size={16} className='text-[#183B4E]' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 font-medium uppercase tracking-wide'>
                          Quantity
                        </p>
                        <p className='text-gray-900 font-bold'>{item.quantity}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50'>
                      <div className='w-8 h-8 bg-[#183B4E]/10 rounded-lg flex items-center justify-center'>
                        <Clock size={16} className='text-[#183B4E]' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 font-medium uppercase tracking-wide'>
                          Status
                        </p>
                        <span
                          className={`font-bold text-sm ${
                            item.status === 'Delivered'
                              ? 'text-green-600'
                              : item.status === 'Processing'
                              ? 'text-blue-600'
                              : item.status === 'Accepted'
                              ? 'text-emerald-600'
                              : item.status === 'Cancelled'
                              ? 'text-red-600'
                              : item.status === 'Declined'
                              ? 'text-red-700'
                              : item.status === 'Returned'
                              ? 'text-orange-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50'>
                      <div className='w-8 h-8 bg-[#183B4E]/10 rounded-lg flex items-center justify-center'>
                        <Calendar size={16} className='text-[#183B4E]' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 font-medium uppercase tracking-wide'>
                          Order Date
                        </p>
                        <p className='text-gray-900 font-bold text-sm'>
                          {dayjs(item.created_at).format('MMM D, YYYY')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-4 pt-4'>
                    {item.status === 'Processing' && (
                      <button
                        onClick={() => handleAction(item.id, 'Cancelled')}
                        className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300'
                      >
                        <X size={18} />
                        Cancel Order
                      </button>
                    )}
                    {item.status === 'Accepted' && (
                      <button
                        onClick={() => handleAction(item.id, 'Returned')}
                        className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300'
                      >
                        <RotateCcw size={18} />
                        Return Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>
    );
  };

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 font-sans'>
      <div className='max-w-6xl mx-auto p-6'>
        <section className='bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden'>
          <header className='bg-gradient-to-r from-[#183B4E] to-[#DDA853] px-8 py-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                  <Package size={24} className='text-white' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white'>
                    Purchase History
                  </h1>
                  <p className='text-white/80 mt-1'>
                    Track and manage your order history
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Tabs */}
          <nav className='flex bg-gradient-to-r from-gray-50/80 to-white/50 backdrop-blur-sm'>
            {[
              'purchased',
              'processing',
              'accepted',
              'delivered',
              'cancelled',
              'declined',
              'returned',
            ].map((tab) => {
              const getTabIcon = (tabName) => {
                switch (tabName) {
                  case 'purchased':
                    return <Package size={18} />;
                  case 'processing':
                    return <Clock size={18} />;
                  case 'accepted':
                    return <Check size={18} />;
                  case 'delivered':
                    return <CheckCircle size={18} />;
                  case 'cancelled':
                    return <X size={18} />;
                  case 'declined':
                    return <XCircle size={18} />;
                  case 'returned':
                    return <RotateCcw size={18} />;
                  default:
                    return null;
                }
              };

              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`flex-1 py-4 px-3 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 ${
                    activeTab === tab
                      ? 'bg-white/90 text-[#183B4E] border-b-3 border-[#DDA853] backdrop-blur-sm'
                      : 'text-gray-600 hover:text-[#183B4E] hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  {getTabIcon(tab)}
                  <span className='hidden md:inline font-medium'>
                    {tab === 'purchased' && 'All Orders'}
                    {tab === 'processing' && 'Processing'}
                    {tab === 'accepted' && 'Accepted'}
                    {tab === 'delivered' && 'Delivered'}
                    {tab === 'cancelled' && 'Cancelled'}
                    {tab === 'declined' && 'Declined'}
                    {tab === 'returned' && 'Returned'}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div className='flex-grow overflow-auto p-8'>
            {renderTabContent()}
          </div>

          {/* Pagination */}
          <footer className='flex justify-between items-center p-8 bg-gradient-to-r from-gray-50/80 to-white/50 backdrop-blur-sm border-t border-white/30'>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className='px-6 py-3 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300'
            >
              Previous
            </button>
            <div className='flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50'>
              <span className='text-sm text-gray-700 font-semibold'>
                Page {page} of {lastPage}
              </span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
              disabled={page === lastPage}
              className='px-6 py-3 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300'
            >
              Next
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}