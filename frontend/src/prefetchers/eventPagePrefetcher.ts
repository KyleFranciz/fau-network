// This file has the prefetcher for the events page

import { getCategoryEvents } from "@/services/eventFetchers";
import type { QueryClient } from "@tanstack/react-query"; // QueryClient obj passed into the obj to help with fetching

// prefetcher for the events page
export const eventPagePrefetcher = async (queryClient: QueryClient) => {
  // make a variable to store the initial category to send off to make the fetch
  const initialCategory = "1";

  // make the prefetcher for the initial category on the page
  await queryClient.prefetchQuery({
    queryKey: ["events", "category", initialCategory],
    queryFn: () => getCategoryEvents(initialCategory),
  });
};
