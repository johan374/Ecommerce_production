// src/utils/imageConfig.js

// Frontend assets path
const FRONTEND_ASSETS_PATH = '/assets';
const DEFAULT_IMAGE = '/api/placeholder/400/320';

/**
 * Try to load images for a product using multiple patterns
 * @param {Object} product - Product object
 * @returns {Array} Array of image objects
 */
export const getLocalProductImages = (product) => {
  const images = [];
  const category = product.category === 'ELEC' ? 'Electronics' : 'Food';
  const subcategory = product.subcategory?.slug;
  
  if (!category || !subcategory) {
    return images;
  }

  // Build the base paths
  const subcategoryPath = `${FRONTEND_ASSETS_PATH}/${category}/${subcategory}`;
  const productFolderPath = `${subcategoryPath}/${product.id}`;

  try {
    // Pattern 1: Try product-specific folder first (e.g., /Electronics/tv-home-theater/1/1.jpg)
    const folderImage = {
      image_url: `${productFolderPath}/1.jpg`,
      alt_text: `${product.name} - Image 1`,
      is_local: true
    };
    images.push(folderImage);

    // Try additional images in the product folder
    for (let i = 2; i <= 4; i++) {
      images.push({
        image_url: `${productFolderPath}/${i}.jpg`,
        alt_text: `${product.name} - Image ${i}`,
        is_local: true
      });
    }

    // Pattern 2: Try direct files in subcategory folder (e.g., /Electronics/tv-home-theater/product-1.jpg)
    const directImage = {
      image_url: `${subcategoryPath}/product-${product.id}.jpg`,
      alt_text: `${product.name}`,
      is_local: true
    };
    images.push(directImage);

    // Try variations of the filename
    const variations = [
      `${subcategoryPath}/${product.id}.jpg`,
      `${subcategoryPath}/img-${product.id}.jpg`,
      `${subcategoryPath}/image-${product.id}.jpg`
    ];

    variations.forEach(path => {
      images.push({
        image_url: path,
        alt_text: `${product.name}`,
        is_local: true
      });
    });

  } catch (error) {
    console.warn(`Could not load local images for product ${product.id}:`, error);
  }

  return images;
};

/**
 * Process backend image URL
 */
export const processBackendImageUrl = (imageUrl) => {
  if (!imageUrl) return DEFAULT_IMAGE;
  if (imageUrl.startsWith('http')) return imageUrl;
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
};

/**
 * Combine both backend and frontend images for a product
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

  // Add additional backend images
  if (Array.isArray(product.additional_images)) {
    const additionalImages = product.additional_images.map(img => ({
      ...img,
      image_url: processBackendImageUrl(img.image_url),
      is_local: false
    }));
    images = images.concat(additionalImages);
  }

  // Add local images
  const localImages = getLocalProductImages(product);
  
  // In production, filter out any images that fail to load
  // In development, keep all for debugging
  if (process.env.NODE_ENV === 'production') {
    // Add each local image but avoid duplicates
    localImages.forEach(img => {
      if (!images.some(existingImg => existingImg.image_url === img.image_url)) {
        images.push(img);
      }
    });
  } else {
    images = images.concat(localImages);
  }

  // Fallback to default if no images
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
 */
export const handleImageError = (event, setFallbackImage) => {
  console.warn('Image failed to load:', event.target.src);
  if (event.target.src !== DEFAULT_IMAGE) {
    setFallbackImage(DEFAULT_IMAGE);
  }
};