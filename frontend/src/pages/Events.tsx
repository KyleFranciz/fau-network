import SearchBar from "../components/SearchBar";
import FeaturedEvents from "./homeComponents/FeaturedEvents";

// NOTE: EVENTS IN NAVBAR WILL HAVE A DROPDOWN TO ACCESS THE DIFFERENT EVENT ROUTING
// NOTE: SEARCHBAR WILL JUST BE FOR FILTERING THE EVENTS IN THE PAGE
export default function EventsPage() {
  return (
    <div className="w-full">
      <div className="flex justify-center mt-8">
        <SearchBar />
      </div>
      {/* TODO: Add a searchbar here */}
      {/* TODO: Add a selector to help with the sorting of the events */}
      <section>
        <FeaturedEvents />
      </section>
    </div>
  );
}
