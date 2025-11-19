import EventImage from "@/components/EventImage";
import EventImageSkeleton from "@/components/EventImageSkeleton";
import EventRegistrationButton from "@/components/EventRegistrationButton";
import { getSpecificEvent } from "@/services/eventFetchers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { formatDateTime } from "./homeComponents/FeaturedEvents";
import { useAuth } from "@/context/AuthContext";
import { registerForEvent } from "@/services/eventMutations";
import { queryClient } from "@/lib/queryClient";
import { getAttendanceStatus } from "@/services/eventCheckers";
import ActionCalloutCard from "@/components/ActionCalloutCard";
import ActionCalloutCardSkeleton from "@/components/ActionCalloutCardSkeleton";
import { AlertCircle, MessageSquare } from "lucide-react";
// import { toast } from "sonner";

// Page for the event details
export default function EventDetailPage() {
  // get the param to use to get the event
  const { eventId } = useParams();

  // state to check keep track of the attendance status
  // const [userAttendance, setUserAttendace] = useState(false);

  // useNavigate to move user to the chatpage
  const navigate = useNavigate();

  // check for the users current login status and get the user obj
  const { user } = useAuth(); // used to pass in the userId
  const userId = user?.id;

  // useMutation function to update the attendee and the event information upon registration
  const makeRegistration = useMutation({
    mutationKey: ["event-registration", eventId], // update the event info upon registration
    mutationFn: () => registerForEvent(eventId, user?.id),
    // route the user to the chatpage upon registration
    onSuccess: () => {
      // invalidate the query so that the event_id has to refresh
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });

      // navigate to the next page
      navigate(`/event/${eventId}/chat`);
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes("Missing user")) {
        navigate("/signup");
      }
    },
  });

  // function get data for this event details page
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", eventId],
    // fires again after the query is invalidated
    queryFn: () => getSpecificEvent(eventId),
  });

  // TODO: make a funtion to get the host information for the this page

  // function to get users attendee status
  const {
    data: attendeeData,
    isLoading: attendanceLoading,
    isError: attendanceError,
    refetch: refetchAttendanceStatus, // used to refetch the users attendance status manually
  } = useQuery({
    queryKey: ["attendee-status", userId, eventId],
    queryFn: () => getAttendanceStatus(userId, eventId),
    enabled: Boolean(userId && eventId), // only fires when a user is signed in and there is an eventId present
  });

  // loading state for checking registration
  const isCheckingRegistration =
    attendanceLoading && Boolean(userId && eventId);

  // check the status
  const isRegistered = attendeeData?.status === "registered"; // stores the bool value to be use in component render

  // query to get all the attendees for the events to display in list might not add

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
      {/* TODO: Link the registration component to pop up with the register component*/}
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
                {event?.host_id ? `Host: ${event.host_id}` : "loading..."}
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
            {/* NOTE: Attendees Count (add in the logo show case next to the number of attendees) */}
            <h3 className="font-semibold">{event?.attendees_count ?? ""}</h3>
            {/* Description Section */}
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
          {/* About Event Section event might be added*/}
          <div></div>
        </div>

        {/* NOTE: Make this show up if the user isnt registered for the event */}
        {isCheckingRegistration ? (
          <ActionCalloutCardSkeleton />
        ) : attendanceError ? (
          <ActionCalloutCard
            title="Unable to confirm registration"
            description="We ran into an issue checking your registration status. Please try again."
            buttonLabel="Retry check"
            icon={AlertCircle}
            onAction={() => refetchAttendanceStatus()}
          />
        ) : isRegistered ? (
          <ActionCalloutCard
            title="You Are Registered"
            description="Go ahead and check out the chat with all the other attendees"
            buttonLabel="Chat With Attendees"
            icon={MessageSquare}
            onAction={() => navigate(`/event/${eventId}/chat`)}
          />
        ) : (
          <EventRegistrationButton
            label="Register for this event"
            onRegister={() => makeRegistration.mutate()}
          />
        )}
        {/* TODO: Make an open chat section open up that takes the user to the chatpage if they are already registered */}
      </div>
    </div>
  );
}
