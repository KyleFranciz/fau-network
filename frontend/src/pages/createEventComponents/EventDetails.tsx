import type { ReactElement } from "react";
import type { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateEventFormData } from "@/schemas/createEvent.schema";

type EventDetailsProps = {
  register: UseFormRegister<CreateEventFormData>;
  errors: Partial<Record<keyof CreateEventFormData, { message?: string }>>;
};

// plan to add a file upload component here for the image

const EventDetails = (props: EventDetailsProps): ReactElement => {
  const { register, errors } = props;

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your event..."
          rows={5}
          {...register("description")}
          className="rounded-xl resize-none"
          aria-invalid={errors.description ? "true" : "false"}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Optional. Help attendees understand what your event is about.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register("image_url")}
          className="rounded-xl"
          aria-invalid={errors.image_url ? "true" : "false"}
        />
        {errors.image_url && (
          <p className="text-sm text-destructive">{errors.image_url.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Optional. Add an image URL to make your event stand out.
        </p>
      </div>
    </div>
  );
};

export { EventDetails };

