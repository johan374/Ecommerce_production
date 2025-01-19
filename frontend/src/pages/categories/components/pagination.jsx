import React from 'react';

// Pagination component accepts three props:
// - currentPage: The active page number
// - totalPages: Total number of pages available
// - onPageChange: Function to handle page changes
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  // Container with margin-top and centered flexbox layout
  <div className="mt-8 flex justify-center gap-2">
    {/* Previous Page Button */}
    <button
      // Decrease current page by 1 when clicked
      onClick={() => onPageChange(currentPage - 1)}
      // Disable button when on first page
      disabled={currentPage === 1}
      // Styling: blue when active, gray when disabled
      className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300"
    >
      Previous
    </button>
    
    {/* Page Number Buttons */}
    {/* [...Array(totalPages)] creates an array of undefined elements with length totalPages */}
    {/* We don't use the element value (_), just the index for numbering */}
    {[...Array(totalPages)].map((_, index) => (
      <button
        // key is required by React for list items (using 1-based index)
        key={index + 1}
        // Set page to this button's number (1-based index)
        onClick={() => onPageChange(index + 1)}
        // Dynamic className: blue for current page, gray for other pages
        className={`px-4 py-2 rounded-md ${
          currentPage === index + 1
            ? 'bg-blue-600 text-white'  // Active page styling
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'  // Inactive page styling
        }`}
      >
        {/* Display 1-based index for page numbers */}
        {index + 1} {/* Page number display */}
      </button>
    ))}
    
    {/* Next Page Button */}
    <button
      // Increase current page by 1 when clicked
      onClick={() => onPageChange(currentPage + 1)}
      // Disable button when on last page
      disabled={currentPage === totalPages}
      // Styling: blue when active, gray when disabled
      className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300"
    >
      Next
    </button>
  </div>
);

export default Pagination;