import { useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import type { EventI } from "@/schemas/Events.interface";
import { getFeaturedEvents } from "@/services/eventFetchers";

// TODO: Move this function into a file in the lib folder to help find easier if needed
// function to get the date and time formated correctly
export const formatDateTime = (
  d?: string | null,
  t?: string | null,
): string => {
  if (!d && !t) return "Date TBA";
  const dateObj = d ? new Date(d) : undefined;
  if (dateObj && !isNaN(dateObj.getTime())) {
    const datePart = dateObj.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timePart =
      t ??
      dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    return `${datePart} ${timePart}`;
  }
  return t ?? "Date TBA";
};

export default function FeaturedEvents() {
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<EventI[]>({
    queryKey: ["events", "featured"],

    queryFn: getFeaturedEvents,
  });

  // NOTE: made variable to only house 6 peices of data to render out for the component
  const featuredToShow = events.slice(0, 6);

  const handleJoinClick = (): void => {
    console.log("Join event clicked");
  };

  // NOTE: Made a small tweak to the spacing from the top of the featured events componet
  return (
    <section className="mb-16 mt-7">
      <div className="container mx-auto px-4">
        <div className="mb-5">
          <h2 className="text-3xl md:text-4xl font-bold mb-1">
            Featured Events
          </h2>
          <p className="text-muted-foreground">
            Here are some events going on around campus.
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredToShow.map((event) => (
            <EventCard
              key={event.id}
              date={formatDateTime(event.date ?? event.created_at, event.time)}
              title={event.title ?? "Untitled Event"}
              host={event.host_id ?? "Unknown"}
              attendees={event.attendees_count ?? 0}
              image={event.image_url ?? ""}
              onJoinClick={handleJoinClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
