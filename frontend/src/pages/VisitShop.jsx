import { useEffect, useState } from "react";
import { ArrowLeft, Store, MapPin, Phone, Mail, Shield, Star, Heart, ShoppingCart, Grid, List, Search, Filter } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function VisitShop() {
    const [shopInfo, setShopInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        fetchShopInfo()
    }, [])

    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            return "https://placehold.co/400x400?text=No+Image";
        }
        return `http://localhost:8000/storage/${imagePath}`;
    };

    const fetchShopInfo = async (shop_id = id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/store/${shop_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
                }
            });

            console.log('shop info', response);

            const shopData = response.data.shop;
            setShopInfo(shopData);

            if (shopData.products && Array.isArray(shopData.products)) {
                setProducts(shopData.products);
            }

            setLoading(false);
            setProductsLoading(false);

        } catch (error) {
            console.error("Failed to fetch shop info:", error);
            setLoading(false);
            setProductsLoading(false);

            // setShopInfo({
            //     name: "Sample Shop",
            //     email: "shop@example.com",
            //     phone: "9123456789",
            //     house_ward: "123 Main Street, Barangay Centro",
            //     district_province: "Cagayan de Oro, Misamis Oriental"
            // });
        }
    };

    const handleContactSeller = () => {
        if (shopInfo?.phone) {
            // Remove any non-digit characters and format the phone number
            const cleanPhone = shopInfo.phone.replace(/\D/g, '');
            window.open(`tel:${shopInfo.phone}`, '_blank');
        }
    };

    const handleEmailSeller = () => {
        if (shopInfo?.email) {
            window.open(`mailto:${shopInfo.email}`, '_blank');
        }
    };

    const handleProductClick = (productId) => {
        // alert(`Navigate to product ${productId}`);
        navigate(`/app/product/${productId}`);
    };

    const goBack = () => {
        // alert('Navigate back');
        // navigate(`/app/product-info/${productId}`);
        navigate(`/app/dashboard`)
    };

    const categories = ['all', ...new Set(products.flatMap(product =>
        product.categories?.map(cat => cat.name || cat) || []
    ))];

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                product.categories?.some(cat => (cat.name || cat) === selectedCategory);
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.price || 0) - (b.price || 0);
                case 'price-high':
                    return (b.price || 0) - (a.price || 0);
                case 'name':
                    return (a.name || '').localeCompare(b.name || '');
                default:
                    return (b.id || 0) - (a.id || 0); // newest first
            }
        });

    if (loading) {
        return (
            <div className="flex flex-col w-screen h-screen bg-gray-50">
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <div className="text-lg text-gray-600">Loading shop...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!shopInfo) {
        return (
            <div className="flex flex-col w-screen h-screen bg-gray-50">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl text-gray-300 mb-4">404</div>
                        <div className="text-xl text-gray-600 mb-4">Shop not found</div>
                        <button
                            onClick={goBack}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-screen h-screen font-sans bg-gray-50">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Back Button */}
                    <button
                        onClick={goBack}
                        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>

                    {/* Shop Header */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="relative bg-gradient-to-r from-yellow-600 to-orange-600 p-8 text-white">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                                    {shopInfo.image ? (
                                        <img
                                            src={getImageUrl(shopInfo.image)}
                                            alt={shopInfo.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <Store size={36} className="text-white" style={{ display: shopInfo.image ? 'none' : 'block' }} />
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{shopInfo.name}</h1>
                                    <div className="flex items-center gap-4 text-white/90">
                                        {/* <div className="flex items-center gap-1">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-medium">4.8</span>
                                            <span className="text-sm">(128 reviews)</span>
                                        </div> */}
                                        <div className="flex items-center gap-1">
                                            <Shield size={16} />
                                            <span className="text-sm">Verified Seller</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {shopInfo.phone && (
                                        <button
                                            onClick={handleContactSeller}
                                            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
                                        >
                                            <Phone size={18} />
                                            Call
                                        </button>
                                    )}
                                    {shopInfo.email && (
                                        <button
                                            onClick={handleEmailSeller}
                                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <Mail size={18} />
                                            Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shop Details */}
                        <div className="p-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-800 text-lg">Contact Information</h3>

                                    {shopInfo.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail size={18} className="text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium text-gray-800">{shopInfo.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {shopInfo.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone size={18} className="text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-medium text-gray-800">{shopInfo.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-800 text-lg">Address</h3>

                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-gray-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Location</p>
                                            <div className="font-medium text-gray-800">
                                                {shopInfo.house_ward && <p>{shopInfo.house_ward}</p>}
                                                {shopInfo.district_province && <p>{shopInfo.district_province}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shop Stats */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-800 text-lg">Shop Statistics</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                                            <p className="text-sm text-gray-600">Products</p>
                                        </div>
                                        {/* <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">4.8</p>
                                            <p className="text-sm text-gray-600">Rating</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Products Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-2xl font-bold text-gray-800">Shop Products</h2>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Filters */}
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {category === 'all' ? 'All Categories' : category}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="newest">Newest</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="name">Name A-Z</option>
                                        </select>

                                        {/* View Mode Toggle */}
                                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <Grid size={18} />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <List size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        <div className="p-6">
                            {productsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading products...</span>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl text-gray-300 mb-4">📦</div>
                                    <div className="text-xl text-gray-600 mb-2">No products found</div>
                                    <p className="text-gray-500">Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid'
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                    : "space-y-4"
                                }>
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductClick(product.id)}
                                            className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${viewMode === 'list' ? 'flex gap-4 p-4' : ''
                                                }`}
                                        >
                                            <div className={viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}>
                                                <img
                                                    src={getImageUrl(product.images?.[0]?.image)}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    onError={(e) => {
                                                        e.target.src = "https://placehold.co/400x400?text=No+Image";
                                                    }}
                                                />
                                            </div>

                                            <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>

                                                    {product.categories && product.categories.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {product.categories.slice(0, 2).map((category, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                                                                >
                                                                    {category.name || category}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mt-2' : 'mt-4'}`}>
                                                    <div>
                                                        <p className="text-lg font-bold text-blue-600">₱{product.price?.toLocaleString() || 'N/A'}</p>
                                                        <p className="text-sm text-gray-500">{product.stock || 0} in stock</p>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                                            <ShoppingCart size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}