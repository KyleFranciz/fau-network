import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import type { EventI } from "@/schemas/Events";

const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "http://localhost:8000";

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
  const [events, setEvents] = useState<EventI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // TODO: REFACTOR TO AXIOS TO MAKE DATA MANAGEMENT EASIER
  // TODO: ALSO ADD USEQUERY TO HELP WITH REFETCHES FOR NECESSARY PAGES AND COMPONENTS.
  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setHasError(false);
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (_err) {
        setHasError(true);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

        {!isLoading && hasError && (
          <div className="rounded-2xl border border-border bg-card p-6 text-destructive shadow-sm">
            Could not load events.
          </div>
        )}

        {!isLoading && !hasError && events.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground shadow-sm">
            No events yet. Check back soon.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
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
