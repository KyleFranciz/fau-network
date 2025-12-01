import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createEventSchema, type CreateEventFormData } from "@/schemas/createEvent.schema";
import { updateEvent, deleteEvent } from "@/services/eventMutations";
import { getSpecificEvent } from "@/services/eventFetchers";
import { useAuth } from "@/context/AuthContext";
import { EventBasicInfo } from "./createEventComponents/EventBasicInfo";
import { EventDetails } from "./createEventComponents/EventDetails";
import { EventSchedule } from "./createEventComponents/EventSchedule";
import { useState, useEffect } from "react";

const EditEvent = (): ReactElement => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch the existing event data
  const {
    data: event,
    isLoading: isLoadingEvent,
    isError: isEventError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId ?? ""),
    enabled: !!eventId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      category_id: "",
      image_url: "",
      date: "",
      time: "",
      location: "",
    },
  });

  // Populate form when event data loads
  useEffect(() => {
    if (event && !isLoadingEvent) {
      // Handle category - could be object or array from backend
      let categoryId = "";
      if (event.catergory) {
        if (Array.isArray(event.catergory)) {
          categoryId = event.catergory[0]?.id ?? "";
        } else {
          categoryId = event.catergory.id ?? "";
        }
      }

      reset({
        title: event.title ?? "",
        description: event.description ?? "",
        category_id: categoryId,
        image_url: event.image_url ?? "",
        date: event.date ?? "",
        time: event.time ?? "",
        location: event.location ?? "",
      });
    }
  }, [event, isLoadingEvent, reset]);

  const updateEventMutation = useMutation({
    mutationFn: (data: CreateEventFormData) => {
      if (!eventId || !user?.id) {
        throw new Error("Missing eventId or user");
      }
      return updateEvent(eventId, {
        title: data.title,
        description: data.description || undefined,
        category_id: data.category_id,
        image_url: data.image_url || undefined,
        date: data.date,
        time: data.time,
        location: data.location,
        host_id: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-events"] });
      navigate("/profile");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: () => {
      if (!eventId || !user?.id) {
        throw new Error("Missing eventId or user");
      }
      return deleteEvent(eventId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-created-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/profile");
    },
  });

  const onSubmit = (data: CreateEventFormData): void => {
    if (!user?.id) {
      return;
    }
    updateEventMutation.mutate(data);
  };

  const handleCancel = (): void => {
    navigate("/profile");
  };

  const handleDelete = (): void => {
    deleteEventMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  if (isLoadingEvent) {
    return (
      <section className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (isEventError || !event) {
    return (
      <section className="container mx-auto max-w-4xl p-4 md:p-8">
        <Card className="rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-base font-medium">Event not found</p>
            <p className="text-sm text-muted-foreground">
              The event you're looking for doesn't exist or you don't have permission to edit it.
            </p>
            <Button className="mt-4 rounded-xl" onClick={handleCancel}>
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Check if user is the host
  if (event.host_id !== user?.id) {
    return (
      <section className="container mx-auto max-w-4xl p-4 md:p-8">
        <Card className="rounded-2xl border border-border bg-card shadow-sm">
          <CardContent className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-base font-medium">Unauthorized</p>
            <p className="text-sm text-muted-foreground">
              You don't have permission to edit this event.
            </p>
            <Button className="mt-4 rounded-xl" onClick={handleCancel}>
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 rounded-xl"
          onClick={handleCancel}
          aria-label="Go back to profile"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Edit Event
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your event information below
        </p>
      </header>

      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Basic Information</h2>
              <EventBasicInfo
                register={register}
                control={control}
                errors={errors}
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-medium">Details</h2>
              <EventDetails register={register} errors={errors} />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-medium">Schedule & Location</h2>
              <EventSchedule register={register} errors={errors} />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl text-white"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={
                  updateEventMutation.isPending ||
                  deleteEventMutation.isPending ||
                  !user?.id
                }
              >
                {deleteEventMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {deleteEventMutation.isPending ? "Deleting..." : "Delete Event"}
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleCancel}
                  disabled={
                    updateEventMutation.isPending ||
                    deleteEventMutation.isPending
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl"
                  disabled={
                    updateEventMutation.isPending ||
                    deleteEventMutation.isPending ||
                    !user?.id
                  }
                >
                  {updateEventMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {updateEventMutation.isPending ? "Updating..." : "Update Event"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Event?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the event
              and all associated data (attendees, messages, etc.).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteEventMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
              disabled={deleteEventMutation.isPending}
            >
              {deleteEventMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {deleteEventMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EditEvent;

