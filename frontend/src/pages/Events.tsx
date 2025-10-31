import FeaturedEvents from "./homeComponents/FeaturedEvents";

export default function EventsPage() {
  return (
    <div className="w-full">
      {/* TODO: Add a searchbar here */}
      <section>
        <FeaturedEvents />
      </section>
    </div>
  );
}
