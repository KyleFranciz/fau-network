import { ChatHeader } from "@/components/ChatHeader";
import type { EventI } from "@/schemas/Events.interface";
import { getSpecificEvent } from "@/services/eventFetchers";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

// TODO:

// this is for the event chat room once the user is attending the event
export default function EventChatPage() {
  // useParams to get the event info from the backend
  const { eventId } = useParams();

  // query to get the event info to display to the user on this page
  const {
    data: event,
    isLoading,
    error,
  } = useQuery<EventI>({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId),
  });

  // query to get the chat messages from the backend

  // check if there is an error getting the data
  if (error) {
    // return an error message to the user
    console.error("There was an error loading the chat data", error);
  }
  return (
    <div>
      {/* NOTE: make the top half have the have the event name and wrapped in component to show the event info */}
      <ChatHeader
        eventTitle={event?.title ? event.title : "Event failed to load"}
        eventImage={event?.image_url ? event.image_url : "failed"}
      />
      {/* NOTE: Chat section will be bellow here (messages will load here) */}
      {/* NOTE: Might make the chat section show on the left of the page with the users other chats */}
      {/* TODO: Add functionality to have the user to be able to swap to different chats of the events that they're in */}
    </div>
  );
}
