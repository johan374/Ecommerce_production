import React, { useState, useEffect } from 'react';
import { productAPI } from '../../api/products';
import ProductCard from '../../pages/categories/components/ProductCard';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productImageIndices, setProductImageIndices] = useState({});

    const DEFAULT_IMAGE = '/api/placeholder/400/320';
    const PRODUCTS_TO_SHOW = 12;

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching featured products...');
                
                const response = await productAPI.getFeaturedProducts();
                console.log('API Response:', response);
                
                const productsData = response.data.data?.results || response.data.results || response.data;
                
                if (Array.isArray(productsData)) {
                    // Process and limit to 12 products
                    const processedProducts = productsData
                        .slice(0, PRODUCTS_TO_SHOW)
                        .map(product => ({
                            ...product,
                            image_url: product.image_url || DEFAULT_IMAGE
                        }));

                    // If we have fewer than 12 products, fill with placeholders
                    const productsToAdd = PRODUCTS_TO_SHOW - processedProducts.length;
                    if (productsToAdd > 0) {
                        const placeholders = Array(productsToAdd).fill({
                            id: 'placeholder',
                            name: 'Coming Soon',
                            price: 0,
                            image_url: DEFAULT_IMAGE,
                            description: 'New product coming soon'
                        });
                        processedProducts.push(...placeholders);
                    }

                    console.log(`Showing ${processedProducts.length} products`);
                    setFeaturedProducts(processedProducts);
                } else {
                    throw new Error('Invalid data structure received from API');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Unable to load featured products');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchFeaturedProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="relative bg-gray-900 flex justify-center items-center h-96">
                <p className="text-white">Loading featured products...</p>
            </div>
        );
    }
    
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
                    {featuredProducts.map((product, index) => (
                        <ProductCard
                            key={`${product.id}-${index}`}
                            product={product}
                            currentImageIndex={productImageIndices[product.id] || 0}
                            onUpdateImageIndex={(newIndex) => {
                                if (product.id !== 'placeholder') {
                                    setProductImageIndices(prev => ({
                                        ...prev,
                                        [product.id]: newIndex
                                    }));
                                }
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