// src/pages/categories/imageConfig.js

// Frontend assets path
const FRONTEND_ASSETS_PATH = '/assets';

// Default placeholder image
const DEFAULT_IMAGE = '/api/placeholder/400/320';

/**
 * Get local images for a product from its folder
/**
 * Get local images for a product
 * @param {Object} product - Product object
 * @returns {Array} Array of image objects
 */
export const getLocalProductImages = (product) => {
    const images = [];
    
    try {
      // Build the path to where images are stored in public folder
      const basePath = `${FRONTEND_ASSETS_PATH}/${product.category === 'ELEC' ? 'Electronics' : 'Food'}/${product.subcategory?.slug}`;
  
      // Use image as named in your assets folder
      const image = {
        image_url: `${basePath}/${product.image_url}`,
        alt_text: product.name,
        is_local: true
      };
      
      images.push(image);
  
      // If there are additional images, add them too
      if (product.additional_images) {
        product.additional_images.forEach((additionalImage, index) => {
          images.push({
            image_url: `${basePath}/${additionalImage}`,
            alt_text: `${product.name} - Image ${index + 2}`,
            is_local: true
          });
        });
      }
    } catch (error) {
      console.warn(`Could not load local images for product ${product.id}:`, error);
    }
  
    return images;
  };

/**
 * Process backend image URL
 * @param {string} imageUrl - Backend image URL
 * @returns {string} Processed image URL
 */
export const processBackendImageUrl = (imageUrl) => {
  if (!imageUrl) return DEFAULT_IMAGE;
  if (imageUrl.startsWith('http')) return imageUrl;
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
};

/**
 * Combine both backend and frontend images for a product
 * @param {Object} product - Product object
 * @returns {Array} Combined array of image objects
 */
export const getCombinedProductImages = (product) => {
  let images = [];

  // Add main backend image if it exists
  if (product.image_url) {
    images.push({
      image_url: processBackendImageUrl(product.image_url),
      alt_text: product.name,
      is_local: false
    });
  }

  // Add additional backend images if they exist
  if (Array.isArray(product.additional_images)) {
    const additionalImages = product.additional_images.map(img => ({
      ...img,
      image_url: processBackendImageUrl(img.image_url),
      is_local: false
    }));
    images = images.concat(additionalImages);
  }

  // Add local images from the product's folder
  const localImages = getLocalProductImages(product);
  
  // Filter out any failed local images in production
  // In development, we'll keep them to help with debugging
  if (process.env.NODE_ENV === 'production') {
    images = images.concat(localImages.filter(img => img.image_url !== DEFAULT_IMAGE));
  } else {
    images = images.concat(localImages);
  }

  // If no images are available, use default
  if (images.length === 0) {
    return [{
      image_url: DEFAULT_IMAGE,
      alt_text: 'Default product image',
      is_local: true
    }];
  }

  return images;
};

/**
 * Handle image loading errors
 * @param {Event} event - Error event object
 * @param {Function} setFallbackImage - Function to set fallback image
 */
export const handleImageError = (event, setFallbackImage) => {
  console.warn('Image failed to load:', event.target.src);
  if (event.target.src !== DEFAULT_IMAGE) {
    setFallbackImage(DEFAULT_IMAGE);
  }
};