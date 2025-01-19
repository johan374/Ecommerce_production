// Import necessary dependencies from React and custom modules
import React, { useState, useEffect } from 'react';
import { productAPI } from '../../api/products';  // Custom API service for products
import ProductCard from './ProductCard';  // Child component for displaying individual products

const FeaturedProducts = () => {
    // State management using hooks
    const [products, setProducts] = useState([]); // Stores the list of products
    const [isLoading, setIsLoading] = useState(true); // Tracks loading state
    const [error, setError] = useState(null); // Stores any error messages
    const [productImageIndices, setProductImageIndices] = useState({}); // Tracks current image index for each product

    // Async function to fetch featured products from the API
    const fetchFeaturedProducts = async () => {
        try {
            setIsLoading(true); // Set loading state before API call
            const response = await productAPI.getFeaturedProducts();
            
            // Check if response contains valid data
            if (response?.data?.results) {
                // Process each product, ensuring it has an image_url
                const processedProducts = response.data.results.map(product => ({
                    ...product,
                    // Use provided image_url or fallback to default image
                    image_url: product.image_url || "/path/to/default/image.png"
                }));
                setProducts(processedProducts);
            } else {
                throw new Error('Unable to parse product data');
            }
        } catch (error) {
            console.error('Error fetching featured products:', error);
            setError(error.message);
        } finally {
            setIsLoading(false); // Reset loading state regardless of outcome
        }
    };

    // Effect hook to fetch products when component mounts
    useEffect(() => {
        fetchFeaturedProducts();
    }, []); // Empty dependency array means this runs once on mount

    // Conditional rendering based on component state
    // Show loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p>Loading featured products...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Show empty state when no products are available
    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p>No featured products available.</p>
            </div>
        );
    }

    // Main render: Display products grid
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                    Featured Products
                </h2>
                {/* Responsive grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Map through products array to render ProductCard components */}
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            // Track current image index for product galleries
                            currentImageIndex={productImageIndices[product.id] || 0}
                            // Callback to update image index for product galleries
                            onUpdateImageIndex={(newIndex) => {
                                setProductImageIndices(prev => ({
                                    ...prev,
                                    [product.id]: newIndex
                                }));
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;