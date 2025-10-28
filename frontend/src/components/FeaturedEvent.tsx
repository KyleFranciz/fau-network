// this is for the event card casing to hold all the cards for the different categories

// imports
import type React from "react";
import EventCard from "./eventCard";

//interfaces
export interface Event {
  date?: string;
  time?: string;
  title?: string;
  host?: string;
  attendees?: number;
  imageUrl?: string;
}

export interface Catagory {
  category: string;
  events: Event[]; // has an array of events
}

export interface FeaturedEventI {
  categories: Catagory[]; // has an array of obj with different events in each category
}

const FeaturedEvent: React.FC<FeaturedEventI> = ({ categories }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12 space-y-1">
      {categories.map((cat, idx) => (
        <div key={idx}>
          {/* Category Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{cat.category}</h2>
            <p className="text-gray-600">
              Explore upcoming {cat.category.toLowerCase()} events.
            </p>
          </div>

          {/* Scrollable Events Row */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {cat.events.map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturedEvent;
