// Import necessary dependencies
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import { ArrowLeft, Search } from 'lucide-react'; // Icons

// FoodNav component that accepts props for search and category functionality
const FoodNav = ({ 
    searchQuery,         // Current search term
    onSearchChange,      // Function to handle search changes
    selectedCategory,    // Currently selected category
    onCategoryChange,    // Function to handle category changes
    totalResults = 0     // Number of search results (defaults to 0)
}) => {
    // Local state for input value, initialized with searchQuery prop
    const [inputValue, setInputValue] = useState(searchQuery);

    // Array of category objects for food filtering
    const categories = [
        { id: 'all', name: 'All' },
        { id: 'groceries', name: 'Groceries' },
        { id: 'prepared-meals', name: 'Prepared Meals' },
        { id: 'snacks-beverages', name: 'Snacks & Beverages' }
    ];

    // Handle form submission for search
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        onSearchChange(inputValue); // Call parent's search handler
    };

    return (
        // Main navigation container with white background and shadow
        <div className="bg-white shadow-sm">
            {/* Content container with responsive padding */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Back button section */}
                <div className="flex items-center mb-4">
                    <Link 
                        to="/" 
                        className="flex items-center text-gray-600 hover:text-[#007edf] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Search and Categories Container - column on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Search form */}
                    <form onSubmit={handleSubmit} className="relative flex-1 w-full flex gap-2">
                        {/* Input container */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search food products..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {/* Search icon */}
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        {/* Search button */}
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                    </form>

                    {/* Category buttons */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {/* Map through categories array to create buttons */}
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                // Dynamic classes - blue for selected category, gray for others
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

                {/* Search results count - only shown when there's a search query */}
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

export default FoodNav;