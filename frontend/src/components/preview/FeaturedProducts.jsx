// Import necessary dependencies
// React and its hooks for component functionality
import React, { useState, useEffect} from 'react';
// API service for fetching product data
import { productAPI } from '../../api/products';
// ProductCard component for displaying individual products
import ProductCard from '../../pages/categories/components/ProductCard';
import { Link } from 'react-router-dom';


const FeaturedProducts = () => {
    // State Management
    // Array to store featured products data
    const [featuredProducts, setFeaturedProducts] = useState([]);
    // Boolean to track loading state
    const [isLoading, setIsLoading] = useState(true);
    // Store any error messages
    const [error, setError] = useState(null);
    // Object to track current image index for each product
    // Format: { productId: currentImageIndex }
    const [productImageIndices, setProductImageIndices] = useState({});

    // Effect hook to fetch products when component mounts
    useEffect(() => {
        // Async function to fetch featured products
        const fetchFeaturedProducts = async () => {
            try {
                // Set loading state before fetch
                setIsLoading(true);
                
                // Get products from API
                const response = await productAPI.getFeaturedProducts();
                
                // Handle different response structures
                // Try different paths to get the results array
                const productsData = response.data.data?.results || response.data.results || response.data;
                
                // Validate and process the data
                if (Array.isArray(productsData)) {
                    // Map through products and ensure each has an image_url
                    const processedProducts = productsData.map(product => ({
                        ...product,
                        // Provide fallback for missing images
                        image_url: product.image_url || "default-image.png"
                    }));
                    // Update state with processed products
                    setFeaturedProducts(processedProducts);
                } else {
                    // Throw error if data structure is invalid
                    throw new Error('Unable to parse product data');
                }
            } catch (error) {
                // Log error and update error state
                console.error('Error fetching featured products:', error);
                setError('Failed to load featured products');
            } finally {
                // Always set loading to false when done
                setIsLoading(false);
            }
        };
        
        // Execute the fetch function
        fetchFeaturedProducts();
    }, []); // Empty dependency array means this runs once on mount

    // Loading state UI
    if (isLoading) {
        return (
            <div className="relative bg-gray-900 flex justify-center items-center h-96">
                <p className="text-white">Loading featured products...</p>
            </div>
        );
    }
    
    // Error state UI
    if (error) {
        return (
            <div className="relative bg-gray-900 flex justify-center items-center h-96">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Main render
    return (
        // Main container with dark background
        <div className="relative bg-gray-900">
            {/* Gradient overlay background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75" />
            
            {/* Content container with responsive padding */}
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                {/* Header section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Featured Products
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Discover our most popular and trending items
                    </p>
                </div>
    
                {/* Products grid - responsive layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Map through products and render ProductCard for each */}
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            // Get current image index for this product (or 0 if not set)
                            currentImageIndex={productImageIndices[product.id] || 0}
                            // Handler to update image index for this specific product
                            onUpdateImageIndex={(newIndex) => {
                                setProductImageIndices(prev => ({
                                    ...prev,
                                    [product.id]: newIndex
                                }));
                            }}
                        />
                    ))}
                </div>
    
                {/* View all products button */}
                <div className="mt-12 text-center">
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
                    <Link to="/shop" className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
                        View All Products
                    </Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;