import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// PaymentForm component handles credit card payment processing
const PaymentForm = ({ 
  // Client secret generated from backend to securely confirm payment
  clientSecret, 
  // Amount to charge (in cents)
  amount, 
  // Optional callback function when payment succeeds
  onSuccess, 
  // Optional callback function when payment fails
  onError 
}) => {
  // Hook to access Stripe.js functionality for payment processing
  const stripe = useStripe();
  
  // Hook to interact with Stripe Elements (card input field)
  const elements = useElements();
  
  // State to track whether payment is currently being processed
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State to store and display any error messages
  const [error, setError] = useState(null);

  // Handle form submission for payment
  const handleSubmit = async (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Check if Stripe and Elements are loaded
    // If not, exit the submission process
    if (!stripe || !elements) {
      return;
    }

    // Set processing state to true to disable submit button
    setIsProcessing(true);
    // Clear any previous error messages
    setError(null);

    try {
      // Attempt to confirm card payment using Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        // Specify payment method using card element
        payment_method: {
          // Get the card input element from Stripe Elements
          card: elements.getElement(CardElement),
        }
      });

      // Check if payment confirmation returned an error
      if (result.error) {
        // Set error message from Stripe
        setError(result.error.message);
        // Call error callback if provided
        onError?.(result.error);
      } else {
        // Payment successful
        // Call success callback with payment intent details
        onSuccess?.(result.paymentIntent);
      }
    } catch (err) {
      // Handle any unexpected errors during payment
      setError('An unexpected error occurred.');
      // Call error callback with caught error
      onError?.(err);
    } finally {
      // Always set processing state back to false
      // This ensures submit button is re-enabled
      setIsProcessing(false);
    }
  };

  return (
    // Payment form with responsive and centered layout
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
      <div className="mb-4">
        {/* Label for card details input */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        
        {/* Container for Stripe CardElement with styling */}
        <div className="p-3 border rounded-md bg-white">
          <CardElement
            // Customize the appearance of the card input
            options={{
              style: {
                // Styling for the default/base input state
                base: {
                  // Font size for input text
                  fontSize: '16px',
                  // Default text color
                  color: '#424770',
                  // Placeholder text styling
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                // Styling for invalid input
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Display error message if any */}
      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Payment summary and submit section */}
      <div className="flex justify-between items-center">
        {/* Display total amount (converting cents to dollars) */}
        <span className="text-lg font-semibold">
          Total: ${(amount / 100).toFixed(2)}
        </span>
        
        {/* Submit button with dynamic states */}
        <button
          type="submit"
          // Disable button when processing or Stripe is not loaded
          disabled={isProcessing || !stripe}
          // Conditional styling based on button state
          className={`px-4 py-2 rounded bg-blue-600 text-white 
            ${(isProcessing || !stripe) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {/* Button text changes based on processing state */}
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;