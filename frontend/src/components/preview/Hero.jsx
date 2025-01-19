// Import all images with correct paths (going up to src then down to assets)
import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

// Import Electronics images
import laptop from '/src/assets/Electronics/laptop/laptop.png';
import smartphone from '/src/assets/Electronics/phone/smartphone.png';
import tool from '/src/assets/Electronics/tool.png';
import tv from '/src/assets/Electronics/tv/tv.png';

// Import Food images
import groceries from '/src/assets/Food/groceries.png';
import groceries2 from '/src/assets/Food/groceries2.png';
import meals from '/src/assets/Food/meals.png';
import snackBeverages from '/src/assets/Food/snack_Beverages.png';  // Make sure this filename matches exactly

function Hero() {
  // Using the imported images
  const electronicsImages = [laptop, smartphone, tool, tv];
  const foodImages = [meals, snackBeverages];
  const groceriesImages = [groceries, groceries2];

  const [electronicsIndex, setElectronicsIndex] = useState(0);
  const [foodIndex, setFoodIndex] = useState(0);
  const [groceriesIndex, setGroceriesIndex] = useState(0);

  // Effect for cycling through electronics images
  useEffect(() => {
    const timer = setInterval(() => {
      setElectronicsIndex((prevIndex) => (prevIndex + 1) % electronicsImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, []);

  // Effect for cycling through food images
  useEffect(() => {
    const timer = setInterval(() => {
      setFoodIndex((prevIndex) => (prevIndex + 1) % foodImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // useEffect hook to manage the automatic image carousel
  useEffect(() => {
    //setInterval creates a time-based loop:
    // Create a timer that runs a function repeatedly
    const timer = setInterval(() => {
      // Update the groceries image index using the previous state
      setGroceriesIndex((prevIndex) => {
        // Calculate the next index:
        // prevIndex + 1: move to next image
        // % groceriesImages.length: loop back to 0 when we reach the end
        // Example with 4 images: 0->1->2->3->0->1...
        // what happen 1 % 2 -> 2 % 2 -> 1 % 2...
        return (prevIndex + 1) % groceriesImages.length; //groceriesImages.length is 2 in this case
      });
    }, 3000); // Run this every 3000 milliseconds (3 seconds)

    // Cleanup function that runs when component unmounts
    // This prevents memory leaks by clearing the timer
    return () => clearInterval(timer);
    
  }, []); // Empty dependency array means this effect runs only once when component mounts

  return (
    // Main container with dark background and padding top
    <div className="relative bg-gray-900 pt-16">
    {/* Gradient overlay that covers the entire container */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75" />
    
    {/* Content container with max width and responsive padding */}
    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
      {/* Main heading - responsive font sizes for different screen sizes */}
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
        Discover Our Premium Products
      </h1>

      {/* Subheading with max width and centered alignment */}
      <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto text-center">
        From fresh groceries to cutting-edge electronics...
      </p>

      {/* Grid container for the three cards
          - 1 column on mobile (grid-cols-1)
          - 3 columns on medium screens and up (md:grid-cols-3) */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        
        {/* Electronics Card */}
        <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 h-64">
          {/* Image that changes based on electronicsIndex */}
          <img 
            src={electronicsImages[electronicsIndex]}
            alt="Electronics showcase" 
            className="w-full h-64 object-cover"  /* Changed from h-64 to h-48 to match container */
          />
          {/* Gradient overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
            {/* Text content positioned at bottom */}
            <div className="absolute bottom-0 p-6">
              <h3 className="text-2xl font-bold text-white">Electronics</h3>
              <p className="text-gray-200 mt-2">Latest gadgets and smart devices</p>
            </div>
          </div>
        </div>

          {/* Food Card with Image Carousel */}
          <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
            <img 
              src={foodImages[foodIndex]}
              alt="Food showcase" 
              className="w-full h-64 object-cover"
            /> {/* inset is equal to  
            .inset-0 {
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
            }*/}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 p-6">
                <h3 className="text-2xl font-bold text-white">Fresh Food</h3>
                <p className="text-gray-200 mt-2">Quality meals and ingredients</p>
              </div>
            </div>
          </div>

          {/* Groceries Card with Image Carousel */}
          <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
            <img 
              src={groceriesImages[groceriesIndex]}
              alt="Groceries showcase" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 p-6">
                <h3 className="text-2xl font-bold text-white">Groceries</h3>
                <p className="text-gray-200 mt-2">Essential household items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
            <Link to="/shop" className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
                Explore Products
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;