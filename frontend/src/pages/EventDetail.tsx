import EventImage from "@/components/EventImage";
import EventImageSkeleton from "@/components/EventImageSkeleton";
import EventRegistrationButton from "@/components/EventRegistrationButton";
import { getSpecificEvent } from "@/services/eventFetchers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { formatDateTime } from "./homeComponents/FeaturedEvents";
import { useAuth } from "@/context/AuthContext";
import {
  registerForEvent,
  unregisterForEvent,
  updateEventStatus,
} from "@/services/eventMutations";
import { queryClient } from "@/lib/queryClient";
import { getAttendanceStatus } from "@/services/eventCheckers";
import { getUserProfile } from "@/services/user";
import ActionCalloutCard from "@/components/ActionCalloutCard";
import ActionCalloutCardSkeleton from "@/components/ActionCalloutCardSkeleton";
import { AlertCircle, MessageSquare } from "lucide-react";
import { getUserProfile } from "@/services/user";
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
  const userId = user?.id ? user?.id : "";

  // Admin State
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [removalReason, setRemovalReason] = useState("");

  // Fetch user profile for admin check
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId ?? null),
    enabled: Boolean(userId),
  });
  const isAdmin = userProfile?.admin ?? false;

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

  const shouldCheckRegistration = Boolean(userId && eventId);

  // function to get the the user's profile information to pass into register and unregister function
  // TODO: Account for the error state
  const { data: profileData, error: profileError } = useQuery({
    queryKey: ["profile-data", userId, eventId],
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });

  // function to get users attendee status
  const {
    data: attendeeData,
    isLoading: attendanceLoading,
    isError: attendanceError,
    refetch: refetchAttendanceStatus, // used to refetch the users attendance status manually
  } = useQuery({
    queryKey: ["attendee-status", userId, eventId],
    queryFn: () => getAttendanceStatus(userId, eventId),
    enabled: shouldCheckRegistration, // only fires when a user is signed in and there is an eventId present
  });

  // loading state for checking registration
  const isCheckingRegistration = attendanceLoading && shouldCheckRegistration;

  // check the status
  const isRegistered = attendeeData?.status === "registered"; // stores the bool value to be use in component render

  // useMutation function to update the attendee and the event information upon registration
  const registerMutation = useMutation({
    mutationKey: ["event-registration", eventId], // update the event info upon registration
    mutationFn: () =>
      registerForEvent(
        eventId,
        user?.id,
        profileData?.name, // users username to be sent to the backend
        profileData?.email, // users email is sent to the backend
      ),
    // route the user to the chatpage upon registration
    onSuccess: () => {
      // invalidate the query so that the event_id has to refresh
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      refetchAttendanceStatus(); // refetch the attendees status

      // navigate to the next page
      navigate(`/event/${eventId}/chat`);
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes("Missing user")) {
        navigate("/signup");
      }
    },
  });

  // mutation to handle the user unregistering for the event
  const unregisterMutation = useMutation({
    mutationKey: ["event-unregister", eventId],
    mutationFn: () => unregisterForEvent(user?.id, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      refetchAttendanceStatus();
    },
  });

  // mutation to handle updating event status (admin)
  const updateStatusMutation = useMutation({
    mutationFn: ({ status, reason }: { status: string; reason?: string }) => {
      if (!eventId || !user?.id) throw new Error("Missing ID");
      return updateEventStatus(eventId, status, user.id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      setIsRemoveDialogOpen(false);
      setRemovalReason("");
    },
  });

  // handle the pending state of the users registration
  const isMutatingRegistration =
    registerMutation.isPending || unregisterMutation.isPending;

  // handles showing the status of the users registration in the event image when the user registers or unregisters
  const canShowHeroRegistrationAction =
    shouldCheckRegistration && !attendanceError;

  // NOTE: query to get all the attendees for the events to display in list might not add

  // handle if theres an error getting the event details
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

  // Handle Removed Event for Non-Admins
  if (event?.status === "removed" && !isAdmin) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h1 className="mb-2 text-2xl font-bold">Event Removed</h1>
          <p className="mb-6 text-muted-foreground">
            This event has been removed by an administrator.
          </p>
          {event.removal_reason && (
            <div className="mx-auto mb-8 max-w-md rounded-xl bg-muted/50 p-4 text-left">
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Reason for removal
              </p>
              <p className="text-sm">{event.removal_reason}</p>
            </div>
          )}
          <Button className="rounded-xl" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {isAdmin && (
        <div className="rounded-2xl border border-destructive/50 bg-destructive/5 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-destructive">
                <AlertCircle className="h-4 w-4" />
                Admin Controls
              </h3>
              <p className="text-sm text-muted-foreground">
                You have admin access to this event.
              </p>
              {event?.status === "removed" && (
                <p className="mt-1 text-sm font-medium text-destructive">
                  Status: REMOVED (Reason: {event.removal_reason})
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {event?.status !== "removed" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl text-white!"
                  onClick={() => setIsRemoveDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Event
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() =>
                    updateStatusMutation.mutate({ status: "active" })
                  }
                  disabled={updateStatusMutation.isPending}
                >
                  Restore Event
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <EventImageSkeleton />
      ) : (
        // shows the event image and the status of the user
        <EventImage
          imageUrl={event?.image_url}
          title={event?.title}
          isRegistered={isRegistered}
          isCheckingStatus={isCheckingRegistration}
          isActionDisabled={isMutatingRegistration}
          onRegister={
            canShowHeroRegistrationAction
              ? () => registerMutation.mutate()
              : undefined
          }
          onUnregister={
            canShowHeroRegistrationAction
              ? () => unregisterMutation.mutate()
              : undefined
          }
        />
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
            title="You're Already Registered"
            description="Go ahead and check out the chat with all the other attendees"
            buttonLabel="Chat With Attendees"
            icon={MessageSquare}
            onAction={() => navigate(`/event/${eventId}/chat`)}
          />
        ) : (
          <EventRegistrationButton
            label="Register for this event"
            onRegister={() => registerMutation.mutate()}
          />
        )}
        {/* TODO: Make an open chat section open up that takes the user to the chatpage if they are already registered */}
      </div>

      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Remove Event (Admin)</DialogTitle>
            <DialogDescription>
              This will hide the event from users. You must provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Removal Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g. Violation of community guidelines..."
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl text-white"
              onClick={() =>
                updateStatusMutation.mutate({
                  status: "removed",
                  reason: removalReason,
                })
              }
              disabled={!removalReason.trim() || updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Removing..." : "Remove Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
