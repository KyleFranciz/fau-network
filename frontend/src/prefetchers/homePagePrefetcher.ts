// This file has the prefetcher function(s) for the home page

// imports
import { getFeaturedEvents } from "@/services/eventFetchers";
import { QueryClient } from "@tanstack/react-query"; // passed into the function to help with prefetching and caching data

// home page prefetcher function (function is called in the navbar when link is hovered on)
export const homePagePrefetcher = async (queryClient: QueryClient) => {
  // make prefetch for the featured events
  await queryClient.prefetchQuery({
    queryKey: ["events", "featured"],
    queryFn: getFeaturedEvents,
  });

  // make prefetch for the popular events
  await queryClient.prefetchQuery({
    queryKey: ["events", "popular"],
    queryFn: getFeaturedEvents,
  });

  // function doesn't need to return anything
};
