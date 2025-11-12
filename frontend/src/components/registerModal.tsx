
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EventI } from "@/schemas/Events.interface";
import { getEventById } from "@/services/eventFetchers";

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

  const { data: eventData = [], isPending } = useQuery<EventI[]>({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId ?? ""),
    enabled: eventId !== null,
  });

  console.log(eventData);

  const selectedEvent = useMemo<EventI | null>(
    () => (eventData.length > 0 ? eventData[0] : null),
    [eventData]
  );

  const handleClose = (): void => {
    setRegisterModalOpen(false);
  };

  const handleSubmit = (submitEvent: React.FormEvent<HTMLFormElement>): void => {
    submitEvent.preventDefault();
    handleClose();
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
            <p className="text-sm text-muted-foreground">
              You are registering for{" "}
              <span className="font-medium">{selectedEvent.title}</span>.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <input
            required
            aria-label="Full name"
            placeholder="Full name"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            required
            type="email"
            aria-label="Email address"
            placeholder="Email address"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Close
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-sm text-white hover:bg-primary/80"
            >
              Register
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
