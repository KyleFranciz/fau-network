import type { ReactElement } from "react";
import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import type { CreateEventFormData } from "@/schemas/createEvent.schema";

type EventScheduleProps = {
  register: UseFormRegister<CreateEventFormData>;
  errors: Partial<Record<keyof CreateEventFormData, { message?: string }>>;
};

const EventSchedule = (props: EventScheduleProps): ReactElement => {
  const { register, errors } = props;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className="rounded-xl"
            aria-invalid={errors.date ? "true" : "false"}
          />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            {...register("time")}
            className="rounded-xl"
            aria-invalid={errors.time ? "true" : "false"}
          />
          {errors.time && (
            <p className="text-sm text-destructive">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location *
        </Label>
        <Input
          id="location"
          placeholder="Enter event location"
          {...register("location")}
          className="rounded-xl"
          aria-invalid={errors.location ? "true" : "false"}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>
    </div>
  );
};

export { EventSchedule };

