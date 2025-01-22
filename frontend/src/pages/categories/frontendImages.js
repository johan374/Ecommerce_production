// src/pages/categories/frontendImages.js

export const categoryImages = {
    ELEC: {
      'tv-home-theater': [
        '/assets/electronics/tv-home-theater/tv/tv2.jpg',
        '/assets/electronics/tv-home-theater/tv/tv3.jpg',
        '/assets/electronics/tv-home-theater/tv/tv4.jpg'
      ],
      'computers-smartphones': [
        '/assets/electronics/computers-smarthphones/laptop/laptop.png',
        '/assets/electronics/computers-smarthphones/laptop/laptop2.jpg',
        '/assets/electronics/computers-smarthphones/laptop/laptop3.jpg',
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
        '/assets/food/groceries/bread/bread3.jpg',
        '/assets/food/groceries/bread/bread4.jpg',
        '/assets/food/groceries/bread/bread5.jpg',
        '/assets/food/groceries/bread/bread6.jpg',
      ],
      'prepared-meals': [
        '/assets/food/prepared-meals/goatMeal.jpg',
      ],
      'snacks-beverages': [
        '/assets/food/snacks-beverages/milk/milk.jpg',
        '/assets/food/snacks-beverages/milk/milk2.jpg',
        '/assets/food/snacks-beverages/milk/milk3.jpg',
        '/assets/food/snacks-beverages/milk/milk4.jpg',
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