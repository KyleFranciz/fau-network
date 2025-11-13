import EventImage from "@/components/EventImage";
import EventImageSkeleton from "@/components/EventImageSkeleton";
import EventRegistrationButton from "@/components/EventRegistrationButton";
import { getSpecificEvent } from "@/services/eventFetchers";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { formatDateTime } from "./homeComponents/FeaturedEvents";

// TODO: Make a default design to showcase the main image of the event
export default function EventDetailPage() {
  // get the param to use to get the event
  const { eventId } = useParams();

  // example data to test out the attendees section

  // function get the getSpecificEvent from the backend
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId),
  });

  // query to get the host information for the this page

  // query to get all the attendees for the events to display in list

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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 ">
            <h2 className="text-4xl font-bold">
              {event?.title ?? "Loading event..."}
            </h2>
            {/* TODO: will change with data from when we get the host name that we get from the fetching function */}
            {/*Title section*/}
            <h3 className="text-lg">
              <span>Host: </span>
              <span className=" font-bold">
                {event?.host_id ? `Host: ${event.host_id}` : "Loading..."}
              </span>
            </h3>
            <div>
              {/* Description Section */}
              <h3 className="font-medium text-[1.2rem]">
                {event?.location ?? "loading"}
              </h3>
              {/* Date Section */}
              <h3 className="text-lg">
                {event?.date ? formatDateTime(event.date) : "date loading..."}
              </h3>
            </div>
            {event?.description ? (
              <p className="text-lg text-muted-foreground">
                {event.description}
              </p>
            ) : isLoading ? (
              <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
            ) : (
              <p className="text-muted-foreground">
                Details for this event will be available soon.
              </p>
            )}
          </div>
          <div></div>
          {/* About Event Section event might be added*/}
        </div>

        <EventRegistrationButton label="Register for this event" />
      </div>
    </div>
  );
}
