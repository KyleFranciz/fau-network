// NOTE: when making new api calls use https://backend:PORT to make the calls since we are using docker during dev

import Hero from "./homeComponents/hero";
import FeaturedEvents from "./homeComponents/FeaturedEvents";
import PopularEvents from "./homeComponents/PopularEvents";
import CTABanner from "./homeComponents/CTABanner";
import Footer from "./homeComponents/Footer";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Carousel */}
      <div className="container mx-auto px-4 py-8 pb-16">
        <Hero />
      </div>
      
      {/* Featured Events Section */}
      <FeaturedEvents />
      
      {/* Popular Events Section */}
      <PopularEvents />
      
      {/* CTA Banner */}
      <CTABanner />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
