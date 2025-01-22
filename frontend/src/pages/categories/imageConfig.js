// src/config/imageConfig.js

// Define paths for frontend assets
const FRONTEND_IMAGE_PATH = '/images'; // Your frontend images folder

// Map product categories to their respective image folders
const CATEGORY_FOLDERS = {
  ELEC: 'electronics',
  FOOD: 'food'
};

// Map subcategories to their image folders
const SUBCATEGORY_FOLDERS = {
  'tv-home-theater': 'tv',
  'computers-smartphones': 'computers',
  'home-tools': 'tools',
  'groceries': 'groceries',
  'prepared-meals': 'meals',
  'snacks-beverages': 'snacks'
};

export const getProductImage = (product) => {
  try {
    // Get category folder
    const categoryFolder = CATEGORY_FOLDERS[product.category] || 'default';
    
    // Get subcategory folder
    const subcategoryFolder = product.subcategory ? 
      SUBCATEGORY_FOLDERS[product.subcategory.slug] || 'default' :
      'default';

    // Construct image path - assuming images are named after product IDs
    const imagePath = `${FRONTEND_IMAGE_PATH}/${categoryFolder}/${subcategoryFolder}/${product.id}.jpg`;
    
    // For development, you can return a placeholder if image doesn't exist
    if (import.meta.env.DEV) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(imagePath);
        img.onerror = () => resolve('/api/placeholder/400/320');
        img.src = imagePath;
      });
    }

    return imagePath;
  } catch (error) {
    console.error('Error getting product image:', error);
    return '/api/placeholder/400/320';
  }
};

export const getMultipleProductImages = (product) => {
  const mainImage = getProductImage(product);
  
  // Get additional images based on product ID
  const additionalImages = Array.from({ length: 3 }, (_, index) => {
    try {
      const categoryFolder = CATEGORY_FOLDERS[product.category] || 'default';
      const subcategoryFolder = product.subcategory ? 
        SUBCATEGORY_FOLDERS[product.subcategory.slug] || 'default' :
        'default';
      
      return `${FRONTEND_IMAGE_PATH}/${categoryFolder}/${subcategoryFolder}/${product.id}_${index + 1}.jpg`;
    } catch (error) {
      return '/api/placeholder/400/320';
    }
  });

  return [mainImage, ...additionalImages];
};