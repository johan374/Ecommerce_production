import React, { useState, useEffect } from 'react';
import { productAPI } from '../../api/products';
import ProductCard from '../../pages/categories/components/ProductCard';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productImageIndices, setProductImageIndices] = useState({});

    // Default fallback image (ensure this path is correct)
    const DEFAULT_IMAGE = '/assets/default-product.png';

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productAPI.getFeaturedProducts();
                const productsData = response.data.data?.results || response.data.results || response.data;
            } catch (error) {
                console.error('Detailed error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    stack: error.stack
                });
                setError(`Failed to load featured products: ${error.message}`);
            }
        };
    
        fetchFeaturedProducts();
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="relative bg-gray-900 flex justify-center items-center h-96">
                <p className="text-white">Loading featured products...</p>
            </div>
        );
    }
    
    // Error state
    if (error) {
        return (
            <div className="relative bg-gray-900 flex justify-center items-center h-96">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75" />
            
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Featured Products
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Discover our most popular and trending items
                    </p>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                ...product,
                                // Explicitly set image URL with fallback
                                image_url: product.image_url || DEFAULT_IMAGE
                            }}
                            currentImageIndex={productImageIndices[product.id] || 0}
                            onUpdateImageIndex={(newIndex) => {
                                setProductImageIndices(prev => ({
                                    ...prev,
                                    [product.id]: newIndex
                                }));
                            }}
                        />
                    ))}
                </div>
    
                <div className="mt-12 text-center">
                    <Link 
                        to="/shop" 
                        className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all transform hover:scale-105 inline-block"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;