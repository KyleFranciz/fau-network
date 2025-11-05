import EventSection from "@/components/EventSection";
import SearchBar from "../components/SearchBar";

// NOTE: SEARCHBAR WILL JUST BE FOR FILTERING THE EVENTS IN THE PAGE
export default function EventsPage() {
  return (
    <div className="w-full">
      <div className="flex justify-center mt-8">
        <SearchBar />
        {/* TODO: ADD A SELECTOR TO GET EVENTS TO LOAD OUT ON THE PAGE DEPENDING ON THE EVENT */}
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
        />
      </section>
    </div>
  );
}
