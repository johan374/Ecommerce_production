// src/pages/categories/imageConfig.js

// Configuration constants
const CONFIG = {
    FRONTEND_ASSETS_PATH: '/assets',
    DEFAULT_IMAGE: '/api/placeholder/400/320',
    CATEGORY_PATHS: {
      ELEC: 'electronics',
      FOOD: 'food'
    },
    PRODUCT_IMAGES: {
      ELEC: {
        'tv-home-theater': Array.from({ length: 10 }, (_, i) => `/assets/electronics/tv/product-${i + 1}.jpg`),
        'computers-smartphones': Array.from({ length: 10 }, (_, i) => `/assets/electronics/computers/product-${i + 1}.jpg`),
        'home-tools': Array.from({ length: 10 }, (_, i) => `/assets/electronics/tools/product-${i + 1}.jpg`)
      },
      FOOD: {
        'groceries': Array.from({ length: 10 }, (_, i) => `/assets/food/groceries/product-${i + 1}.jpg`),
        'prepared-meals': Array.from({ length: 10 }, (_, i) => `/assets/food/meals/product-${i + 1}.jpg`),
        'snacks-beverages': Array.from({ length: 10 }, (_, i) => `/assets/food/snacks/product-${i + 1}.jpg`)
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
   * Gets frontend images for a product based on its category and ID
   */
  export const getFrontendProductImages = (product) => {
    if (!product) return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image')];
  
    try {
      const category = CONFIG.CATEGORY_PATHS[product.category];
      const subcategory = product.subcategory?.slug;
      
      // Get predefined images for this category/subcategory
      const availableImages = CONFIG.PRODUCT_IMAGES[product.category]?.[subcategory] || [];
      
      // Use modulo to cycle through available images based on product ID
      const productIndex = parseInt(product.id) % availableImages.length;
      const mainImage = availableImages[productIndex] || CONFIG.DEFAULT_IMAGE;
      
      // Create image objects array
      const images = [
        createImageObject(mainImage, product.name),
        createImageObject(
          availableImages[(productIndex + 1) % availableImages.length] || CONFIG.DEFAULT_IMAGE,
          `${product.name} - Additional View 1`
        ),
        createImageObject(
          availableImages[(productIndex + 2) % availableImages.length] || CONFIG.DEFAULT_IMAGE,
          `${product.name} - Additional View 2`
        )
      ];
  
      return images;
    } catch (error) {
      console.warn(`Error getting frontend images for product ${product.id}:`, error);
      return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image')];
    }
  };
  
  /**
   * Gets combined product images (frontend or backend)
   */
  export const getCombinedProductImages = (product) => {
    if (!product) {
      console.warn('No product provided to getCombinedProductImages');
      return [createImageObject(CONFIG.DEFAULT_IMAGE, 'Default product image')];
    }
  
    // Get frontend images
    const frontendImages = getFrontendProductImages(product);
  
    // Return frontend images by default
    return frontendImages;
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