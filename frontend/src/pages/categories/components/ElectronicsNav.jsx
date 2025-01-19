import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

const ElectronicsNav = ({ 
    searchQuery, 
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    totalResults = 0
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Make sure these IDs match exactly with the slugMap in electronics.js
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'tv-home-theater', name: 'TV & Home Theater' },
    { id: 'computers-smartphones', name: 'Computers & Smartphones' },
    { id: 'home-tools', name: 'Home Tools' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(inputValue);
  };

  console.log('Selected category:', selectedCategory); // Add this for debugging

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back button */}
        <div className="flex items-center mb-4">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 hover:text-[#007edf] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Search and Categories Container */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Search input */}
          <form onSubmit={handleSubmit} className="relative flex-1 w-full flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="electronics-search"
                name="electronics-search"
                placeholder="Search electronics products..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category buttons */}
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search results count */}
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            {totalResults === 0 
              ? 'No products found' 
              : `Found ${totalResults} product${totalResults === 1 ? '' : 's'}`
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectronicsNav;