import React from "react";
import Hero from "../../components/preview/Hero";
import Benefits from "../../components/preview/Benefits";
import FeaturedProducts from "../../components/preview/FeaturedProducts";

function PreviewHome() {
  return (
    <div className="pt-16">
      <Hero />
      <Benefits />
      <FeaturedProducts />
    </div>
  );
}

export default PreviewHome;