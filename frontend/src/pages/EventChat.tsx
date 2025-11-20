import { useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle,
  Users,
  MapPin,
  CalendarClock,
  Info,
} from "lucide-react";
import { useParams } from "react-router";
import { formatDateTime } from "./homeComponents/FeaturedEvents";
import { ChatMessage } from "./eventChatComponents/ChatMessage";
import { ChatComposer } from "./eventChatComponents/ChatComposer";
import type {
  ChatMessageData,
  EventMessagesWithUserInfo,
  //SendEventMessageI
} from "@/schemas/chats.interface";
import { getChatMessages } from "@/services/chatFetchers";
import { mapMessagesToChatData } from "@/services/chat.mapper";
import { useAuth } from "@/context/AuthContext";
import { sendChatMessage } from "@/services/chatMutation";

// TODO: CHECK FOR IF THE USER THAT IS ON THE PAGE HAS THE SAME USER ID AS LISTED FOR THE ATTENDEES IN THE CHAT (route to the sign up if prompted)
// TODO: Make the username of the message sender in bold
// this is for the event chat room once the user is attending the event
export default function EventChatPage() {
  // useParams to get the event info from the backend
  const { eventId } = useParams();

  // get the current user
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  // make a query to get the messages from the backend ( plug in function to get messaging data from the backend)
  const {
    data: chatMessages = [],
    isLoading: isChatLoading,
    error: chatError,
  } = useQuery<EventMessagesWithUserInfo[], Error, ChatMessageData[]>({
    queryKey: ["event-messages", eventId],
    enabled: Boolean(eventId),
    queryFn: () => getChatMessages(eventId),
    // map the transport shape to the UI-friendly structure
    select: (messages) => mapMessagesToChatData(messages, user?.id),
  });

  // NOTE: dummy messages gonna connect to the backend at a later date so that the flow works for the messaging
  const [messages] = useState<ChatMessageData[]>([
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
  const [optimisticMessages, setOptimisticMessages] = useState<
    ChatMessageData[]
  >([]);

  const sendMessageMutation = useMutation<
    unknown,
    Error,
    string,
    { optimisticId: string }
  >({
    mutationFn: async (text: string) => {
      if (!eventId) {
        throw new Error("Event ID missing. Please try again.");
      }
      if (!user?.id) {
        throw new Error("You need to be logged in to send messages.");
      }

      return sendChatMessage(eventId, {
        message: text,
        user_id: user.id,
      });
    },
    onMutate: async (text: string) => {
      const optimisticId = `temp-${Date.now()}`;
      const userMetadata = user?.user_metadata as
        | { full_name?: string; avatar_url?: string }
        | undefined;
      const optimisticMessage: ChatMessageData = {
        id: optimisticId,
        senderName: userMetadata?.full_name ?? user?.email ?? "You",
        content: text,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
        avatarUrl: userMetadata?.avatar_url ?? undefined,
      };

      setOptimisticMessages((prev) => [...prev, optimisticMessage]);

      return { optimisticId };
    },
    onError: (_error, _text, context) => {
      if (context?.optimisticId) {
        setOptimisticMessages((prev) =>
          prev.filter((message) => message.id !== context.optimisticId),
        );
      }
    },
    onSettled: (_data, _error, _text, context) => {
      if (context?.optimisticId) {
        setOptimisticMessages((prev) =>
          prev.filter((message) => message.id !== context.optimisticId),
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["event-messages", eventId],
      });
    },
  });

  // make a mutation to handle sending the message to the backend
  // make funciton in chat fetchers file help with sending the message to the route
  const handleSendMessage = (text: string): void => {
    if (!text.trim()) return;
    if (!eventId) {
      console.error("Missing event ID for chat message");
      return;
    }
    if (!user?.id) {
      console.error("User must be logged in to send messages");
      return;
    }
    sendMessageMutation.mutate(text);
  };

  // query to get the chat messages from the backend

  // check if there is an error getting the data
  if (error) {
    // return an error message to the user
    console.error("There was an error loading the chat data", error);
  }
  if (chatError) {
    console.error("There was an error loading the event messages", chatError);
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
  const eventImage = event?.image_url;
  const descriptionCopy = isLoading
    ? "Loading chat details..."
    : (event?.description ?? "Chat is open for all attendees.");
  // leverage the backend results when ready, otherwise fall back to temp seed data
  const baseMessages = chatMessages.length > 0 ? chatMessages : messages;
  const displayedMessages =
    optimisticMessages.length > 0
      ? [...baseMessages, ...optimisticMessages]
      : baseMessages;

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="overflow-hidden border border-border/60 shadow-sm">
            <div className="relative h-48 w-full bg-muted md:h-56">
              {eventImage ? (
                <img
                  src={eventImage}
                  alt={headerTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Event image unavailable
                </div>
              )}
            </div>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Info className="h-4 w-4 text-primary" />
                  <span>Event Details</span>
                </div>
                <CardTitle className="text-xl leading-tight mt-4">
                  {headerTitle}
                </CardTitle>
                <CardDescription className="font-semibold">
                  <span>{descriptionCopy}</span>
                </CardDescription>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-500 font-light gap-3 text-sm">
                  Share plans, rides, or questions with everyone headed to this
                  event.
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
                  {isChatLoading && chatMessages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Loading chat...
                    </p>
                  ) : (
                    displayedMessages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        formattedTimestamp={formatDateTime(
                          message.timestamp,
                          null,
                        )}
                      />
                    ))
                  )}
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
