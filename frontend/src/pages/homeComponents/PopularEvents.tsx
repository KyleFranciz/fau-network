import { useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import { formatDateTime } from "./FeaturedEvents";
import type { EventI } from "@/schemas/Events.interface";
import { getPopularEvents } from "@/services/eventFetchers";

export default function PopularEvents() {
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<EventI[]>({
    queryKey: ["events", "popular"],
    queryFn: getPopularEvents,
  });

  //NOTE: made this to keep the amount of cards rendered to 6 elements
  const popularToShow = events.slice(0, 6);

  const handleJoinClick = (): void => {
    console.log("Join event clicked");
  };

  return (
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Popular Events
          </h2>
          <p className="text-muted-foreground">
            Here are events that a lot of students are in.
          </p>
        </div>
        {isLoading && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            Loading…
          </div>
        )}

        {!isLoading && isError && (
          <div className="rounded-2xl border border-border bg-card p-6 text-destructive shadow-sm">
            Could not load events.
          </div>
        )}

        {!isLoading && !isError && events.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground shadow-sm">
            No events yet. Check back soon.
          </div>
        )}

        {!isLoading && !isError && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularToShow.map((event) => (
              <EventCard
                key={event.id}
                date={formatDateTime(
                  event.date ?? event.created_at,
                  event.time,
                )}
                title={event.title ?? "Untitled Event"}
                host={event.host_id ?? "Unknown"}
                attendees={event.attendees_count ?? 0}
                image={event.image_url ?? ""}
                onJoinClick={handleJoinClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
