//NOTE: this file will have the mutation functions that interact with the backend api, these functions will be used in useMutations to handle mutating data for different events for the components that need them
import axios from "axios";
import type { EventI, EventRegisterI } from "@/schemas/Events.interface";
import { toast } from "sonner"; // used to add popups to notify the progress of event registration

// import the .env variable
const API_BASE_URL =
  // NOTE: This checks to make sure that the url does not equal to undefined and that it is the .env
  typeof import.meta !== "undefined" && "http://localhost:8000"
    ? // if it does then make the value the api
      "http://localhost:8000"
    : // if not set the value to the default
      "http://localhost:8000";

// NOTE: function to register for an event used in the useMutation hook calls
// NOTE: Add in the username in to be passed in to be sent to the backend
export const registerForEvent = async (
  eventId: string | undefined,
  userId: string | undefined,
  name: string | undefined,
  email: string | undefined,
): Promise<EventRegisterI> => {
  try {
    // check if there is any userId or eventId before trying
    if (!userId || !eventId) {
      toast.info("Please sign in to register");
      throw Error("Missing user or eventId");
    }

    // TODO: REMOVE BEFORE PROD!
    toast.info(`Registering for event ${eventId} for user ${userId}`);

    // get the response back with the upadated event data after registering
    const response = await axios.post(
      `${API_BASE_URL}/events/register/${eventId}`,
      {
        // for the supabase table
        eventId: eventId,
        userId: userId,
        registeredDate: new Date().toISOString(), // keeps track for the database and the spredsheet
        // needed for the spredsheet
        name: name,
        email: email,
      },
    );

    // notify of success
    toast.success("Successfully registerd for event");

    return response.data as EventRegisterI; // made this way so use Mutation fails if the user isn't logged in
  } catch (error) {
    console.error("Error registering for event:", error);
    toast.error("There was an error registering for an event");
    // throw error so that the fetch fails for the mutation used
    throw error;
  }
};

// interface for creating an event
export interface CreateEventPayload {
  title: string;
  description?: string;
  category_id: string;
  image_url?: string;
  date: string;
  time: string;
  location: string;
  host_id: string;
}

// function to create a new event
export const createEvent = async (
  payload: CreateEventPayload,
): Promise<EventI> => {
  try {
    const response = await axios.post<EventI>(
      `${API_BASE_URL}/events`,
      payload,
    );
    toast.success("Event created successfully!");
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    toast.error("There was an error creating the event");
    throw error;
  }
};

// NOTE: make a function to remove the make a request to remove the data from the backend
export const unregisterForEvent = async (
  userId: string | undefined,
  eventId: string | undefined,
): Promise<EventRegisterI> => {
  try {
    if (!userId || !eventId) {
      toast.error(
        "Please make sure that you are signed in to complete the deletion",
      );
      throw new Error("userId or eventId is missing");
    }

    // notify the user on the frontend of the event that's being deleted
    toast.info(`Deleting ${eventId} from the database`);

    // make the request to delete the event to the backend
    const response = await axios.delete(
      `${API_BASE_URL}/event/register/${eventId}`,
      // format the data that's being sent
      { data: { eventId: eventId, userId: userId } },
    );

    // return the data that was deleted
    return response.data as EventRegisterI;
  } catch (error) {
    console.error(`There was and error deleting the event from the database`);
    throw error;
  }
};

// interface for updating an event
export interface UpdateEventPayload {
  title: string;
  description?: string;
  category_id: string;
  image_url?: string;
  date: string;
  time: string;
  location: string;
  host_id: string;
}

// function to update an event
export const updateEvent = async (
  eventId: string,
  payload: UpdateEventPayload,
): Promise<EventI> => {
  try {
    const response = await axios.put<EventI>(
      `${API_BASE_URL}/events/${eventId}`,
      payload,
    );
    toast.success("Event updated successfully!");
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    toast.error("There was an error updating the event");
    throw error;
  }
};

export const updateEventStatus = async (
  eventId: string,
  status: string,
  userId: string,
  removalReason?: string,
): Promise<EventI> => {
  try {
    const response = await axios.patch<EventI>(
      `${API_BASE_URL}/events/${eventId}/status`,
      { status, userId, removal_reason: removalReason },
    );
    toast.success(`Event ${status === "removed" ? "removed" : "updated"} successfully!`);
    return response.data;
  } catch (error) {
    console.error("Error updating event status:", error);
    toast.error("There was an error updating the event status");
    throw error;
  }
};

// function to delete an event
export const deleteEvent = async (
  eventId: string,
  hostId: string,
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
      data: { host_id: hostId },
    });
    toast.success("Event deleted successfully!");
  } catch (error) {
    console.error("Error deleting event:", error);
    toast.error("There was an error deleting the event");
    throw error;
  }
};
