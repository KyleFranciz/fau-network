import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/lib/formatDataTime";
import {
  getUserCreatedEvents,
  getUserAttendedEvents,
  type AttendedEventResponse,
} from "@/services/eventFetchers";
import type { EventI } from "@/schemas/Events.interface";
import { ProfileHeaderCard } from "./profileComponents/ProfileHeaderCard";
import { ProfileNavigationTabs } from "./profileComponents/ProfileNavigationTabs";
import type {
  AttendedEvent,
  CreatedEventStat,
} from "./profileComponents/profile.types";

//TODO: Fix the typing of the component and fix errors in the schema to fix the errors in the lsp

// Helper function to determine event status based on date/time
const getEventStatus = (
  date: string | null,
  time: string | null,
): CreatedEventStat["status"] => {
  if (!date) {
    return "draft";
  }

  const eventDateTime = new Date(`${date} ${time ?? ""}`);
  const now = new Date();

  // Check if date is invalid
  if (isNaN(eventDateTime.getTime())) {
    return "draft";
  }

  // Set time to start of day for comparison
  const eventDate = new Date(eventDateTime);
  eventDate.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // If event date is in the past
  if (eventDate < today) {
    return "completed";
  }

  // If event date is today, consider it "live"
  if (eventDate.getTime() === today.getTime()) {
    return "live";
  }

  // If event date is in the future
  return "published";
};

// Helper function to map EventI to CreatedEventStat
const mapEventToCreatedEventStat = (event: EventI): CreatedEventStat => {
  const status = getEventStatus(event.date, event.time);
  const formattedDate = formatDateTime(event.date, event.time);

  return {
    id: event.id,
    name: event.title ?? "Untitled Event",
    date: formattedDate,
    location: event.location ?? "Location TBA",
    status,
    description: event.description ?? "",
    attendeesCount: event.attendees_count ?? 0,
  };
};

// Helper function to map backend response to AttendedEvent
const mapAttendedEventResponseToAttendedEvent = (
  response: AttendedEventResponse,
): AttendedEvent => {
  const event = response.events;
  const formattedDate = formatDateTime(event.date, event.time);
  const status = response.status as AttendedEvent["status"];

  return {
    id: event.id,
    name: event.title ?? "Untitled Event",
    date: formattedDate,
    location: event.location ?? "Location TBA",
    status: status === "checked-in" || status === "registered" || status === "waitlisted" ? status : "registered",
    description: event.description ?? "",
  };
};

const ProfilePage = (): ReactElement => {
  const { user } = useAuth();

  // Fetch user-created events
  const { data: userEvents = [] } = useQuery<EventI[]>({
    queryKey: ["user-created-events", user?.id],
    queryFn: () => getUserCreatedEvents(user?.id ?? ""),
    enabled: !!user?.id,
  });

  // Fetch user-attended events
  const { data: attendedEventsResponse = [] } = useQuery<AttendedEventResponse[]>({
    queryKey: ["user-attended-events", user?.id],
    queryFn: () => getUserAttendedEvents(user?.id ?? ""),
    enabled: !!user?.id,
  });

  // Map events to CreatedEventStat format
  const createdEvents: readonly CreatedEventStat[] = userEvents.map(
    mapEventToCreatedEventStat,
  );

  // Map attended events response to AttendedEvent format
  const attendedEvents: readonly AttendedEvent[] = attendedEventsResponse.map(
    mapAttendedEventResponseToAttendedEvent,
  );

  return (
    <section className="container mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Profile", isCurrent: true },
        ]}
      />
      <div className="space-y-6">
        <ProfileHeaderCard
          headline="Building thoughtful experiences for the FAU community."
          joinedDate="Sep 2023"
          location="Boca Raton, FL"
          name="Taylor Brooks"
          role="Community Programs Lead"
          upcomingEvents={createdEvents.length}
          username="taylorbrooks"
        />
        <ProfileNavigationTabs
          attendedEvents={attendedEvents}
          createdEvents={createdEvents}
        />
      </div>
    </section>
  );
};

export default ProfilePage;
