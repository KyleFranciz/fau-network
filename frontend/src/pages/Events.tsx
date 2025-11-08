import EventSection from "@/components/EventSection";
import SearchBar from "../components/SearchBar";
import { getPopularEvents, getCategoryEvents } from "@/services/eventFetchers";
import { useState } from "react";

// NOTE: SEARCHBAR WILL JUST BE FOR FILTERING THE EVENTS IN THE PAGE
export default function EventsPage() {
  // state to hold the category from the backend and update when switched
  const [categoryId, setCategoryId] = useState<string>("1");

  // category selector options to map through on the select section
  // TODO: UPDATE THE SUPABASE CATEGORY TABLE TO NEW ID'S
  const categories = [
    { id: "1", label: "" },
    { id: "2", label: "" },
    { id: "3", label: "" },
    { id: "4", label: "" },
    { id: "5", label: "" },
  ];

  //NOTE: useQuery is used in the EventSection component to get the different category events

  return (
    <div className="w-full">
      <div className="flex justify-center mt-8">
        <SearchBar />
        {/* TODO: ADD A SELECTOR TO GET EVENTS TO LOAD OUT ON THE PAGE DEPENDING ON THE EVENT (Map through categories) */}
        <select onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>
      {/* TODO: Add a searchbar here */}
      {/* TODO: Add a selector to help with the sorting of the events */}
      <section>
        <EventSection
          title="Featured Events"
          description="Here are some of the events going on around campus"
        />
        <EventSection
          title="Popular Events"
          description="Here are some of the popular events going on around campus"
          queryKey={["events", "popular"]}
          queryFn={getPopularEvents}
        />
        <EventSection
          title="Study Events"
          description="Here are some of the study events going on around campus"
          queryKey={["events", "category", categoryId]}
          queryFn={() => getCategoryEvents(categoryId)}
        />
      </section>
    </div>
  );
}
