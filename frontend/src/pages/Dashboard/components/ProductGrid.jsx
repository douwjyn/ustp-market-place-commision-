import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';
import { getProducts } from '../../../service/Products/Product';
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Loader from '../../../components/Loader';

export default function ProductGrid() {
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        // You may want to update this to use axios directly if getProducts doesn't support pagination
        const response = await axios.get(`http://localhost:8000/api/v1/products?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          }
        });
        setProducts(response.data.products.data);
        setTotalPages(response.data.products.last_page || 1);
        setTotalProducts(response.data.products.total || 0);
      } catch (err) {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [currentPage]);

  function onAddToCart(product) {
    // Handle adding product to cart
    console.log('Product added to cart:', product);
  }

  function handleViewModeChange(mode) {
    setViewMode(mode);
  }

  function handleSelectChange(category) {
    setSelectedFilter((prev) => {
      if (prev.includes(category)) {
        return prev.filter((filter) => filter !== category);
      } else {
        return [...prev, category];
      }
    });
  }

  function clearFilters() {
    setSelectedFilter([]);
    setPriceRange([0, 10000]);
  }

  // Category options
  const categoryOptions = [
    'Clothes',
    'Foot Wear',
    'Foods',
    'End devices',
    'Jewelry',
  ];

  // Filtering logic (only on current page's products)
  let filteredProducts = products.filter((product) => product.stock > 0);

  // Apply category filter
  if (selectedFilter.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      if (Array.isArray(product.categories)) {
        return product.categories.some((cat) => selectedFilter.includes(cat.name));
      }
      return false;
    });
  }

  // Apply price range filter
  filteredProducts = filteredProducts.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  const FilterSection = () => (
    <div className='bg-gray-50 p-4 rounded-lg mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Category checkboxes */}
        <div>
          <div className='font-semibold mb-3 text-black'>Categories</div>
          <div className='space-y-2'>
            {categoryOptions.map((cat) => (
              <label key={cat} className='flex items-center text-black text-sm cursor-pointer'>
                <input
                  type='checkbox'
                  checked={selectedFilter.includes(cat)}
                  onChange={() => handleSelectChange(cat)}
                  className='mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Price range slider */}
        <div>
          <div className='font-semibold mb-3 text-black'>Price Range</div>
          <div className='space-y-3'>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Min Price: ₱{priceRange[0]}</label>
              <input
                type='range'
                min={0}
                max={10000}
                step={100}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Max Price: ₱{priceRange[1]}</label>
              <input
                type='range'
                min={0}
                max={10000}
                step={100}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
            </div>
            <div className='flex justify-between text-xs text-gray-500'>
              <span>₱0</span>
              <span>₱10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter summary and clear button */}
      <div className='mt-4 pt-4 border-t border-gray-200'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-gray-600'>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          {(selectedFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
            <button
              onClick={clearFilters}
              className='text-sm text-blue-600 hover:text-blue-800 underline'
            >
              Clear all filters
            </button>
          )}
        </div>
        {selectedFilter.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-2'>
            {selectedFilter.map((filter) => (
              <span
                key={filter}
                className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
              >
                {filter}
                <button
                  onClick={() => handleSelectChange(filter)}
                  className='ml-1 text-blue-600 hover:text-blue-800'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className='bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 w-full'>
        <FilterSection />
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Package size={40} className='text-gray-400' />
            </div>
            <h3 className='text-gray-800 text-xl font-bold mb-2'>
              No products found
            </h3>
            <p className='text-gray-500 text-base leading-relaxed'>
              Try adjusting your search or filter criteria to find what you're looking for
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 w-full'>
      <FilterSection />

      <div
        className={`${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
          }`}
      >
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id || product.product_id || index}
            product={product}
            onAddToCart={onAddToCart}
            viewMode={viewMode}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}