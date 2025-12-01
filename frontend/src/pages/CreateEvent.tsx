import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEventSchema, type CreateEventFormData } from "@/schemas/createEvent.schema";
import { createEvent } from "@/services/eventMutations";
import { useAuth } from "@/context/AuthContext";
import { EventBasicInfo } from "./createEventComponents/EventBasicInfo";
import { EventDetails } from "./createEventComponents/EventDetails";
import { EventSchedule } from "./createEventComponents/EventSchedule";

const CreateEvent = (): ReactElement => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      navigate("/profile");
    },
  });

  const onSubmit = (data: CreateEventFormData): void => {
    if (!user?.id) {
      return;
    }

    createEventMutation.mutate({
      title: data.title,
      description: data.description || undefined,
      category_id: data.category_id,
      image_url: data.image_url || undefined,
      date: data.date,
      time: data.time,
      location: data.location,
      host_id: user.id,
    });
  };

  const handleCancel = (): void => {
    navigate("/profile");
  };

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
          Create New Event
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill out the form below to create your event
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

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={handleCancel}
                disabled={createEventMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
                disabled={createEventMutation.isPending || !user?.id}
              >
                {createEventMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {createEventMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateEvent;

