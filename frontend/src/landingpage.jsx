import React from 'react'
import Navbar from './components/common/Navbar'
import Hero from './components/preview/Hero'
import Benefits from './components/preview/Benefits'
import FeaturedProducts from './components/preview/FeaturedProducts'
import Footer from './components/common/Footer'

function Landingpage() {
  console.log('Landingpage rendering') // Debug log
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <Footer />
    </div>
  )
}

export default Landingpage