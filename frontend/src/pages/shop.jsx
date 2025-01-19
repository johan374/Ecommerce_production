// pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { productAPI } from '../api/products';
import ProductCard from '../pages/categories/components/ProductCard';
import Pagination from '../pages/categories/components/pagination';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [productImageIndices, setProductImageIndices] = useState({});

    // Define all categories and their subcategories
    const categories = [
        {
            name: 'Electronics',
            id: 'electronics',
            subcategories: [
                { id: 'tv-home-theater', name: 'TV & Home Theater' },
                { id: 'computers-smartphones', name: 'Computers & Smartphones' },
                { id: 'home-tools', name: 'Home Tools' }
            ]
        },
        {
            name: 'Food',
            id: 'food',
            subcategories: [
                { id: 'groceries', name: 'Groceries' },
                { id: 'prepared-meals', name: 'Prepared Meals' },
                { id: 'snacks-beverages', name: 'Snacks & Beverages' }
            ]
        }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productAPI.getAllProducts();
                
                if (response?.data?.results) {
                    setProducts(response.data.results);
                    setTotalPages(Math.ceil(response.data.count / 12));
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            {/* Back Home Button */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link 
                        to="/" 
                        className="flex items-center text-gray-600 hover:text-[#007edf] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Categories Navigation */}
            <div className="bg-white shadow mt-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col space-y-4 py-6">
                        {categories.map((category) => (
                            <div key={category.id} className="space-y-2">
                                <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to={`/${category.id}`}
                                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        All {category.name}
                                    </Link>
                                    {category.subcategories.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            to={`/${category.id}/${sub.id}`}
                                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Browse our complete collection of products
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
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};

export default Shop;