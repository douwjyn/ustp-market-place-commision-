// Placeholder product data for the marketplace
export const placeholderProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro Max",
    description: "Latest Apple smartphone with advanced camera system and A16 Bionic chip",
    price: 65000,
    category: "Electronics",
    stock: 15,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.8,
    views: 1250,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen and exceptional camera quality",
    price: 58000,
    category: "Electronics",
    stock: 8,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.7,
    views: 980,
    created_at: "2024-01-20T14:15:00Z"
  },
  {
    id: 3,
    name: "MacBook Air M2",
    description: "Lightweight laptop with Apple M2 chip, perfect for productivity and creativity",
    price: 75000,
    category: "Electronics",
    stock: 5,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.9,
    views: 2100,
    created_at: "2024-01-10T09:45:00Z"
  },
  {
    id: 4,
    name: "Nike Air Jordan 1",
    description: "Classic basketball sneakers with premium leather construction",
    price: 8500,
    category: "Fashion",
    stock: 25,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.6,
    views: 750,
    created_at: "2024-01-25T16:20:00Z"
  },
  {
    id: 5,
    name: "Adidas Ultraboost 22",
    description: "High-performance running shoes with responsive cushioning",
    price: 9200,
    category: "Fashion",
    stock: 18,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.5,
    views: 620,
    created_at: "2024-01-22T11:30:00Z"
  },
  {
    id: 6,
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-fit jeans made from premium denim",
    price: 3500,
    category: "Fashion",
    stock: 30,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.4,
    views: 890,
    created_at: "2024-01-18T13:45:00Z"
  },
  {
    id: 7,
    name: "IKEA MALM Bed Frame",
    description: "Modern bed frame with clean lines and storage options",
    price: 12000,
    category: "Home & Garden",
    stock: 12,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.3,
    views: 450,
    created_at: "2024-01-12T08:15:00Z"
  },
  {
    id: 8,
    name: "Philips Air Fryer",
    description: "Healthy cooking appliance that fries with little to no oil",
    price: 6800,
    category: "Home & Garden",
    stock: 20,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.7,
    views: 1100,
    created_at: "2024-01-28T15:00:00Z"
  },
  {
    id: 9,
    name: "Dyson V15 Detect",
    description: "Powerful cordless vacuum with laser dust detection",
    price: 32000,
    category: "Home & Garden",
    stock: 7,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.8,
    views: 1800,
    created_at: "2024-01-05T12:20:00Z"
  },
  {
    id: 10,
    name: "Sony WH-1000XM5",
    description: "Premium noise-canceling wireless headphones",
    price: 18500,
    category: "Electronics",
    stock: 14,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.9,
    views: 1650,
    created_at: "2024-01-30T10:10:00Z"
  },
  {
    id: 11,
    name: "Uniqlo Heattech Shirt",
    description: "Thermal underwear that keeps you warm in cold weather",
    price: 890,
    category: "Fashion",
    stock: 50,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.2,
    views: 320,
    created_at: "2024-01-14T17:30:00Z"
  },
  {
    id: 12,
    name: "Nintendo Switch OLED",
    description: "Gaming console with vibrant OLED screen and enhanced audio",
    price: 19500,
    category: "Electronics",
    stock: 10,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.8,
    views: 2200,
    created_at: "2024-01-08T14:45:00Z"
  },
  {
    id: 13,
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-functional pressure cooker for quick and easy meals",
    price: 5500,
    category: "Home & Garden",
    stock: 16,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.6,
    views: 780,
    created_at: "2024-01-26T09:20:00Z"
  },
  {
    id: 14,
    name: "Ray-Ban Aviator Sunglasses",
    description: "Classic aviator sunglasses with UV protection",
    price: 7200,
    category: "Fashion",
    stock: 22,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.5,
    views: 560,
    created_at: "2024-01-21T11:15:00Z"
  },
  {
    id: 15,
    name: "Kindle Paperwhite",
    description: "Waterproof e-reader with adjustable warm light",
    price: 6500,
    category: "Electronics",
    stock: 19,
    image_urls: ["/src/assets/placeholder.jpg"],
    rating: 4.7,
    views: 920,
    created_at: "2024-01-17T16:40:00Z"
  }
];

export const categories = [
  { id: 'all', name: 'All Categories', count: 15 },
  { id: 'electronics', name: 'Electronics', count: 6 },
  { id: 'fashion', name: 'Fashion', count: 5 },
  { id: 'home & garden', name: 'Home & Garden', count: 4 }
];

export const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' }
];