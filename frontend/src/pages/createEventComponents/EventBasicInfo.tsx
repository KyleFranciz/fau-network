import type { ReactElement } from "react";
import type { UseFormRegister, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateEventFormData } from "@/schemas/createEvent.schema";

type EventBasicInfoProps = {
  register: UseFormRegister<CreateEventFormData>;
  control: Control<CreateEventFormData>;
  errors: Partial<Record<keyof CreateEventFormData, { message?: string }>>;
};

const categories = [
  { id: "1", label: "Community" },
  { id: "2", label: "Social" },
  { id: "3", label: "Tech" },
  { id: "4", label: "Entertainment" },
  { id: "5", label: "Study" },
  { id: "6", label: "Sports" },
  { id: "7", label: "Professional" },
];

const EventBasicInfo = (props: EventBasicInfoProps): ReactElement => {
  const { register, control, errors } = props;

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          placeholder="Enter event title"
          {...register("title")}
          className="rounded-xl"
          aria-invalid={errors.title ? "true" : "false"}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category_id">Category *</Label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="category_id"
                className="rounded-xl"
                aria-invalid={errors.category_id ? "true" : "false"}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category_id && (
          <p className="text-sm text-destructive">{errors.category_id.message}</p>
        )}
      </div>
    </div>
  );
};

export { EventBasicInfo };

