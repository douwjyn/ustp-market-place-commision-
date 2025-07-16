import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Share2, Plus, Minus, Store, MapPin, Phone, Mail, Shield } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import toast from 'react-hot-toast'

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/products/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      )
      const product = response.data.product
      setProduct(response.data.product);
      // const original = product.discount > 0
      //   ? product.price * (1 - product.discount / 100)
      //   : product.price;
      setOriginalPrice(product.price);
      const discounted = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;
      setDiscountedPrice(discounted);
      // setDiscountPercentage(Number(response.data.product.discount) || 0)
      // Fetch shop information if shop_id is available
      if (response.data.product.shop_id) {
        await fetchShopInfo(response.data.product.shop_id);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setLoading(false);
    }
  };

  const fetchShopInfo = async (shop_id) => {
    try {
      // First, get the seller info using shop_id
      const response = await axios.get(`http://localhost:8000/api/v1/store/${shop_id}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
        }
      });
      console.log('shop infor', response)
      setShopInfo(response.data.shop);
    } catch (error) {
      console.error("Failed to fetch shop info:", error);
      // Fallback: Set mock data if backend connection fails
      setShopInfo({
        shop_name: "Sample Shop",
        email: "shop@example.com",
        phone_number: "9123456789",
        house_and_ward: "123 Main Street, Barangay Centro",
        district_and_province: "Cagayan de Oro, Misamis Oriental"
      });
    }
  };

  // Fixed image handling
  const getImageUrl = (imagePath) => {
    // If no image path provided, return a working placeholder
    if (!imagePath) {
      return "https://placehold.co/400x400?text=No+Image";
    }

    // If it's already a full URL, use it
    // if (imagePath.startsWith('http')) {
    //   return imagePath;
    // }

    // For local development - adjust the base URL as needed
    // if (imagePath.startsWith('/storage/') || imagePath.startsWith('storage/')) {
    //   return `http://localhost:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    // }

    // Default case - prepend the product_images folder within storage
    return `http://localhost:8000/storage/${imagePath}`;
  };

  // FIXED: Better image array handling with proper type checking
  const getProductImages = () => {
    // if (!product) return ["/src/assets/placeholder.jpg"];

    // Helper function to ensure we get an array
    const ensureArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return []; // Return empty array for any other type (including boolean true)
    };

    // Try different possible image property names and ensure they're arrays
    // const imageUrls = ensureArray(product.image_urls);
    const images = ensureArray(product.images);
    // const singleImage = product.image ? [product.image] : [];

    // Combine all possible image sources
    // const allImages = [...images];
    // If no images found, provide a default placeholder
    if (images.length === 0) {
      return ["/src/assets/placeholder.jpg"];
    }

    return images;
  };

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    // if (alert(`${product.id}, ${selectedSize}, ${quantity}`)) return;

    // addToCart(product.id, selectedSize, quantity);
    // alert("Product added to cart!");
    // navigate('/app/cart');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/cart/add',
        {
          product_id: product.id,
          quantity: quantity,
          selected_size: selectedSize,
        }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },

      });

      // if (!response.ok) throw new Error('Failed to add item to cart');

      const result = response.data;
      console.log('Item added to backend cart:', result);
      toast.success('Added to cart.', {
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
      navigate('/app/cart');
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
    }
  };

  // NEW: Handle checkout functionality
  const handleCheckout = () => {
    if (!product) return;

    // Navigate directly to checkout page, passing the product details as state
    navigate('/checkout', {
      state: {
        buyNowProduct: {
          product,
          selectedSize,
          quantity
        }
      }
    });
  };

  // Fixed error handler with better placeholder
  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    e.target.src = "https://placehold.co/400x400?text=Image+Not+Found";
  };

  const handleContactSeller = () => {
    if (shopInfo?.phone_number) {
      window.open(`tel:+63${shopInfo.phone_number}`, '_blank');
    }
  };

  const handleEmailSeller = () => {
    if (shopInfo?.email) {
      window.open(`mailto:${shopInfo.email}`, '_blank');
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col w-screen h-screen bg-gray-50">
        {/* <Navbar /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-lg text-gray-600">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col w-screen h-screen bg-gray-50">
        {/* <Navbar /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">404</div>
            <div className="text-xl text-gray-600 mb-4">Product not found</div>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const productImages = getProductImages();
  console.log('images', productImages)

  return (
    <div className="flex flex-col w-screen h-screen font-sans bg-gray-50">
      {/* <Navbar /> */}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Products</span>
          </button>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Product Section */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                      <img
                        src={getImageUrl(productImages[selectedImageIndex].image)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={handleImageError}
                        onLoad={() => console.log("Image loaded successfully:", productImages[selectedImageIndex])}
                      />

                      {/* Image Navigation Arrows */}
                      {productImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? productImages.length - 1 : selectedImageIndex - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ArrowLeft size={20} className="text-gray-700" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(selectedImageIndex === productImages.length - 1 ? 0 : selectedImageIndex + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 rotate-180"
                          >
                            <ArrowLeft size={20} className="text-gray-700" />
                          </button>
                        </>
                      )}
                    </div>

                    {productImages.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {productImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <img
                              src={getImageUrl(image.image)}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                        <div className="flex gap-2 ml-4">
                          {/* <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`p-2 rounded-full border transition-all ${isFavorite
                              ? 'bg-red-50 border-red-200 text-red-500'
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500'
                              }`}
                          >
                            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                          </button> */}
                          {/* <button className="p-2 rounded-full border bg-gray-50 border-gray-200 text-gray-400 hover:text-blue-500 transition-colors">
                            <Share2 size={20} />
                          </button> */}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl text-blue-700 font-bold ml-2">
                              ₱{Number(discountedPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                        </span>
                        {product.discount > 0 && (
                          <>
                            <span className="text-lg text-gray-400 line-through">
                              ₱{Number(originalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-md">
                              {product.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Categories */}
                    {product.categories && Array.isArray(product.categories) && product.categories.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.categories.map((category, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                            >
                              {/* {category} */}
                              {category.name || category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">Description</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                      </div>
                    </div>

                    {/* Variation & Color */}
                    {(product.variation || product.color) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {product.variation && (
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-800">Variation</h3>
                            <div className="bg-gray-50 rounded-lg px-4 py-3">
                              <p className="text-gray-800 font-medium">{product.variation}</p>
                            </div>
                          </div>
                        )}
                        {product.color && (
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-800">Color</h3>
                            <div className="bg-gray-50 rounded-lg px-4 py-3">
                              <p className="text-gray-800 font-medium">{product.color}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sizes */}
                    {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Size</h3>
                        <div className="flex flex-wrap gap-3">
                          {product.sizes.map((size, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSize(size.name)}
                              className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all ${selectedSize === size.name
                                ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                                : 'border-gray-300 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                            >
                              {size.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">Availability</h3>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${product.stock > 0
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">Quantity</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="font-bold text-lg w-16 text-center text-gray-800 bg-gray-50">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">Max: {product.stock} items</span>
                      </div>
                    </div>

                    {/* Add to Cart Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-semibold text-gray-800">Total:</span>
                        <span className="font-bold text-2xl text-blue-600">₱{(product.price * quantity)?.toLocaleString()}</span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleAddToCart}
                          disabled={product.stock === 0}
                          className={`flex-1 py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all text-lg ${product.stock === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl'
                            }`}
                        >
                          <ShoppingCart size={22} />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        <button
                          onClick={handleCheckout}
                          disabled={product.stock === 0}
                          className={`px-6 py-4 rounded-xl font-bold transition-all text-lg ${product.stock === 0
                            ? 'border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95'
                            }`}
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Information Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
                <div className="p-6 space-y-6">
                  {/* Shop Header */}
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Store size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Shop Information</h3>
                      <p className="text-sm text-gray-600">Verified Seller</p>
                    </div>
                  </div>

                  {shopInfo ? (
                    <div className="space-y-4">
                      {/* Shop Name */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800 text-lg">{shopInfo.name}</h4>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-700">Contact Details</h5>

                        {shopInfo.user.email && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail size={18} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800">Email</p>
                              <p className="text-sm text-gray-600 break-all">{shopInfo.user.email}</p>
                            </div>
                          </div>
                        )}

                        {shopInfo.user.phone && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone size={18} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">Phone</p>
                              <p className="text-sm text-gray-600">+63 {shopInfo.user.phone}</p>
                            </div>
                          </div>
                        )}

                        {(shopInfo.house_ward || shopInfo.district_province) && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin size={18} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">Address</p>
                              <div className="text-sm text-gray-600">
                                {shopInfo.house_ward && (
                                  <p>{shopInfo.house_ward}</p>
                                )}
                                {shopInfo.district_province && (
                                  <p>{shopInfo.district_province}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Show seller ID information if available */}
                        {shopInfo.id_type && shopInfo.id_number && (
                          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <Shield size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-800">Verified Identity</p>
                              <p className="text-sm text-blue-600">{shopInfo.id_type}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        {shopInfo.phone && (
                          <button
                            onClick={handleContactSeller}
                            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Phone size={18} />
                            Call Seller
                          </button>
                        )}

                        {shopInfo.email && (
                          <button
                            onClick={handleEmailSeller}
                            className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Mail size={18} />
                            Email Seller
                          </button>
                        )}

                        <button onClick={() => navigate(`/app/shop/visit/${shopInfo.id}`)} className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                          <Store size={18} />
                          Visit Shop
                        </button>
                      </div>

                      {/* Last Updated */}
                      {shopInfo.last_updated_at && (
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Profile updated: {new Date(shopInfo.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">Loading shop information...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
