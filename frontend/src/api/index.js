// src/api/index.js
import axios from 'axios';

// Configuration constants
const CONFIG = {
  BACKEND_URL: import.meta.env.VITE_API_URL || 'https://ecommerce-backend-nhrc.onrender.com/api',
  MEDIA_URL: import.meta.env.VITE_MEDIA_URL || 'https://ecommerce-backend-nhrc.onrender.com',
  DEFAULT_IMAGE: '/api/placeholder/400/320',
  TIMEOUT: 30000, // 30 seconds
};

/**
 * Creates and configures an Axios instance
 * @returns {import('axios').AxiosInstance} Configured Axios instance
 */
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: CONFIG.BACKEND_URL,
    timeout: CONFIG.TIMEOUT,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: false
  });

  // Log configuration in development
  if (import.meta.env.DEV) {
    console.log('API Configuration:', {
      baseURL: instance.defaults.baseURL,
      mediaURL: CONFIG.MEDIA_URL,
      timeout: CONFIG.TIMEOUT
    });
  }

  return instance;
};

/**
 * Processes image URLs in the response data
 * @param {any} data - Response data to process
 * @returns {any} Processed data with absolute image URLs
 */
const processImageUrls = (data) => {
  const processUrl = (url) => {
    if (!url) return CONFIG.DEFAULT_IMAGE;
    if (url.startsWith('http')) return url;
    return `${CONFIG.MEDIA_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const processValue = (value) => {
    if (Array.isArray(value)) {
      return value.map(item => {
        if (!item) return CONFIG.DEFAULT_IMAGE;
        return typeof item === 'string' ? processUrl(item) : processUrl(item.image_url);
      });
    }
    return processUrl(value);
  };

  if (typeof data === 'object' && data !== null) {
    const processedData = { ...data };

    for (const [key, value] of Object.entries(data)) {
      if (key === 'image_url' || key === 'additional_images') {
        try {
          processedData[key] = processValue(value);
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
          processedData[key] = key === 'image_url' ? CONFIG.DEFAULT_IMAGE : [CONFIG.DEFAULT_IMAGE];
        }
      }
    }

    return processedData;
  }

  return data;
};

/**
 * Adds response interceptors to handle common cases
 * @param {import('axios').AxiosInstance} instance - Axios instance to configure
 */
const addInterceptors = (instance) => {
  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      try {
        response.data = processImageUrls(response.data);
        return response;
      } catch (error) {
        console.error('Error in response interceptor:', error);
        return response;
      }
    },
    (error) => {
      // Log detailed error information in development
      if (import.meta.env.DEV) {
        console.error('API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
      }

      // Enhance error object with user-friendly message
      const enhancedError = error;
      enhancedError.userMessage = getUserFriendlyErrorMessage(error);

      return Promise.reject(enhancedError);
    }
  );

  // Request interceptor for logging in development
  if (import.meta.env.DEV) {
    instance.interceptors.request.use(
      (config) => {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers
        });
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );
  }
};

/**
 * Gets a user-friendly error message based on the error
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
const getUserFriendlyErrorMessage = (error) => {
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  switch (error.response.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Please login to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Create and configure the API instance
const api = createAxiosInstance();
addInterceptors(api);

// Export configured instance
export default api;

// Export configuration for use in other modules
export const apiConfig = {
  BACKEND_URL: CONFIG.BACKEND_URL,
  MEDIA_URL: CONFIG.MEDIA_URL,
  DEFAULT_IMAGE: CONFIG.DEFAULT_IMAGE
};