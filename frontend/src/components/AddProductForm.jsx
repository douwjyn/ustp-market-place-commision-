import React, { useState } from 'react';
import axios from 'axios';

function AddProductForm({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) formData.append('image', image);

    axios.post('http://localhost:8000/api/products', formData)
      .then((response) => {
        console.log('Product added:', response.data);
        setName('');
        setPrice('');
        setImage(null);

        if (onProductAdded) onProductAdded(); // 🔁 Refresh product list
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border rounded p-2"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="border rounded p-2"
      />
      <button
        type="submit"
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProductForm;
