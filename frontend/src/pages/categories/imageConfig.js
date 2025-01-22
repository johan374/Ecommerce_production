// src/pages/categories/imageConfig.js

// Configuration constants
const CONFIG = {
    // URLs and paths
    FRONTEND_ASSETS_PATH: '/assets',
    BACKEND_URL: import.meta.env.VITE_API_URL || 'https://ecommerce-backend-nhrc.onrender.com/api',
    MEDIA_URL: import.meta.env.VITE_MEDIA_URL || 'https://ecommerce-backend-nhrc.onrender.com',
    DEFAULT_IMAGE: '/api/placeholder/400/320',
    
    // Category mappings
    CATEGORY_PATHS: {
      ELEC: 'electronics',
      FOOD: 'food'
    },
    
    // Frontend images by category and subcategory
    PRODUCT_IMAGES: {
      ELEC: {
        'tv-home-theater': [
          '/assets/electronics/tv-home-theater/tv/tv2.jpg',
          '/assets/electronics/tv-home-theater/tv/tv3.jpg',
          '/assets/electronics/tv-home-theater/tv/tv4.jpg'
        ],
        'computers-smartphones': [
          '/assets/electronics/computers-smartphones/laptop/laptop.png',
          '/assets/electronics/computers-smartphones/laptop/laptop2.jpg',
          '/assets/electronics/computers-smartphones/laptop/laptop3.jpg'
        ],
        'home-tools': [
          '/assets/electronics/home-tools/drone/drone1.png',
          '/assets/electronics/home-tools/drone/drone2.png'
        ]
      },
      FOOD: {
        'groceries': [
          '/assets/food/groceries/bread/bread1.jpg',
          '/assets/food/groceries/bread/bread2.jpg',
          '/assets/food/groceries/bread/bread3.jpg'
        ],
        'prepared-meals': [
          '/assets/food/prepared-meals/meal1.jpg',
          '/assets/food/prepared-meals/meal2.jpg'
        ],
        'snacks-beverages': [
          '/assets/food/snacks-beverages/snack1.jpg',
          '/assets/food/snacks-beverages/snack2.jpg'
        ]
      }
    }
  };
  
  /**
   * Creates an image object with consistent structure
   */
  const createImageObject = (url, altText, isLocal = true) => ({
    image_url: url,
    alt_text: altText,
    is_local: isLocal
  });
  
  /**
   * Processes a backend image URL
   */
  const processBackendUrl = (imageUrl) => {
    if (!imageUrl) return CONFIG.DEFAULT_IMAGE;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${CONFIG.MEDIA_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };
  
  /**
   * Gets frontend images for a product
   */
  export const getFrontendProductImages = (product) => {
    if (!product) return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image')];
  
    try {
      const subcategory = product.subcategory?.slug;
      const images = CONFIG.PRODUCT_IMAGES[product.category]?.[subcategory];
      
      if (!images || images.length === 0) {
        return [createImageObject(CONFIG.DEFAULT_IMAGE, product.name)];
      }
  
      // Get main image and additional images
      const productIndex = parseInt(product.id) % images.length;
      return [
        createImageObject(images[productIndex], product.name),
        createImageObject(images[(productIndex + 1) % images.length], `${product.name} - View 2`),
        createImageObject(images[(productIndex + 2) % images.length], `${product.name} - View 3`)
      ];
    } catch (error) {
      console.warn(`Error getting frontend images for ${product.name}:`, error);
      return [createImageObject(CONFIG.DEFAULT_IMAGE, product.name)];
    }
  };
  
  /**
   * Gets backend images for a product
   */
  export const getBackendProductImages = (product) => {
    if (!product) return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image')];
  
    try {
      const images = [];
  
      // Add main product image if it exists
      if (product.image_url) {
        images.push(createImageObject(
          processBackendUrl(product.image_url),
          product.name,
          false
        ));
      }
  
      // Add additional images if they exist
      if (Array.isArray(product.additional_images)) {
        product.additional_images.forEach((img, index) => {
          const imageUrl = typeof img === 'string' ? img : img.image_url;
          if (imageUrl) {
            images.push(createImageObject(
              processBackendUrl(imageUrl),
              `${product.name} - Image ${index + 2}`,
              false
            ));
          }
        });
      }
  
      return images.length > 0 ? images : [createImageObject(CONFIG.DEFAULT_IMAGE, product.name)];
    } catch (error) {
      console.warn(`Error getting backend images for ${product.name}:`, error);
      return [createImageObject(CONFIG.DEFAULT_IMAGE, product.name)];
    }
  };
  
  /**
   * Gets combined product images (prioritizes backend images)
   */
  export const getCombinedProductImages = (product) => {
    if (!product) {
      return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image')];
    }
  
    // Get backend images first
    const backendImages = getBackendProductImages(product);
    
    // If backend images exist (other than default), use them
    if (backendImages.length > 1 || backendImages[0].image_url !== CONFIG.DEFAULT_IMAGE) {
      return backendImages;
    }
  
    // Fallback to frontend images
    return getFrontendProductImages(product);
  };
  
  /**
   * Handles image loading errors with fallback
   */
  export const handleImageError = (event, setFallbackImage, productName = 'Unknown') => {
    const failedUrl = event.target.src;
    console.warn(`Image failed to load for ${productName}:`, failedUrl);
    
    if (failedUrl !== CONFIG.DEFAULT_IMAGE) {
      setFallbackImage(CONFIG.DEFAULT_IMAGE);
    }
  };