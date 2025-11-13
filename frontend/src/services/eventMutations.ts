//NOTE: this file will have the mutation functions that interact with the backend api, these functions will be used in useMutations to handle mutating data for different events for the components that need them
import axios from "axios";
import type { EventRegisterI } from "@/schemas/Events.interface";

// import the .env variable
const API_BASE_URL =
  // NOTE: This checks to make sure that the url does not equal to undefined and that it is the .env
  typeof import.meta !== "undefined" && "http://localhost:8000"
    ? // if it does then make the value the api
      "http://localhost:8000"
    : // if not set the value to the default
      "http://localhost:8000";


// function to register for an event
export const registerForEvent = async (eventId: string, userId: string): Promise<EventRegisterI | null> => {
  try {
    console.log(`Registering for event ${eventId} for user ${userId}`);
    const response = await axios.post(`${API_BASE_URL}/events/register/${eventId}`, {
      eventId: eventId,
      userId: userId,
      registeredDate: new Date().toISOString(),
    });
    return response.data as EventRegisterI | null;
  } catch (error) {
    console.error("Error registering for event:", error);
    return null;
  }
};