//NOTE: this file will have the mutation functions that interact with the backend api, these functions will be used in useMutations to handle mutating data for different events for the components that need them
import axios from "axios";
import type { EventRegisterI } from "@/schemas/Events.interface";
import { toast } from "sonner"; // used to add popups to notify the progress of event registration

// import the .env variable
const API_BASE_URL =
  // NOTE: This checks to make sure that the url does not equal to undefined and that it is the .env
  typeof import.meta !== "undefined" && "http://localhost:8000"
    ? // if it does then make the value the api
      "http://localhost:8000"
    : // if not set the value to the default
      "http://localhost:8000";

// function to register for an event used in the useMutation hook calls
export const registerForEvent = async (
  eventId: string | undefined,
  userId: string | undefined,
): Promise<EventRegisterI | null> => {
  try {
    // TODO: REMOVE BEFORE PROD!
    toast.info(`Registering for event ${eventId} for user ${userId}`);

    // get the response back with the upadated event data after registering
    const response = await axios.post(
      `${API_BASE_URL}/events/register/${eventId}`,
      {
        eventId: eventId,
        userId: userId,
        registeredDate: new Date().toISOString(),
      },
    );

    // notify of success
    toast.success("Successfully registerd for event");

    return response.data as EventRegisterI | null;
  } catch (error) {
    console.error("Error registering for event:", error);
    toast.error("There was an error registering for an event");
    return null;
  }
};
