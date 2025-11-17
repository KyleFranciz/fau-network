// file to get the fetch the chat data that may be needed

//imports
import { supabase } from "@/lib/supabaseClient";
import type { EventMessagesI } from "@/schemas/chats.interface";

// function to fetch the chat using the eventId
export const getChatMessages = async (
  eventId: string | undefined,
): Promise<EventMessagesI[]> => {
  // use the eventId to get the chat from the chat table
  try {
    // check if the event id is undefined
    if (typeof eventId === "undefined") {
      console.log("eventId is undefined, make sure that its working properly");
      return [];
    }
    // get the data for the chats
    const data = await supabase
      .from("messages")
      .select("*")
      .eq("event_id", eventId);

    // check if the data is an array if it is return the data if not send an empty array
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("There was an internal error on the fetch", err);
    return [];
  }
};
