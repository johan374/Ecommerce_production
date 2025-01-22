// src/pages/categories/frontendImages.js

export const categoryImages = {
    ELEC: {
      'tv-home-theater': [
        '/assets/electronics/tv/tv1.jpg',
        '/assets/electronics/tv/tv2.jpg'
      ],
      'computers-smartphones': [
        '/assets/electronics/computers-smarthphones/laptop/laptop.png',
        '/assets/electronics/computers/computer2.jpg'
      ],
      'home-tools': [
        '/assets/electronics/tools/tool1.jpg',
        '/assets/electronics/tools/tool2.jpg'
      ]
    },
    FOOD: {
      'groceries': [
        '/assets/food/groceries/grocery1.jpg',
        '/assets/food/groceries/grocery2.jpg'
      ],
      'prepared-meals': [
        '/assets/food/meals/meal1.jpg',
        '/assets/food/meals/meal2.jpg'
      ],
      'snacks-beverages': [
        '/assets/food/snacks/snack1.jpg',
        '/assets/food/snacks/snack2.jpg'
      ]
    }
  };
  
  // Get frontend image based on product category and subcategory
  export const getFrontendImage = (product) => {
    try {
      const categoryImages = categoryImages[product.category];
      if (!categoryImages) return '/api/placeholder/400/320';
  
      const subcategoryImages = categoryImages[product.subcategory?.slug];
      if (!subcategoryImages || subcategoryImages.length === 0) {
        return '/api/placeholder/400/320';
      }
  
      // Use product ID to select an image (cycle through available images)
      const imageIndex = parseInt(product.id) % subcategoryImages.length;
      return subcategoryImages[imageIndex];
    } catch (error) {
      console.error('Error getting frontend image:', error);
      return '/api/placeholder/400/320';
    }
  };
  
  // Get multiple images for a product
  export const getProductImages = (product) => {
    try {
      const categoryImages = categoryImages[product.category];
      if (!categoryImages) return ['/api/placeholder/400/320'];
  
      const subcategoryImages = categoryImages[product.subcategory?.slug];
      if (!subcategoryImages || subcategoryImages.length === 0) {
        return ['/api/placeholder/400/320'];
      }
  
      // Return 3 images for the product, cycling through available images
      const startIndex = parseInt(product.id) % subcategoryImages.length;
      return [
        subcategoryImages[startIndex],
        subcategoryImages[(startIndex + 1) % subcategoryImages.length],
        subcategoryImages[(startIndex + 2) % subcategoryImages.length]
      ];
    } catch (error) {
      console.error('Error getting product images:', error);
      return ['/api/placeholder/400/320'];
    }
  };