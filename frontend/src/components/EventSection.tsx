import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import EventCard from "@/pages/homeComponents/EventCard";
import { formatDateTime } from "@/pages/homeComponents/FeaturedEvents";
import type { EventI } from "@/schemas/Events.interface";
import { getFeaturedEvents } from "@/services/eventFetchers";

interface EventSectionProps {
  title: string;
  description?: string;
  subtitle?: string;
  queryKey?: QueryKey;
  queryFn?: () => Promise<EventI[]>;
}

// NOTE: Reusable event showcase that can load any event grouping via React Query.
export default function EventSection({
  title,
  description,
  queryKey,
  queryFn,
}: EventSectionProps) {
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    // WARNING: Update the key/function together to avoid cache clashes.
    queryKey: queryKey ?? ["events", "featured"], // if there is no queryKey then set the default to FeaturedEvents
    queryFn: queryFn ?? getFeaturedEvents, // if there is no queryFn then use the getFeaturedEvents function
  });

  // function to handle when the event is clicked
  // TODO: set up the functionality later on
  const handleJoinClick = (): void => {
    console.log("Join event clicked");
  };

  return (
    <section className="mb-7 mt-7">
      <div className="container mx-auto px-4">
        <div className="mb-5">
          <h2 className="text-3xl md:text-4xl font-bold mb-1">{title}</h2>
          {description ? (
            <p className="text-muted-foreground">{description}</p>
          ) : null}
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                // NOTE: Consistent display using shared formatter.
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
