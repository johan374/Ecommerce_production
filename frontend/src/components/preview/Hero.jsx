import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

// Using absolute paths from public folder
const images = {
  electronics: [
    '/assets/Electronics/laptop/laptop.png',
    '/assets/Electronics/phone/smartphone.png',
    '/assets/Electronics/tool.png',
    '/assets/Electronics/tv/tv.png'
  ],
  food: [
    '/assets/Food/meals.png',
    '/assets/Food/snack_Beverages.png'
  ],
  groceries: [
    '/assets/Food/groceries.png',
    '/assets/Food/groceries2.png'
  ]
};

function Hero() {
  const [electronicsIndex, setElectronicsIndex] = useState(0);
  const [foodIndex, setFoodIndex] = useState(0);
  const [groceriesIndex, setGroceriesIndex] = useState(0);

  // Effect for cycling through electronics images
  useEffect(() => {
    const timer = setInterval(() => {
      setElectronicsIndex((prevIndex) => (prevIndex + 1) % images.electronics.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Effect for cycling through food images
  useEffect(() => {
    const timer = setInterval(() => {
      setFoodIndex((prevIndex) => (prevIndex + 1) % images.food.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Effect for cycling through groceries images
  useEffect(() => {
    const timer = setInterval(() => {
      setGroceriesIndex((prevIndex) => (prevIndex + 1) % images.groceries.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-gray-900 pt-16">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75" />
      
      {/* Content container */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
          Discover Our Premium Products
        </h1>

        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto text-center">
          From fresh groceries to cutting-edge electronics...
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Electronics Card */}
          <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 h-64">
            <img 
              src={images.electronics[electronicsIndex]}
              alt="Electronics showcase" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 p-6">
                <h3 className="text-2xl font-bold text-white">Electronics</h3>
                <p className="text-gray-200 mt-2">Latest gadgets and smart devices</p>
              </div>
            </div>
          </div>

          {/* Food Card */}
          <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
            <img 
              src={images.food[foodIndex]}
              alt="Food showcase" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 p-6">
                <h3 className="text-2xl font-bold text-white">Fresh Food</h3>
                <p className="text-gray-200 mt-2">Quality meals and ingredients</p>
              </div>
            </div>
          </div>

          {/* Groceries Card */}
          <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
            <img 
              src={images.groceries[groceriesIndex]}
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
          <Link 
            to="/shop" 
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;