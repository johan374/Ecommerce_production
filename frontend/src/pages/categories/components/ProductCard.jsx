import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Loader } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { getCombinedProductImages } from '../imageConfig';
import ProductRating from './ProductRating';
import ImageCarousel from './ImageCarousel';
import ProductDetailModal from './ProductDetailModal';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProductCard = ({ 
  product, 
  currentImageIndex = 0, 
  onUpdateImageIndex 
}) => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Cart context
  const { addItem } = useCart();

  // Load product images
  useEffect(() => {
    const loadProductImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const images = getCombinedProductImages(product);
        setProductImages(images);
      } catch (err) {
        setError('Failed to load product images');
        console.error('Error loading product images:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductImages();
  }, [product]);

  // Handle adding item to cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      setIsAddingToCart(true);
      await addItem(product);
      setShowAddedToCart(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => setShowAddedToCart(false), 2000);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist click (placeholder)
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    // Implement wishlist functionality here
    console.log('Add to wishlist:', product.id);
  };

  // Handle image carousel update
  const handleImageUpdate = (index) => {
    onUpdateImageIndex?.(index);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Format price with 2 decimal places
  const formattedPrice = typeof product.price === 'number' 
    ? `$${product.price.toFixed(2)}` 
    : '$0.00';

  return (
    <>
      {/* Product Card */}
      <div 
        className="group bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image Section */}
        <div className="relative">
          <ImageCarousel 
            images={productImages}
            currentIndex={currentImageIndex}
            onUpdateIndex={handleImageUpdate}
          />
          
          {/* Wishlist Button */}
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={handleWishlistClick}
          >
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>

          {/* Added to Cart Notification */}
          {showAddedToCart && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Added to cart!
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="p-6">
          {/* Category */}
          <div className="text-sm text-blue-600 font-semibold mb-2">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:line-clamp-none">
            {product.name}
          </h3>

          {/* Rating */}
          <ProductRating rating={product.rating} />
          
          {/* Price and Cart Section */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formattedPrice}
            </span>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex items-center justify-center p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:bg-gray-400"
              aria-label={isAddingToCart ? "Adding to cart..." : "Add to cart"}
            >
              {isAddingToCart ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
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