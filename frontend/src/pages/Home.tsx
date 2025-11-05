// NOTE: when making new api calls use https://backend:PORT to make the calls since we are using docker during dev

import Hero from "./homeComponents/hero";
import CTABanner from "./homeComponents/CTABanner";
import Footer from "./homeComponents/Footer";
import EventSection from "@/components/EventSection";
import { getPopularEvents } from "@/services/eventFetchers";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Carousel */}
      <div className="container mx-auto px-4 py-8 pb-16">
        <Hero />
      </div>

      {/* Featured Events Section */}
      {/* NOTE: Changed the component for the customizeable Event section component */}
      <EventSection
        title="Featured Events"
        description="Here are some events going on around campus."
      />

      {/* Popular Events Section */}
      <EventSection
        title="Popular Events"
        description="Here are some events that a lot of students are in."
        queryKey={["events", "popular"]}
        queryFn={getPopularEvents}
      />

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer */}
      <Footer />
    </div>
  );
}
