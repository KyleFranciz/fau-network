// Prefetcher for the details page for the events (activate when user clicks on a link)
import { getSpecificEvent } from "@/services/eventFetchers";
import { getAttendanceStatus } from "@/services/eventCheckers";
import type { QueryClient } from "@tanstack/react-query";

//NOTE: Need to add in prefetch for the rest of the event details as well

export const detailPagePrefetcher = async (
  queryClient: QueryClient,
  eventId: string | undefined,
  userId?: string,
) => {
  if (!eventId) {
    return;
  }

  await queryClient.prefetchQuery({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId),
  });

  if (!userId) {
    return;
  }
  await queryClient.prefetchQuery({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["attendee-status", userId, eventId],
    queryFn: () => getAttendanceStatus(userId, eventId),
  });
};
