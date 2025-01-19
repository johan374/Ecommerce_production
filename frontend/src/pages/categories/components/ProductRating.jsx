import React from 'react';

// ProductRating component takes a single prop:
// - rating: numerical value representing the product's rating (e.g., 4.5)
const ProductRating = ({ rating }) => (
  // Container using flexbox to align stars and rating number
  <div className="flex items-center">
    {/* Create array of 5 elements and map over them to create stars */}
    {[...Array(5)].map((_, index) => (
      <svg
        // Each star needs a unique key for React's reconciliation
        key={index}
        // Dynamic classes:
        // - w-4 h-4: Set width and height to 1rem
        // - Conditional color: yellow for filled stars, gray for empty
        className={`w-4 h-4 ${
          // Math.floor(rating) converts decimal to whole number
          // e.g., if rating is 4.7, first 4 stars will be yellow
          index < Math.floor(rating) 
            ? "text-yellow-400"  // Filled star color
            : "text-gray-300"    // Empty star color
        }`}
        // currentColor uses the text color defined in className
        fill="currentColor"
        // SVG coordinate system
        viewBox="0 0 20 20"
      >
        {/* SVG path data for a star shape */}
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    {/* Display numerical rating in parentheses */}
    <span className="ml-2 text-gray-400">({rating})</span>
  </div>
);

export default ProductRating;