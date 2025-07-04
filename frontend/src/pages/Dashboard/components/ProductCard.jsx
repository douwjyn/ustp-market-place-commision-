import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart, viewMode }) {
  const navigate = useNavigate();

  const getImageUrl = (productImages) => {
    if (Array.isArray(productImages) && productImages.length > 0) {
      return 'http://localhost:8000/storage/' + productImages[0].image;
    }
    // if (typeof productImages === 'string' && productImages) {
    //   return productImages;
    // }
  };

  const handleImageError = (e) => {
    e.target.src = '/src/assets/placeholder.jpg';
  };

  const getOriginalPrice = (currentPrice) => {
    return Math.round(currentPrice * 1.2);
  };

  const handleProductClick = () => {
    const productId = product.id || product.product_id;
    navigate(`/app/product/${productId}`);
  };

  const handleAddToCartClick = (e, id) => {
    e.stopPropagation();
    // onAddToCart(product)
    // 
    navigate(`/app/product/${id}`)
  };

  return viewMode === 'grid' ? (
    <article
      className='group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/90 transition-all duration-300 cursor-pointer hover:-translate-y-2'
      onClick={handleProductClick}
    >
      <div className='relative overflow-hidden aspect-square rounded-xl bg-gray-100 mb-4'>
        <img
          src={getImageUrl(product.images)}
          alt={product.name || 'Product'}
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
          onError={handleImageError}
          loading='lazy'
        />
        {/* {JSON.stringify(product.)} */}
        {product.discount > 0 &&

          <div className='absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1'>
            <Star size={12} fill='currentColor' />
            {product.discount}% OFF
          </div>
      }

        <button className='absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors'>
          <Heart size={16} className='text-gray-600 hover:text-red-500' />
        </button>
      </div>

      <div className='space-y-3'>
        <h3 className='font-semibold text-gray-900 line-clamp-2 text-sm leading-tight'>
          {product.name}
        </h3>

        <div className='space-y-1'>
          <div className='flex items-center justify-between'>
            <span className='text-[#183B4E] font-bold text-lg'>
              ₱{product.price?.toLocaleString()}
            </span>
            <span className='text-gray-400 text-sm line-through'>
              ₱{getOriginalPrice(product.price)?.toLocaleString()}
            </span>
          </div>
          <p className='text-green-600 text-xs font-medium'>
            Save ₱
            {(
              getOriginalPrice(product.price) - product.price
            )?.toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => handleAddToCartClick(product.id)}
          className='w-full flex items-center justify-center gap-2 py-2.5 bg-[#DDA853] text-black rounded-xl hover:bg-[#183B4E] hover:text-white transition-all duration-300 font-medium'
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </article>
  ) : (
    <article
      className='group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 cursor-pointer hover:-translate-y-1'
      onClick={handleProductClick}
    >
      <div className='flex gap-6'>
        <div className='relative overflow-hidden w-32 h-32 rounded-xl bg-gray-100 flex-shrink-0'>
          <img
            src={getImageUrl(
              product.image_urls || product.images || product.image
            )}
            alt={product.name || 'Product'}
            className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
            onError={handleImageError}
            loading='lazy'
          />
          <div className='absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1'>
            <Star size={10} fill='currentColor' />
            20% OFF
          </div>
        </div>

        <div className='flex-1 space-y-3'>
          <div className='flex justify-between items-start'>
            <h3 className='font-semibold text-gray-900 text-lg leading-tight'>
              {product.name}
            </h3>
            <button className='p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors'>
              <Heart size={16} className='text-gray-600 hover:text-red-500' />
            </button>
          </div>

          <p className='text-gray-600 text-sm line-clamp-2'>
            {product.description}
          </p>

          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <div className='flex items-center gap-3'>
                <span className='text-[#183B4E] font-bold text-xl'>
                  ₱{product.price?.toLocaleString()}
                </span>
                <span className='text-gray-400 text-sm line-through'>
                  ₱{getOriginalPrice(product.price)?.toLocaleString()}
                </span>
              </div>
              <p className='text-green-600 text-xs font-medium'>
                Save ₱
                {(
                  getOriginalPrice(product.price) - product.price
                )?.toLocaleString()}
              </p>
            </div>

            <button
              onClick={handleAddToCartClick}
              className='flex items-center gap-2 px-6 py-2.5 bg-[#DDA853] text-black rounded-xl hover:bg-[#183B4E] hover:text-white transition-all duration-300 font-medium'
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
