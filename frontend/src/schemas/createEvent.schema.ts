import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  category_id: z.string().min(1, "Please select a category"),
  image_url: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || z.string().url().safeParse(val).success, {
      message: "Please enter a valid URL",
    }),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  location: z.string().min(3, "Location must be at least 3 characters").max(200, "Location must be less than 200 characters"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

