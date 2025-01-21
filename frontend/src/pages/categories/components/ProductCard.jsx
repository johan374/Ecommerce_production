import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductRating from './ProductRating';
import ImageCarousel from './ImageCarousel';
import ProductDetailModal from './ProductDetailModal';
import { useCart } from '../../../context/CartContext';
import { getCombinedProductImages } from '../imageConfig'; // Fixed import

const ProductCard = ({ product, currentImageIndex, onUpdateImageIndex }) => {
    const { addItem } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productImages, setProductImages] = useState([]);

    useEffect(() => {
        // Get combined images when product changes
        const images = getCombinedProductImages(product);
        setProductImages(images);
    }, [product]);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addItem(product);
    };

    return (
        <>
            <div 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="relative">
                    <ImageCarousel 
                        images={productImages}
                        currentIndex={currentImageIndex}
                        onUpdateIndex={(index) => {
                            onUpdateImageIndex(index);
                            event.stopPropagation();
                        }}
                    />
                    <button 
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Add wishlist functionality here
                        }}
                    >
                        <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-sm text-blue-600 font-semibold mb-2">
                        {product.category}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                    </h3>
                    <ProductRating rating={product.rating} />
                    
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                            ${product.price}
                        </span>
                        <button 
                            onClick={handleAddToCart}
                            className="flex items-center justify-center p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={{
                    ...product,
                    all_images: productImages
                }}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentImageIndex={currentImageIndex}
                onUpdateImageIndex={onUpdateImageIndex}
            />
        </>
    );
};

export default ProductCard;