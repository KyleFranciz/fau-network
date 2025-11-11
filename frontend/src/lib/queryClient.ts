//NOTE: This file will house the queryClient variable to help with using it with prefetches and other querying needs
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  // settings for the queryClient
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // five minutes before the data is considered stale
      refetchOnWindowFocus: false, // refetch the data if the window is focused on
      retry: 1, // retry once if a fetch fails
    },
  },
});
