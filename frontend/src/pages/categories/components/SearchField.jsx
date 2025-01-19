// components/SearchField.jsx

import React from 'react';
import { Search } from 'lucide-react';

const SearchField = ({ 
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
    totalResults = 0
}) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Search input container */}
                <div className="relative flex-1 max-w-xl w-full">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                {/* Category buttons */}
                <div className="flex gap-2">
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
    );
};

export default SearchField;