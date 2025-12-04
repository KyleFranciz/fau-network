// this file has functions that are used to check each event to for needed data

import { supabase } from "@/lib/supabaseClient";
import type { EventAttendeeStatusI } from "@/schemas/Events.interface";
import { toast } from "sonner";

// function to check registration of the user
export const getAttendanceStatus = async (
  userId: string | undefined,
  eventId: string | undefined,
): Promise<EventAttendeeStatusI | null> => {
  try {
    // check supabase attendee table if user is registered for the event
    const { data, error } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle(); // return a single instance of the data that the user is registered for

    // if the user is not registered for the event
    if (!data) {
      return null;
    }

    // check for error
    if (error) {
      toast.error("There was an error getting attendance");
      return null;
    }

    // get the users information about their attendance to the event
    return data as EventAttendeeStatusI;
  } catch (error) {
    // log the error
    return null;
  }
};
