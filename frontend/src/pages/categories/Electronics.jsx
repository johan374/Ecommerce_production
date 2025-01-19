// Electronics.jsx
// Import necessary dependencies from React and custom components
import React, { useState, useEffect } from 'react';
import { electronicsAPI } from '../../api/electronics'; // Custom API service for electronics
import ProductCard from './components/ProductCard'; // Component to display individual products
import Pagination from './components/pagination'; // Component for page navigation
import ElectronicsNav from './components/ElectronicsNav'; // Navigation component specific to electronics

function Electronics() {
    // State management using hooks
    const [products, setProducts] = useState([]); // Store list of products
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Store any error messages
    const [productImageIndices, setProductImageIndices] = useState({}); // Track current image index for each product's carousel
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [searchQuery, setSearchQuery] = useState(''); // Store search term
    const [selectedCategory, setSelectedCategory] = useState('all'); // Store selected category

    // Function to fetch products based on page, search term, and category
    const fetchProducts = async (page, search = '', category = 'all') => {
        try {
            // Set loading state to true to show loading spinner/message
            setIsLoading(true);
            
            // Declare response variable to store API result
            let response;
            
            // Conditional logic to determine which API endpoint to call
            if (search) {
                // If there's a search term, call search API
                response = await electronicsAPI.searchElectronics(search, page);
            } else if (category !== 'all') {
                // If no search but category is selected, call category API
                response = await electronicsAPI.getElectronicsBySubcategory(category, page);
            } else {
                // If no search and no category, get all products
                response = await electronicsAPI.getAllElectronics(page);
            }
            
            // Check if response has the expected data structure
            // The '?.' is optional chaining - safely checks if properties exist
            if (response?.data?.results) {
                // Transform the API response data
                const processedProducts = response.data.results.map(product => ({
                    ...product,
                    image_url: product.image_url || "/path/to/default/image.png"  // Keep as image_url
                }));
                
                // Update state with processed products
                setProducts(processedProducts);
                
                // Calculate total pages by dividing total count by items per page (12)
                // Math.ceil rounds up to ensure partial pages are counted
                setTotalPages(Math.ceil(response.data.count / 12));
            } else {
                // If response doesn't have expected structure, throw error
                throw new Error('Invalid response format');
            }
            
            // After successful operation, set loading to false
            setIsLoading(false);
        
        } catch (error) {
            // If any error occurs in the try block:
            
            // Log the full error to console for debugging
            console.error('Error fetching electronics:', error);
            
            // Set user-friendly error message in state
            setError('Failed to load electronics products');
            
            // Make sure to turn off loading state even if there's an error
            setIsLoading(false);
        }
    };

    // Effect hook to fetch products when filters change
    // Effect runs when any of these values change
    useEffect(() => {
        fetchProducts(currentPage, searchQuery, selectedCategory);
        //"re-run this effect up there if any of these values change in the array below"
    }, [currentPage, searchQuery, selectedCategory]);

    // Handler for search input changes
    const handleSearch = (term) => {
        setSearchQuery(term); // Update the search term state
        setCurrentPage(1);  // Reset page back to 1
    };

    // Handler for category changes
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when changing category
        setSearchQuery(''); // Clear search when changing category
    };

    // Handler for pagination changes
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0); // Scroll to top when changing page
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="pt-16 min-h-screen bg-gray-100 flex justify-center items-center">
                <p>Loading electronics products...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="pt-16 min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Main component return with nested JSX
    return (
    // Main container with padding-top-16, minimum full screen height, and gray background
    <div className="pt-16 min-h-screen bg-gray-100">
        {/* Navigation component with search and filtering */}
        <ElectronicsNav 
            searchQuery={searchQuery}          // Current search term
            onSearchChange={handleSearch}      // Search handler function
            selectedCategory={selectedCategory} // Current category
            onCategoryChange={handleCategoryChange} // Category change handler
            totalResults={products.length}     // Number of products found
        />

        {/* Content container with max width and responsive padding */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Header section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900">Electronics</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Discover our latest electronics and gadgets
                </p>
            </div>

            {/* Product grid - responsive columns: 
                - 1 column on mobile
                - 3 columns on medium screens
                - 4 columns on large screens 
            */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Map through products array to create product cards */}
                {/*This loops through each product in our products array*/}
                {products.map((product) => (
                    <ProductCard
                        key={product.id}  // Unique key for React list rendering
                        product={product}  // Pass product data
                        // Get current image index for this product's carousel
                        currentImageIndex={productImageIndices[product.id] || 0}
                        // Handler for updating image carousel
                        onUpdateImageIndex={(newIndex) => {
                            setProductImageIndices(prev => ({
                                ...prev,  // Keep previous indices
                                [product.id]: newIndex  // Update just this product's index
                            }));
                        }}
                    />
                ))}
            </div>

            {/* Show pagination only if there's more than one page */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Show "no products" message if no results and not loading */}
            {products.length === 0 && !isLoading && (
                <div className="text-center py-8">
                    <p className="text-gray-600">
                        {searchQuery 
                            ? `No electronics found matching "${searchQuery}"` // Show search term
                            : "No electronics products available."  // Generic message
                        }
                    </p>
                </div>
            )}
        </div>
    </div>
    );
}

export default Electronics;