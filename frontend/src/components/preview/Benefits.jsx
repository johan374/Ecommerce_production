import React, { useState, useEffect, useRef } from 'react';
import { Truck, Shield, Stars, HeadphonesIcon } from 'lucide-react';

function Benefits() {
    // State to control overall visibility of the component
    const [isVisible, setIsVisible] = useState(false);

    // State to manage animation stages of different elements
    // Each element has a boolean flag to control its animation
    const [animationStages, setAnimationStages] = useState({
        title: false,
        subtitle: false,
        firstCard: false,
        secondCard: false,
        thirdCard: false,
        fourthCard: false
    });

    // Create a ref to reference the section in the DOM
    // This allows us to observe when the section enters the viewport
    const sectionRef = useRef(null);

    useEffect(() => {
        // Create an Intersection Observer to detect when the component enters the viewport
        const observer = new IntersectionObserver(
            // Callback function that runs when observation conditions change
            (entries) => {
                // Get the first (and only) entry in the observations
                const entry = entries[0];

                // Check if the component is intersecting (visible in viewport)
                // AND it hasn't already been set to visible
                if (entry.isIntersecting && !isVisible) {
                    // Mark the component as visible
                    setIsVisible(true);
                    
                    // Define animation stages with different delays
                    // This creates a staggered animation effect
                    const stages = [
                        { key: 'title', delay: 600 },      // Title appears first
                        { key: 'subtitle', delay: 800 },   // Subtitle appears next
                        { key: 'firstCard', delay: 1000 },  // First card appears after subtitle
                        { key: 'secondCard', delay: 1200 }, // Second card appears next
                        { key: 'thirdCard', delay: 1400 }, // Third card appears later
                        { key: 'fourthCard', delay: 1600 } // Last card appears last
                    ];

                    // Loop through stages and set each to true with a delay
                    stages.forEach(stage => {
                        setTimeout(() => {
                            // Update the animation stages
                            // This triggers the CSS transition for each element
                            setAnimationStages(prev => ({ 
                                ...prev,   // Preserve previous states
                                [stage.key]: true  // Set current stage to true
                            }));
                        }, stage.delay);
                    });
                }
            },
            {
                // Trigger when 10% of the component is visible
                // Lower threshold means it will trigger earlier
                threshold: 0.1 
            }
        );

        // Get the current DOM element from the ref
        const currentRef = sectionRef.current;

        // Start observing the element if it exists
        if (currentRef) {
            observer.observe(currentRef);
        }

        // Cleanup function to stop observing when component unmounts
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [isVisible]); // Re-run effect if visibility changes

    // If component is not visible, render a placeholder
    // This placeholder has a height to trigger the intersection observer
    if (!isVisible) {
        return (
            <div 
                ref={sectionRef} 
                className="h-[500px]" // Placeholder height
            />
        );
    }

    return (
        // Main container with a dark background and overflow hidden
        <div 
            ref={sectionRef} // Reference to track the section in the viewport
            className="relative bg-gray-900 overflow-hidden"
        >
            {/* Gradient overlay background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75" />
            
            {/* Content container with responsive padding and max width */}
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                {/* Section header with centered text */}
                <div className="text-center mb-16">
                    {/* Section title with animation */}
                    <h2 className={`text-3xl font-bold text-white sm:text-4xl 
                        // Transition for smooth animation
                        transition-all duration-700 ease-out
                        // Conditional classes based on animation stage
                        ${animationStages.title 
                            ? 'opacity-100 translate-y-0'  // Visible and in original position when true
                            : 'opacity-0 translate-y-10'  // Invisible and slightly moved down when false
                        }`}>
                        Why Choose us
                    </h2>
                    
                    {/* Subtitle with similar animation logic */}
                    <p className={`mt-4 text-lg text-gray-300
                        transition-all duration-700 ease-out
                        ${animationStages.subtitle 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-10'}`}>
                        Experience the best in online shopping with our premium services
                    </p>
                </div>
                
                {/* Grid container for benefits cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Fast Delivery Card */}
                    <div className={`bg-gray-800 p-6 rounded-lg text-center
                        // Transition for smooth animation
                        transition-all duration-700 ease-out
                        // Conditional classes based on animation stage
                        ${animationStages.firstCard 
                            ? 'opacity-100 translate-y-0'  // Visible and in original position when true
                            : 'opacity-0 translate-y-10'  // Invisible and slightly moved down when false
                        }`}>
                        {/* Card icon container */}
                        <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 rounded-md">
                            <Truck className="h-6 w-6 text-white" />
                        </div>
                        {/* Card title */}
                        <h3 className="mt-4 text-xl font-semibold text-white">Fast Delivery</h3>
                        {/* Card description */}
                        <p className="mt-2 text-gray-300">Free shipping on orders above $50</p>
                    </div>
                    
                    {/* Subsequent cards follow the same animation pattern */}
                    {/* Secure Payment Card */}
                    <div className={`bg-gray-800 p-6 rounded-lg text-center
                        transition-all duration-700 ease-out
                        ${animationStages.secondCard 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-10'}`}>
                        <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 rounded-md">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-white">Secure Payment</h3>
                        <p className="mt-2 text-gray-300">100% secure payment methods</p>
                    </div>
                    
                    {/* Quality Products Card */}
                    <div className={`bg-gray-800 p-6 rounded-lg text-center
                        transition-all duration-700 ease-out
                        ${animationStages.thirdCard 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-10'}`}>
                        <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 rounded-md">
                            <Stars className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-white">Quality Products</h3>
                        <p className="mt-2 text-gray-300">Certified quality products</p>
                    </div>
                    
                    {/* 24/7 Support Card */}
                    <div className={`bg-gray-800 p-6 rounded-lg text-center
                        transition-all duration-700 ease-out
                        ${animationStages.fourthCard 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-10'}`}>
                        <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 rounded-md">
                            <HeadphonesIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-white">24/7 Support</h3>
                        <p className="mt-2 text-gray-300">Dedicated support team</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Benefits;