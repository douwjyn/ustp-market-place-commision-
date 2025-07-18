import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../pages/Dashboard/components/ProductCard';
import Pagination from '../components/Pagination';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:8000/api/v1/products/search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}`, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
        },
    })
      .then(res =>{
        const products = res.data.products;
        setResults(products.data || []);
        setTotalPages(products.last_page || 1);
        setTotalResults(products.total || 0);
      })
      .catch(err => setError('Failed to fetch search results'))
      .finally(() => setLoading(false));
  }, [searchTerm, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-8">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-blue-700 drop-shadow">Search Results</h1>
        <div className="text-center text-gray-600 mb-8">
          Showing results for: <span className="text-blue-600 font-semibold">{searchTerm}</span>
          {totalResults > 0 && (
            <span className="ml-2 text-gray-400">({totalResults} found)</span>
          )}
        </div>
        {loading && <div className="text-center py-10 text-lg font-medium">Loading...</div>}
        {error && <div className="text-center text-red-500 py-10">{error}</div>}
        {!loading && !error && results.length === 0 && (
          <div className="text-center text-gray-500 py-10">No results found.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {results.length > 0 && results.map((item, idx) => (
            <ProductCard key={item.id || idx} product={item} viewMode="grid" />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Search;
