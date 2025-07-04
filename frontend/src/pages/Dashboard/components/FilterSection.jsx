import React, { useState } from 'react';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import { categories, sortOptions } from '../placeholderData';

function FilterSection({
  onSearch,
  onCategoryFilter,
  onSortChange,
  viewMode,
  onViewModeChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategoryFilter(categoryId);
  };

  const handleSortChange = (sortId) => {
    setSelectedSort(sortId);
    onSortChange(sortId);
  };

  const handleViewModeChange = (mode) => {
    onViewModeChange(mode);
  };

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      <div className='bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4'>
        <div className='relative'>
          <Search
            size={20}
            className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none transition-all duration-200'
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className='bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4'>
        <div className='flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between'>
          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='lg:hidden flex items-center gap-2 px-4 py-2 bg-[#183B4E] text-white rounded-xl hover:bg-[#DDA853] hover:text-black transition-all duration-300'
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          {/* Desktop Filters */}
          <div
            className={`flex flex-col lg:flex-row gap-4 lg:items-center ${
              showFilters ? 'block' : 'hidden lg:flex'
            }`}
          >
            {/* Category Filter */}
            <div className='flex items-center gap-2'>
              <Filter size={18} className='text-[#183B4E]' />
              <label className='text-sm font-semibold text-gray-900'>
                Category:
              </label>
              <div className='relative'>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className='appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none transition-all duration-200'
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                />
              </div>
            </div>

            {/* Sort Filter */}
            <div className='flex items-center gap-2'>
              <label className='text-sm font-semibold text-gray-900'>
                Sort by:
              </label>
              <div className='relative'>
                <select
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className='appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:border-[#183B4E] focus:ring-2 focus:ring-[#183B4E]/20 focus:outline-none transition-all duration-200'
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                />
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className='flex items-center gap-2 bg-gray-100 rounded-xl p-1'>
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-[#183B4E] text-white'
                  : 'text-gray-600 hover:bg-white hover:text-[#183B4E]'
              }`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-[#183B4E] text-white'
                  : 'text-gray-600 hover:bg-white hover:text-[#183B4E]'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
