import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router";
import { formatDateTime } from "./homeComponents/FeaturedEvents";
import { ChatMessage } from "./eventChatComponents/ChatMessage";
import { ChatComposer } from "./eventChatComponents/ChatComposer";
import { ChatBubbleLoader } from "./eventChatComponents/ChatBubbleLoader";
import type {
  ChatMessageData,
  EventMessagesWithUserInfo,
  //SendEventMessageI
} from "@/schemas/chats.interface";
import { getChatMessages } from "@/services/chatFetchers";
import { mapMessagesToChatData } from "@/services/chat.mapper";
import { useAuth } from "@/context/AuthContext";
import { sendChatMessage } from "@/services/chatMutation";
import { supabase } from "@/lib/supabaseClient";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { unregisterForEvent } from "@/services/eventMutations";

// WARNING: Check the useMutation to see why the messages aren't automatically refreshing
// TODO: Make the username of the message sender in bold
// this is for the event chat room once the user is attending the event
export default function EventChatPage() {
  // useParams to get the event info from the backend
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  // get the current user
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // NOTE: Query to get the event info to display to the user on this page
  const {
    data: event,
    isLoading,
    error,
  } = useQuery<EventI>({
    queryKey: ["event", eventId],
    queryFn: () => getSpecificEvent(eventId ?? ""),
    enabled: Boolean(eventId),
  });

  // NOTE: Query to get all the chat messages from the backend chat route so it can be put through a mapper
  const {
    data: chatMessages = [], // chatMessage = to an array
    isLoading: isChatLoading,
    error: chatError,
    // get the data that the query receives from the backend, along with the error and then returns the mapper data in the ChatMessageData type
  } = useQuery<EventMessagesWithUserInfo[], Error, ChatMessageData[]>({
    queryKey: ["event-messages", eventId],
    // enable the query if the eventId is present
    enabled: Boolean(eventId),
    queryFn: () => getChatMessages(eventId), // function to get the chat messages
    // NOTE: used a map function to map and transform the data shape into the UI-friendly structure so that it can send to the frontend
    select: (messages) => mapMessagesToChatData(messages, user?.id),
  });

  // NOTE: dummy data to show in the UI component so that the UI looks like it has messages on the initial load (will remove later on)
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

  // useEffect to clear the message when the real data load (might remove and refractor later on)
  useEffect(() => {
    if (messages && messages.length > 0) {
      setOptimisticMessages([]);
    }
  }, [messages]); // changes when the messages update

  // initialization of the state that stores the data of the messages in the new transformed state to be mapped through
  const [optimisticMessages, setOptimisticMessages] = useState<
    ChatMessageData[]
  >([]);

  // NOTE: Mutation to send the messages to the backend
  const sendMessageMutation = useMutation<
    unknown, // payload from the mutation that we get back is known, I will fix the typing later on to make sure that it proper
    Error, // mutation also catches the errors that may pop up
    string, // the type in the mutation that we send is a string the (text)
    { optimisticId: string } // this is to help opperate on specific messages later on if needed
  >({
    // function gets the message from the input
    mutationFn: async (text: string) => {
      // checks to make sure that the required fields are met otherwise throw an error
      if (!eventId) {
        throw new Error("Event ID missing. Please try again.");
      }
      if (!user?.id) {
        throw new Error("You need to be logged in to send messages.");
      }

      // send the message otherwise
      return sendChatMessage(eventId, {
        message: text,
        user_id: user.id,
      });
    },
    // when theres a mutation when the message is attempted to be sent
    onMutate: async (text: string) => {
      // onMutate returns the optimisticId to the other parts that need it
      const optimisticId = `temp-${Date.now()}`; // used to get the specific data later on

      // NOTE: update the users user_metadata so that the full_name and the avatar_url is stored inisde of it
      const userMetadata = user?.user_metadata as
        | { full_name?: string; avatar_url?: string }
        | undefined;

      // message that will show on the frontend when the initial message is sending to the backend
      const optimisticMessage: ChatMessageData = {
        // use the ChatMessageData structure to structure the message that shows on the frontend
        id: optimisticId,
        senderName: userMetadata?.full_name ?? user?.email ?? "You",
        content: text,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
        avatarUrl: userMetadata?.avatar_url ?? undefined,
      };

      // add and update the messages to the array of the other messages
      setOptimisticMessages((prev) => [...prev, optimisticMessage]);

      // return the id to access the specific message later in the function
      return { optimisticId };
    },

    // incase things go wrong
    onError: (_error, _text, context) => {
      // NOTE: The optimisticId is from the useMutation optimisticId that can be accessed anywhere in the function
      // upon an error then
      if (context?.optimisticId) {
        // in the optimisticMessage filter out the message so that it doesn't stay on the UI
        setOptimisticMessages((prev) =>
          prev.filter((message) => message.id !== context.optimisticId),
        );
      }
    },
    onSettled: async (_data, _error, _text, context) => {
      // start the invalidation so that the query can in the mean time
      await queryClient.invalidateQueries({
        queryKey: ["event-messages", eventId],
      });

      // remove the replacement message after the query refetches and updates with only the messages that id that dont match fake messages
      if (context?.optimisticId) {
        setOptimisticMessages((prev) =>
          prev.filter((message) => message.id !== context.optimisticId),
        );
      }
    },
  });

  // mutate function to handle sending the messages to backend
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
    // call the mutation function and pass in the text to send
    sendMessageMutation.mutate(text);
  };

  // mutation to unregister the user from the event
  const unregisterMutation = useMutation({
    mutationKey: ["event-unregister", eventId],
    mutationFn: () => unregisterForEvent(user?.id, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      // navigate the user to the home page after they unregister for the event
      (queryClient.invalidateQueries({
        queryKey: ["attendee-status", user?.id, eventId],
      }),
        navigate("/"));
    },
  });

  // use this function for the button to unregister the user
  const handleUnregister = (): void => {
    if (!eventId || !user?.id) {
      return;
    }
    unregisterMutation.mutate();
  };

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

  // show the attendanceCount if not then set the default to 18
  const attendanceCount = event?.attendees_count ?? 18;

  // tittle for the event
  const headerTitle = isLoading
    ? "Loading event..."
    : event?.title
      ? event.title
      : "Event failed to load";

  // image for the event
  const eventImage = event?.image_url;

  // help with the loading state an showing the description of the event
  const descriptionCopy = isLoading
    ? "Loading chat details..."
    : (event?.description ?? "Chat is open for all attendees.");
  // leverage the backend results when ready, otherwise fall back to temp seed data

  // show the default messages unless there are messages to show on the frontend
  const baseMessages = chatMessages.length > 0 ? chatMessages : messages;

  // holds the messages to display in the message box
  const displayedMessages =
    optimisticMessages.length > 0
      ? [...baseMessages, ...optimisticMessages]
      : baseMessages;

  // add in a subscription to the messaging get alerts and refresh when there are new messages
  useEffect(() => {
    if (!eventId) {
      return;
    }

    const channel = supabase
      .channel(`event-${eventId}-messages`)
      .on<EventMessagesWithUserInfo>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "event_messages",
          filter: `event_id=eq.${eventId}`,
        },
        (payload: RealtimePostgresInsertPayload<EventMessagesWithUserInfo>) => {
          // messages that we get back from the payload (database table)
          const eventMessage = payload.new;

          // dont update for the users own messages already (handled by the optimisticMessage)
          if (eventMessage.user_id == user?.id) {
            return;
          }

          // invalidate and refetch the data from the backend
          queryClient.invalidateQueries({
            queryKey: ["event_messages", eventId],
          });
        },
      )
      .subscribe();

    // clean up after update (remove the channel after)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, user?.id, queryClient]);

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
              <button
                type="button"
                onClick={handleUnregister}
                disabled={unregisterMutation.isPending}
                className="mt-6 w-full rounded-xl bg-black text-white px-4 py-3 text-base font-semibold text-destructive-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {unregisterMutation.isPending
                  ? "Leaving event..."
                  : "Leave Event"}
              </button>
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
                    <ChatBubbleLoader />
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
