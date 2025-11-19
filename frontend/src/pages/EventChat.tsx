import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EventI } from "@/schemas/Events.interface";
import { getSpecificEvent } from "@/services/eventFetchers";
import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle,
  Users,
  MapPin,
  CalendarClock,
  Info,
} from "lucide-react";
import { useParams } from "react-router";
import { formatDateTime } from "./homeComponents/FeaturedEvents";
import {
  ChatMessage,
  type ChatMessageData,
} from "./eventChatComponents/ChatMessage";
import { ChatComposer } from "./eventChatComponents/ChatComposer";

// TODO: CHECK FOR IF THE USER THAT IS ON THE PAGE HAS THE SAME USER ID AS LISTED FOR THE ATTENDEES IN THE CHAT (route to the sign up if prompted)
// TODO: Make the username of the message sender in bold
// TODO: move the image to the event detail section to make the UI look cleaner, get rid of the event title at the top and move it to the left

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
    queryFn: () => getSpecificEvent(eventId ?? ""),
    enabled: Boolean(eventId),
  });

  // make a query to get the messages from the backend

  // NOTE: dummy messages gonna connect to the backend at a later date so that the flow works for the messaging
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: "msg-1",
      senderName: "Marina Lopez",
      content:
        "Is anyone bringing extra blankets for the movie under the stars tonight?",
      timestamp: new Date().toISOString(),
      avatarUrl:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&w=80&q=80",
      isCurrentUser: false,
    },
    {
      id: "msg-2",
      senderName: "Jude Hill",
      content:
        "I'll pack a couple! Also grabbing snacks from Breezeway if anyone wants anything.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      avatarUrl:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=80&q=80",
      isCurrentUser: false,
    },
    {
      id: "msg-3",
      senderName: "You",
      content: "Thanks Jude! Can you grab a sparkling water for me?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      avatarUrl:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&w=80&q=80",
      isCurrentUser: true,
    },
  ]);

  // make a mutation to handle sending the message to the backend
  // make funciton in chat fetchers file help with sending the message to the route
  const handleSendMessage = (text: string): void => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length + 1}`,
        senderName: "You",
        content: text,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
        avatarUrl:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&w=80&q=80",
      },
    ]);
  };

  // query to get the chat messages from the backend

  // check if there is an error getting the data
  if (error) {
    // return an error message to the user
    console.error("There was an error loading the chat data", error);
  }

  // logic for formating the event details in the UI
  const eventDateDisplay = formatDateTime(
    event?.date ?? event?.created_at,
    event?.time,
  );
  const attendanceCount = event?.attendees_count ?? 18;
  const headerTitle = isLoading
    ? "Loading event..."
    : event?.title
      ? event.title
      : "Event failed to load";
  const headerImage = event?.image_url ?? "failed";
  const descriptionCopy = isLoading
    ? "Loading chat details..."
    : (event?.description ?? "Chat is open for all attendees.");

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* NOTE: make the top half have the have the event name and wrapped in component to show the event info */}
        <ChatHeader eventTitle={headerTitle} eventImage={headerImage} />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-primary" /> Event Details
              </CardTitle>
              <CardDescription>
                Share plans, rides, or questions with everyone headed to this
                event.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span>{descriptionCopy}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span>{eventDateDisplay}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event?.location ?? "Location TBA"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{attendanceCount} attendees chatting</span>
              </div>
            </CardContent>
          </Card>

          <Card className="flex min-h-[70vh] flex-col border border-border/60 shadow-md">
            <CardHeader className="border-b border-border/60">
              <div className="flex items-center gap-2 text-base font-semibold">
                <MessageCircle className="h-5 w-5 text-primary" />
                Event Chat
              </div>
              <CardDescription>
                You are in a chatroom with other attendees to the event that
                your planning to go to please make sure to keep everything
                respectful.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden px-0 py-0">
              <ScrollArea className="h-full px-6 py-6">
                <div className="flex flex-col gap-5">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      formattedTimestamp={formatDateTime(
                        message.timestamp,
                        null,
                      )}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className=" border-t border-border/60">
              <ChatComposer onSubmit={handleSendMessage} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
