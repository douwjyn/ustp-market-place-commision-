import React, { useState, useEffect } from "react";
import { Home, ArrowLeft, Upload, AlertCircle, Package, Tag, Palette, DollarSign, Archive, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductInfoPage() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [itemVariation, setItemVariation] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [discount, setDiscount] = useState("0"); // Added discount state

  const [productImages, setProductImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "N/A"];
  const availableCategories = ["Clothes", "Foods", "End Devices", "Foot Wear", "Jewelry"];

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (productImages.length === 0) {
      setPreviewImages([]);
      return;
    }
    const newPreviews = productImages.map((file) => URL.createObjectURL(file));
    setPreviewImages(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [productImages]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prevImages) => [...prevImages, ...files]);
  };

  const toggleSize = (size) => {
    if (size === "N/A") {
      setSelectedSizes(["N/A"]);
    } else {
      setSelectedSizes((prev) => {
        const withoutNA = prev.filter((s) => s !== "N/A");
        return prev.includes(size)
          ? withoutNA.filter((s) => s !== size)
          : [...withoutNA, size];
      });
    }
  };

  const toggleCategory = (category) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!productName.trim()) errors.productName = "Product name is required";
    if (!productDescription.trim()) errors.productDescription = "Product description is required";
    if (categories.length === 0) errors.categories = "Please select at least one category";
    if (selectedSizes.length === 0) errors.sizes = "Please select at least one size";
    if (productImages.length === 0) errors.images = "At least one product image is required";
    if (!price.trim()) errors.price = "Price is required";
    if (parseFloat(price) <= 0) errors.price = "Price must be greater than 0";
    if (parseInt(stock) < 0) errors.stock = "Stock cannot be negative";
    if (parseFloat(discount) < 0 || parseFloat(discount) > 100) errors.discount = "Discount must be between 0 and 100"; // Added discount validation
    return errors;
  };

  const handlePublish = async () => {
    setFormSubmitted(true);
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const formData = new FormData();
        formData.append("name", productName);
        formData.append("description", productDescription);
        formData.append("variation", itemVariation);
        formData.append("color", color);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("discount", discount); // Added discount to form data

        categories.forEach((cat, index) => formData.append(`categories[${index}]`, cat));
        selectedSizes.forEach((size, index) => formData.append(`sizes[${index}]`, size));
        productImages.forEach((file) => formData.append("images[]", file));

        // Print out all form data for debugging
        for (let pair of formData.entries()) {
          console.log(pair[0] + ':', pair[1]);
        }
        await axios.post("http://localhost:8000/api/v1/own-products/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });

        // Show success modal instead of alert
        setShowSuccessModal(true);
      } catch (err) {
        console.error(err);
        alert("Failed to publish product");
      }
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/app/dashboard");
  };

  useEffect(() => {
    if (formSubmitted) {
      setFormErrors(validateForm());
    }
  }, [productName, productDescription, categories, selectedSizes, productImages, price, stock, discount, formSubmitted]);

  return (
    <main className="flex flex-col min-h-screen w-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] font-sans">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Product Submitted Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Please wait for admin confirmation. Your product will be reviewed and published once approved.
              </p>
              <button
                onClick={handleModalClose}
                className="w-full px-6 py-3 bg-[#183B4E] text-white rounded-xl hover:bg-[#DDA853] hover:text-black transition-all duration-300 font-semibold"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-[#183B4E]/90 backdrop-blur-sm text-white px-4 md:px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DDA853] flex items-center justify-center">
            <Package size={20} className="text-[#183B4E]" />
          </div>
          <h1 className="text-lg font-medium">Product Management</h1>
        </div>
        <button
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Home size={20} />
          <span className="text-sm">Dashboard</span>
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-[#183B4E] hover:text-[#DDA853] transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </nav>

          <article className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8">
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
              <p className="text-gray-600">Fill in the details below to list your product</p>
            </header>

            {/* Images */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Upload size={20} className="text-[#183B4E]" />
                <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                {formErrors.images && (
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.images}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductImages((imgs) => imgs.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="imageUpload"
                  className={`aspect-square border-2 border-dashed ${formErrors.images ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-[#183B4E] hover:bg-gray-50"
                    } rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors`}
                >
                  <Upload size={24} className="mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600 text-center px-2">Add Images</span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Upload high-quality images (recommended: 1:1 aspect ratio, max 5MB each)
              </p>
            </section>

            {/* Product Details */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={18} className="text-[#183B4E]" />
                    <label className="font-semibold text-gray-900">Product Name</label>
                    {formErrors.productName && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} /> {formErrors.productName}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className={`w-full border ${formErrors.productName ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#183B4E]"
                      } rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B4E]/20 transition-colors`}
                    placeholder="Enter a descriptive product name"
                  />
                </div>

                {/* Item Variation */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={18} className="text-[#183B4E]" />
                    <label className="font-semibold text-gray-900">Item Variation</label>
                  </div>
                  <input
                    type="text"
                    value={itemVariation}
                    onChange={(e) => setItemVariation(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#183B4E] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B4E]/20 transition-colors"
                    placeholder="e.g. Long Sleeve, Wireless"
                  />
                </div>

                {/* Color */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette size={18} className="text-[#183B4E]" />
                    <label className="font-semibold text-gray-900">Color</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 border border-gray-200 focus:border-[#183B4E] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B4E]/20 transition-colors"
                      placeholder="e.g. Red, Blue"
                    />
                    <button
                      type="button"
                      onClick={() => setColor("N/A")}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${color === "N/A"
                        ? "bg-[#183B4E] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      N/A
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={18} className="text-[#183B4E]" />
                  <label className="font-semibold text-gray-900">Product Description</label>
                  {formErrors.productDescription && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} /> {formErrors.productDescription}
                    </span>
                  )}
                </div>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className={`w-full border ${formErrors.productDescription ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#183B4E]"
                    } rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B4E]/20 transition-colors resize-none`}
                  rows={4}
                  placeholder="Describe your product in detail - features, benefits, specifications..."
                />
              </div>
            </section>

            {/* Categories */}
            <section className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-[#183B4E]" />
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                {formErrors.categories && (
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.categories}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${categories.includes(cat)
                      ? "bg-[#183B4E] text-white hover:bg-[#DDA853] hover:text-black"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Sizes */}
            <section className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} className="text-[#183B4E]" />
                <h2 className="text-lg font-semibold text-gray-900">Available Sizes</h2>
                {formErrors.sizes && (
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.sizes}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSizes.includes(size)
                      ? "bg-[#183B4E] text-white hover:bg-[#DDA853] hover:text-black"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* Price & Stock */}
            <section className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-[#183B4E]" />
                    <label className="font-semibold text-gray-900">Price (₱)</label>
                    {formErrors.price && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} /> {formErrors.price}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full border ${formErrors.price ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#183B4E]"
                      } rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B4E]/20 transition-colors`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Archive size={18} className="text-[#183B4E]" />
                    <label className="font-semibold text-gray-900">Stock Quantity</label>
                    {formErrors.stock && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} /> {formErrors.stock}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className={`w-full border ${formErrors.stock ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#183B4E]"
                      } rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B4E]/20 transition-colors`}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                {/* Discount Input */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={18} className="text-[#183B4E]" />
                    <label className="font-semibold text-gray-900">Discount (%)</label>
                    {formErrors.discount && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} /> {formErrors.discount}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className={`w-full border ${formErrors.discount ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#183B4E]"
                      } rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B4E]/20 transition-colors`}
                    placeholder="0%"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <footer className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 md:justify-end">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="px-8 py-3 bg-[#183B4E] text-white rounded-xl hover:bg-[#DDA853] hover:text-black transition-all duration-300 font-semibold hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  Publish Product
                </button>
              </div>
            </footer>
          </article>
        </div>
      </section>
    </main>
  );
}