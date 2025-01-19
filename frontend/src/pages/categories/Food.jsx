// Food.jsx
import React, { useState, useEffect } from 'react';
import { foodAPI } from '../../api/food';
import ProductCard from './components/ProductCard';
import Pagination from './components/pagination';
import FoodNav from './Food/FoodNav';

function Food() {
    // State management
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productImageIndices, setProductImageIndices] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Fetch products based on filters
    const fetchProducts = async (page, search = '', category = 'all') => {
        try {
            setIsLoading(true);
            let response;

            if (search) {
                response = await foodAPI.searchFood(search, page);
            } else if (category !== 'all') {
                response = await foodAPI.getFoodByCategory(category, page);
            } else {
                response = await foodAPI.getAllFood(page);
            }

            if (response?.data?.results) {
                const processedProducts = response.data.results.map(product => ({
                    ...product,
                    image_url: product.image_url || "/default-image.png"
                }));
                setProducts(processedProducts);
                setTotalPages(Math.ceil(response.data.count / 12));
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching food products:', error);
            setError('Failed to load food products');
        } finally {
            setIsLoading(false);
        }
    };

    // Effect hook to fetch products when filters change
    useEffect(() => {
        fetchProducts(currentPage, searchQuery, selectedCategory);
    }, [currentPage, searchQuery, selectedCategory]);

    // Handler functions
    const handleSearch = (term) => {
        setSearchQuery(term);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setSearchQuery('');
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="pt-16 min-h-screen bg-gray-100 flex justify-center items-center">
                <p>Loading food products...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="pt-16 min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-100">
            <FoodNav 
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                totalResults={products.length}
            />

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Food</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Discover our delicious food products
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
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

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                {products.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">
                            {searchQuery 
                                ? `No food products found matching "${searchQuery}"`
                                : "No food products available."
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Food;