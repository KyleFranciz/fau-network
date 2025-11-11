// NOTE: when making new api calls use https://backend:PORT to make the calls since we are using docker during dev

import Hero from "./homeComponents/hero";
import CTABanner from "./homeComponents/CTABanner";
import Footer from "./homeComponents/Footer";
import FeaturedEvents from "./homeComponents/FeaturedEvents";
import PopularEvents from "./homeComponents/PopularEvents";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Carousel */}
      <div className="container mx-auto px-4 py-8 pb-12">
        <Hero />
      </div>

      {/* Featured Events Section */}
      {/* NOTE: Changed the component for the customizeable Event section component */}
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
