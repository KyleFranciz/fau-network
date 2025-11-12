import EventImage from "@/components/EventImage";
import EventImageSkeleton from "@/components/EventImageSkeleton";
import { getSpecificEvent } from "@/services/eventFetchers";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

// TODO: Make a default design to showcase the main image of the event
export default function EventDetailPage() {
  // get the param to use to get the event
  const { eventId } = useParams();

  // function get the getSpecificEvent from the backend
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId),
  });

  // handle when the image is loading
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">Unable to load this event.</p>
      </div>
    );
  }

  if (!event && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">This event could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {isLoading ? (
        <EventImageSkeleton />
      ) : (
        <EventImage imageUrl={event?.image_url} title={event?.title} />
      )}

      {/* TODO: add details section that shows info about the event that the organizer wants the user to know */}
      {/* TODO: add section to showcase the attendees to show all the people in attendance */}
      {/* TODO: make a modal to popup for when the user wants to join an event */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold">
          {event?.title ?? "Loading event..."}
        </h2>
        {event?.description ? (
          <p className="text-lg text-muted-foreground">{event.description}</p>
        ) : isLoading ? (
          <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
        ) : (
          <p className="text-muted-foreground">
            Details for this event will be available soon.
          </p>
        )}
      </div>
    </div>
  );
}
