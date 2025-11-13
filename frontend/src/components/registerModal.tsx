import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EventI } from "@/schemas/Events.interface";
import { getSpecificEvent } from "@/services/eventFetchers";
import checkUser from "@/hooks/checkUser";
import { useEffect, useState } from "react";
import LoginForm from "@/pages/authComponents/loginForm";
import { registerForEvent } from "@/services/eventMutations";

type RegisterModalProps = {
  eventId: string | null;
  registerModalOpen: boolean;
  setRegisterModalOpen: (isOpen: boolean) => void;
};

export default function RegisterModal({
  eventId,
  registerModalOpen,
  setRegisterModalOpen,
}: RegisterModalProps) {
  // pass the evnet id to our query to get the event data
  const { data: eventData, isPending } = useQuery<EventI>({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId ?? undefined),
    enabled: eventId !== null,
  });

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const user = checkUser();

  console.log(user);

  // call the checkUser hook to see if the user is logged in
  // if the user isn't logged in, we will display a form to signin/signup
  useEffect(() => {
    if (user) {
      setUserIsLoggedIn(true);
    } else {
      console.log("User is not logged in");
      setUserIsLoggedIn(false);
    }
  }, [user]);

  const selectedEvent = useMemo<EventI | null>(() => {
    if (!eventData) {
      return null;
    }
    return eventData;
  }, [eventData]);

  // function to close the modal, we are triggering the passed prop to close the modal
  const handleClose = (): void => {
    setRegisterModalOpen(false);
  };

  const handleSubmit = (): void => {
    console.log("Registering for event");
    handleClose();
    registerForEvent(eventId ?? "", user?.id ?? "").then(() => {
      console.log(`Event ${eventId} registered for user ${user?.id}`);
    });
  };

  return (
    <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
      <DialogContent className="max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Register for Event
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2">
          {isPending && (
            <p className="text-sm text-muted-foreground">
              Loading event details…
            </p>
          )}
          {!isPending && !selectedEvent && (
            <p className="text-sm text-muted-foreground">
              Select an event to continue.
            </p>
          )}
          {selectedEvent && (
            <>
              <p className="text-sm text-muted-foreground">
                You are registering for{" "}
                <span className="font-medium text-black">
                  {selectedEvent.title}
                </span>
                .
              </p>

              <img
                src={selectedEvent.image_url ?? ""}
                alt={selectedEvent.title ?? ""}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-sm text-muted-foreground">
                {selectedEvent.description}
              </p>

              <p className="text-sm  text-black">{selectedEvent.location}</p>
              <p className="text-sm text-muted-foreground">
                {selectedEvent.date}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">
                  {selectedEvent.attendees_count}
                </span>{" "}
                attending
              </p>
            </>
          )}
        </div>

        {/* if the user is not logged in, we will prompt them to signup or login */}
        {!userIsLoggedIn && (
          <div className="flex justify-center items-center py-12">
            <LoginForm initialMode="signup" />
          </div>
        )}

        {/* if the user is logged in, we will display a button to register for the event */}
        <div className="flex justify-end items-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl cursor-pointer bg-muted px-4 py-2 text-sm text-foreground hover:bg-muted/80 border border-border"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`rounded-xl px-4 py-2 text-sm text-white ${!userIsLoggedIn ? "bg-black/40 cursor-not-allowed" : "bg-primary hover:bg-primary/80 cursor-pointer"}`}
            disabled={!userIsLoggedIn}
          >
            Register
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
