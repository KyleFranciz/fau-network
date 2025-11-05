// TODO: Move all the Event interfaces into this file to access and change easier later

// NOTE: This is an event type that houses all the events that we have to choose from
export type EventCategories =
  | "all"
  | "community"
  | "social"
  | "tech"
  | "entertainment"
  | "study"
  | "sports"
  | "professional";

// NOTE: This is the labels for the event types for the navbar
export const EVENT_CATEGORY_LABELS: Record<EventCategories, string> = {
  all: "All Events",
  community: "Community",
  social: "Social",
  tech: "Tech",
  entertainment: "Entertainment",
  study: "Study",
  sports: "Sports",
  professional: "Professional",
};

// Event interface for each event
export interface EventI {
  id: string;
  title: string | null;
  description?: string | null;
  image_url: string | null;
  created_at: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  host_id: string | null;
  attendees_count: number | null; // note: backend typo preserved
}
