// src/pages/categories/imageConfig.js

// Configuration constants
const CONFIG = {
    FRONTEND_ASSETS_PATH: '/assets',
    DEFAULT_IMAGE: '/api/placeholder/400/320',
    BACKEND_URL: import.meta.env.VITE_MEDIA_URL || 'https://ecommerce-backend-nhrc.onrender.com',
    CATEGORY_PATHS: {
      ELEC: 'Electronics',
      FOOD: 'Food'
    }
  };
  
  /**
   * Creates an image object with consistent structure
   * @param {string} url - Image URL
   * @param {string} altText - Alternative text for the image
   * @param {boolean} isLocal - Whether the image is stored locally
   * @returns {Object} Formatted image object
   */
  const createImageObject = (url, altText, isLocal = false) => ({
    image_url: url,
    alt_text: altText,
    is_local: isLocal
  });
  
  /**
   * Processes a backend image URL to ensure proper formatting
   * @param {string} imageUrl - Raw image URL from backend
   * @returns {string} Processed image URL
   */
  export const processBackendImageUrl = (imageUrl) => {
    if (!imageUrl) return CONFIG.DEFAULT_IMAGE;
    if (imageUrl.startsWith('http')) return imageUrl;
    
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${CONFIG.BACKEND_URL}${cleanUrl}`;
  };
  
  /**
   * Retrieves local product images from the assets directory
   * @param {Object} product - Product object containing category and image information
   * @returns {Array} Array of image objects
   */
  export const getLocalProductImages = (product) => {
    const images = [];
    
    try {
      // Determine category path
      const categoryPath = CONFIG.CATEGORY_PATHS[product.category] || '';
      if (!categoryPath) {
        throw new Error(`Invalid category: ${product.category}`);
      }
  
      // Build base path for images
      const basePath = `${CONFIG.FRONTEND_ASSETS_PATH}/${categoryPath}/${product.subcategory?.slug || ''}`;
  
      // Add main product image
      if (product.image_url) {
        images.push(createImageObject(
          `${basePath}/${product.image_url}`,
          product.name,
          true
        ));
      }
  
      // Add additional images if they exist
      if (Array.isArray(product.additional_images)) {
        product.additional_images.forEach((additionalImage, index) => {
          images.push(createImageObject(
            `${basePath}/${additionalImage}`,
            `${product.name} - Image ${index + 2}`,
            true
          ));
        });
      }
    } catch (error) {
      console.warn(`Error loading local images for product ${product.id}:`, error);
    }
  
    return images;
  };
  
  /**
   * Combines backend and frontend images for a product
   * @param {Object} product - Product object
   * @returns {Array} Combined array of image objects
   */
  export const getCombinedProductImages = (product) => {
    if (!product) {
      console.warn('No product provided to getCombinedProductImages');
      return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image', true)];
    }
  
    let images = [];
  
    // Process main product image from backend
    if (product.image_url) {
      images.push(createImageObject(
        processBackendImageUrl(product.image_url),
        product.name,
        false
      ));
    }
  
    // Process additional backend images
    if (Array.isArray(product.additional_images)) {
      const additionalImages = product.additional_images.map((img, index) => 
        createImageObject(
          processBackendImageUrl(img.image_url || img),
          `${product.name} - Image ${index + 2}`,
          false
        )
      );
      images = images.concat(additionalImages);
    }
  
    // Add local images in development mode
    if (process.env.NODE_ENV !== 'production') {
      const localImages = getLocalProductImages(product);
      images = images.concat(localImages);
    }
  
    // Return default image if no images are available
    if (images.length === 0) {
      return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image', true)];
    }
  
    // Filter out any invalid images
    return images.filter(img => img.image_url && img.image_url !== 'undefined');
  };
  
  /**
   * Handles image loading errors with fallback
   * @param {Event} event - Error event object
   * @param {Function} setFallbackImage - Function to set fallback image
   * @param {string} productName - Name of the product for logging
   */
  export const handleImageError = (event, setFallbackImage, productName = 'Unknown') => {
    const failedUrl = event.target.src;
    console.warn(`Image failed to load for ${productName}:`, failedUrl);
    
    if (failedUrl !== CONFIG.DEFAULT_IMAGE) {
      setFallbackImage(CONFIG.DEFAULT_IMAGE);
    }
  };
  
  /**
   * Validates whether an image URL is accessible
   * @param {string} imageUrl - URL to validate
   * @returns {Promise<boolean>} Whether the image is accessible
   */
  export const validateImageUrl = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn(`Error validating image URL ${imageUrl}:`, error);
      return false;
    }
  };