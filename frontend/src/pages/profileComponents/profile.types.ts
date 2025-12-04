export type AttendedEvent = {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly location: string;
  readonly status: "checked-in" | "registered" | "waitlisted";
  readonly description: string;
};

export type CreatedEventStat = {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly location: string;
  readonly status: "draft" | "published" | "live" | "completed" | "removed";
  readonly description: string;
  readonly attendeesCount: number;
  readonly removalReason?: string | null;
};

