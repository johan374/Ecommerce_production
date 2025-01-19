// components/ImageCarousel.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images, currentIndex, onUpdateIndex, category = 'Electronics' }) => {
    const getImageSrc = (image) => {
        try {
            if (image?.image_url?.startsWith('http')) {
                return image.image_url;
            }
            return `/assets/${category}/laptop/${image.image_url}`;
        } catch (error) {
            console.error('Error getting image source:', error);
            return '/default-image.png';
        }
    };

    // Add handlers with stopPropagation
    const handlePrevClick = (e) => {
        e.stopPropagation(); // Stop event from bubbling up
        onUpdateIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const handleNextClick = (e) => {
        e.stopPropagation(); // Stop event from bubbling up
        onUpdateIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    return (
        <div className="relative w-full h-64">
            <img
                src={getImageSrc(images[currentIndex])}
                alt={images[currentIndex]?.alt_text}
                className="w-full h-full object-contain object-center"
                onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = "/default-image.png";
                }}
            />
            {images.length > 1 && (
                <>
                    <button 
                        onClick={handlePrevClick} // Use new handler
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button 
                        onClick={handleNextClick} // Use new handler
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;