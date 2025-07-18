import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Show up to 5 page numbers, with ... if needed
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  if (end - start < 4) {
    if (start === 1) end = Math.min(start + 4, totalPages);
    if (end === totalPages) start = Math.max(end - 4, 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex justify-center mt-8">
      <ul className="inline-flex items-center gap-1">
        <li>
          <button
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-l-lg border bg-white text-gray-500 hover:bg-blue-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </button>
        </li>
        {start > 1 && (
          <li>
            <button className="px-3 py-1 border bg-white" onClick={() => onPageChange(1)}>1</button>
            {start > 2 && <span className="px-2">...</span>}
          </li>
        )}
        {pages.map(page => (
          <li key={page}>
            <button
              className={`px-3 py-1 border bg-white ${page === currentPage ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-100'}`}
              onClick={() => onPageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          </li>
        ))}
        {end < totalPages && (
          <li>
            {end < totalPages - 1 && <span className="px-2">...</span>}
            <button className="px-3 py-1 border bg-white" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </li>
        )}
        <li>
          <button
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-r-lg border bg-white text-gray-500 hover:bg-blue-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
