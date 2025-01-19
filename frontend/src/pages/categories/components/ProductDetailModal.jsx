// Import necessary dependencies
import React, { useState } from 'react';
import { X, ShoppingCart, CreditCard } from 'lucide-react'; // Icons
import ImageCarousel from './ImageCarousel';  // Custom carousel component
import ProductRating from './ProductRating'; // Custom rating component
import { useCart } from '../../../context/CartContext'; // Cart context hook
import { paymentAPI } from '../../../api/payment'; // Payment API service
import PaymentForm from '../../payments/PaymentForm'; // Payment form component
import StripeWrapper from '../../payments/StripeWrapper'; // Stripe integration wrapper

// ProductDetailModal component definition with props
const ProductDetailModal = ({ 
    product,            // Product data to display
    isOpen,            // Modal visibility state
    onClose,           // Function to close modal
    currentImageIndex, // Current image index for carousel
    onUpdateImageIndex // Function to update image index
}) => {
    // Extract addItem function from cart context
    const { addItem } = useCart();
    
    // Local state management
    const [showNotification, setShowNotification] = useState(false); // Controls add-to-cart notification
    const [showPayment, setShowPayment] = useState(false);          // Controls payment modal
    const [clientSecret, setClientSecret] = useState(null);         // Stripe client secret
    const [isProcessing, setIsProcessing] = useState(false);        // Processing state

    // Early return if modal should be closed or no product
    if (!isOpen || !product) return null;

    // Handler for adding item to cart
    const handleAddToCart = () => {
        addItem(product);  // Add product to cart
        setShowNotification(true);  // Show success notification
        setTimeout(() => {
            setShowNotification(false);  // Hide notification after 3 seconds
        }, 3000);
    };

    // Handler for immediate purchase
    const handleBuyNow = async () => {
        try {
            setIsProcessing(true);
            // Prepare item data for API
            const items = [{
                product_id: product.id,
                quantity: 1,
                price_cents: Math.round(product.price * 100) // Convert price to cents
            }];

            // Create order through payment API
            const response = await paymentAPI.createOrder(items);

            // If successful, show payment form
            if (response.data?.client_secret) {
                setClientSecret(response.data.client_secret);
                setShowPayment(true);
            }
        } catch (error) {
            console.error('Error initiating purchase:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handler for successful payment
    const handlePaymentSuccess = (paymentIntent) => {
        console.log('Payment successful:', paymentIntent);
        setShowPayment(false);  // Close payment modal
        onClose();             // Close product modal
    };

    // Prepare images array for carousel
    const allImages = [
        // Add main product image
        {
            image_url: product.image_url,
            alt_text: product.name,
            crossOrigin: "anonymous"
        },
        // Add additional images if they exist
        ...(product.additional_images || []).map(img => ({
            ...img,
            crossOrigin: "anonymous"
        }))
    ];

    return (
        // Main modal container - covers entire screen with dark overlay
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            {/* Success Notification - Shows when item is added to cart */}
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
                    ✓ Added to cart! Check your cart
                </div>
            )}
    
            {/* Main Product Modal Container */}
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                {/* Close Button - Positioned top right */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>
    
                {/* Product Content Grid - 1 column on mobile, 2 columns on medium screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Left Column - Image Carousel */}
                    <div className="relative h-[400px]">
                        <ImageCarousel
                            images={allImages}
                            currentIndex={currentImageIndex}
                            onUpdateIndex={onUpdateImageIndex}
                            heightClass="h-[400px]"
                        />
                    </div>
    
                    {/* Right Column - Product Details */}
                    <div className="flex flex-col">
                        {/* Product Category */}
                        <div className="text-sm text-blue-600 font-semibold mb-2">
                            {product.category}
                        </div>
    
                        {/* Product Name */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h2>
    
                        {/* Product Rating */}
                        <div className="mb-4">
                            <ProductRating rating={product.rating} />
                        </div>
    
                        {/* Product Price */}
                        <div className="text-3xl font-bold text-gray-900 mb-4">
                            ${product.price}
                        </div>
    
                        {/* Product Description */}
                        <div className="prose prose-sm mb-6">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-600">{product.description}</p>
                        </div>
    
                        {/* Product Features - Only shown if features exist */}
                        {product.features && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Features</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
    
                        {/* Action Buttons - Two-column grid */}
                        <div className="mt-auto grid grid-cols-2 gap-4">
                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
    
                            {/* Buy Now Button */}
                            <button
                                onClick={handleBuyNow}
                                disabled={isProcessing}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                <CreditCard className="w-5 h-5" />
                                {isProcessing ? 'Processing...' : 'Buy Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Payment Modal - Only shown during checkout */}
            {showPayment && clientSecret && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Complete Purchase</h3>
                            <button onClick={() => setShowPayment(false)}>✕</button>
                        </div>
                        {/* Stripe Payment Form */}
                        <StripeWrapper>
                            <PaymentForm
                                clientSecret={clientSecret}
                                amount={Math.round(product.price * 100)}
                                onSuccess={handlePaymentSuccess}
                                onError={(error) => console.error('Payment failed:', error)}
                            />
                        </StripeWrapper>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailModal;