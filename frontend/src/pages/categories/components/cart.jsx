// Import necessary dependencies from React and custom modules
import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext'; // Custom hook for cart functionality
import { paymentAPI } from '../../../api/payment'; // API service for payments
import PaymentForm from './../../payments/PaymentForm'; // Component for handling payments
import StripeWrapper from './../../payments/StripeWrapper'; // Stripe integration wrapper
import { ShoppingBag, X, Plus, Minus } from 'lucide-react'; // Icons from Lucide

const Cart = () => {
    // Destructure cart functionality from custom hook
    const { 
        items,              // Array of cart items
        removeItem,         // Function to remove item
        updateQuantity,     // Function to update item quantity
        clearCart,          // Function to clear entire cart
        getTotalPriceInCents, // Function to get total price in cents
        getFormattedItems   // Function to get formatted items for API
    } = useCart();
    
    // Local state management
    const [isOpen, setIsOpen] = useState(false);           // Controls cart sidebar visibility
    const [showPayment, setShowPayment] = useState(false); // Controls payment modal visibility
    const [clientSecret, setClientSecret] = useState(null); // Stores Stripe client secret
    const [isProcessing, setIsProcessing] = useState(false); // Tracks checkout processing state

    // Handler for initiating checkout process
    const handleCheckout = async () => {
        try {
            setIsProcessing(true);
            const formattedItems = getFormattedItems();
            // Create order through payment API
            const response = await paymentAPI.createOrder(formattedItems);

            if (response.data?.client_secret) {
                setClientSecret(response.data.client_secret);
                setShowPayment(true);
            }
        } catch (error) {
            console.error('Error initiating checkout:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handler for successful payment completion
    const handlePaymentSuccess = (paymentIntent) => {
        console.log('Payment successful:', paymentIntent);
        clearCart();           // Clear the cart
        setShowPayment(false); // Hide payment modal
        setIsOpen(false);      // Close cart sidebar
    };

    return (
        <>  {/* Fragment wrapper to return multiple elements */}
            {/* 1. FLOATING CART BUTTON */}
            <button
                onClick={() => setIsOpen(true)} // Opens the cart sidebar when clicked
                className="fixed right-4 bottom-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                // Button is fixed to bottom-right corner with blue background and hover effect
            >
                <div className="relative"> {/* Container for badge positioning */}
                    <ShoppingBag size={24} /> {/* Shopping bag icon */}
                    {/* Conditional render of quantity badge */}
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {items.reduce((total, item) => total + item.quantity, 0)} {/* Calculates total quantity */}
                        </span>
                    )}
                </div>
            </button>
    
            {/* 2. CART SIDEBAR */}
            {isOpen && ( // Only shows when isOpen is true
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50"> {/* Dark overlay */}
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                        {/* Cart Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Shopping Cart</h2>
                            <button
                                onClick={() => setIsOpen(false)} // Closes the cart
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} /> {/* Close (X) icon */}
                            </button>
                        </div>
    
                        {/* Cart Items Section with Scroll */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {/* Conditional rendering based on cart status */}
                            {items.length === 0 ? (
                                <p className="text-center text-gray-500">Your cart is empty</p>
                            ) : (
                                <div className="space-y-4">
                                    {/* Map through each cart item */}
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 border-b pb-4">
                                            {/* Item Image */}
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            
                                            {/* Item Details Section */}
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-gray-600">${item.price}</p>
                                                
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    {/* Decrease quantity button */}
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    {/* Increase quantity button */}
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Remove Item Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
    
                        {/* 3. CART FOOTER */}
                        {items.length > 0 && (
                            <div className="border-t p-4">
                                {/* Total Price Display */}
                                <div className="flex justify-between mb-4">
                                    <span className="font-semibold">Total:</span>
                                    <span className="font-semibold">
                                        ${(getTotalPriceInCents() / 100).toFixed(2)} {/* Converts cents to dollars */}
                                    </span>
                                </div>
                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                >
                                    {isProcessing ? 'Processing...' : 'Checkout'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
    
            {/* 4. PAYMENT MODAL */}
            {showPayment && clientSecret && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Complete Purchase</h3>
                            <button onClick={() => setShowPayment(false)}>✕</button>
                        </div>
                        {/* Stripe Payment Form */}
                        <StripeWrapper>
                            <PaymentForm
                                clientSecret={clientSecret}
                                amount={getTotalPriceInCents()}
                                onSuccess={handlePaymentSuccess}
                                onError={(error) => console.error('Payment failed:', error)}
                            />
                        </StripeWrapper>
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;