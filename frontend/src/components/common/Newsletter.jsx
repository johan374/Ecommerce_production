import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail } from 'lucide-react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('newsletter_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Add the API call where it's commented out:
    try {
      // Make a POST request to our Django backend API
      const response = await fetch('http://localhost:8000/api/newsletter/subscribe/', {
          method: 'POST',  // Specify HTTP method
          headers: {
              'Content-Type': 'application/json',  // Tell server we're sending JSON
          },
          body: JSON.stringify({ email })  // Convert email object to JSON string
      });
   
      // Parse the JSON response from the server
      const data = await response.json();
   
      // Check if response was not successful (status not in 200-299 range)
      if (!response.ok) {
          // If server sent an error message, use it, otherwise use default message
          throw new Error(data.error || 'Subscription failed');
      }
   
      // If successful:
      // 1. Save email to browser's local storage for future use
      localStorage.setItem('newsletter_email', email);
      
      // 2. Show success message to user
      toast.success('Successfully subscribed! Redirecting to registration...');
      
      // 3. Wait 2 seconds, then redirect to registration page
      // Using redirect_url from backend response (e.g., "/register?email=user@example.com")
      setTimeout(() => navigate(data.redirect_url), 2000);
   
   } catch (error) {
      // If any error occurs during the try block:
      // Get error message from response if available, otherwise use default
      const errorMessage = error.response?.data?.error || 'Subscription failed. Please try again.';
      
      // Show error message to user
      toast.error(errorMessage);
   
   } finally {
      // This runs whether try succeeds or fails
      // Turn off loading state
      setLoading(false);
   }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Newsletter</h3>
      <p className="text-gray-300">Subscribe to our newsletter for updates and exclusive offers.</p>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span>Subscribing...</span>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Subscribe
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default Newsletter;