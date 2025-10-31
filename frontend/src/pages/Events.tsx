import SearchBar from "../components/SearchBar";
import FeaturedEvents from "./homeComponents/FeaturedEvents";

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
