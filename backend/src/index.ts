// This is  the main file for running the backend server

// imports
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient";
import cors from "cors";
// import { request } from "http";
import { CategoryParams } from "./schema/category.schema";
import { EventParams, EventRegisterParams } from "./schema/events.schema";
import {
  EventMessage,
  EventMessageBody,
  EventMessageWithUser,
} from "./schema/messages.schema";

// env variables that are needed to run the server
dotenv.config();

// change the .env variable into a number
const PORT = Number(process.env.PORT) || 8000;

// initialize the server, and assign it to a variable (everything inbetween runs )
const app = express();

// create the middleware to be able to parse the json
app.use(express.json()); // middleware that makes sure the request that are json to be broken down

// cors
app.use(
  cors({
    origin: "http://localhost:5173", // the frontend port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// routes

// testing route
app.get("/", (_request: Request, response: Response) => {
  // send a test message
  response.send("If your seeing this the backend request is working properly");
});

// route to create a new event
app.post("/events", async (request: Request, response: Response) => {
  try {
    const {
      title,
      description,
      category_id,
      image_url,
      date,
      time,
      location,
      host_id,
    } = request.body;

    // Validate required fields
    if (!title || !category_id || !date || !time || !location || !host_id) {
      return response.status(400).json({
        error: "Missing required fields: title, category_id, date, time, location, host_id",
      });
    }

    // Insert the new event into Supabase
    const { data, error } = await supabase
      .from("events")
      .insert({
        title,
        description: description || null,
        category_id,
        image_url: image_url || null,
        date,
        time,
        location,
        host_id,
        attendees_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error.message);
      return response.status(500).json({ error: error.message });
    }

    return response.status(201).json(data);
  } catch (err) {
    console.error("Server Error:", err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

// supabase route to fetch all events (featured events)
app.get("/events", async (_request: Request, response: Response) => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    response.status(500).json({ error: error.message });
  }
  response.json(data);
});

// supabase route to fetch an event by id

// TODO: route to get all the popular events
app.get("/events/popular", async (_request: Request, response: Response) => {
  try {
    // get the events with over 10 attendees (changing later possibly)
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("attendees_count", "10"); // NOTE: get value greater than or equal to...
    //NOTE: changed value to string to cause supabase makes evals based of strings

    // check if there is an error when getting the data from supabase
    if (error) {
      console.error("supabase error:", error.message);
      response.status(500).json({ error: error.message });
      // return stop the call
      return;
    }

    // otherwise return the data
    return response.json(data);
  } catch (err) {
    // if there is an error in the server
    console.error("Server Error:", err);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// route to fetch a specific event by id
app.get(
  "/event/:eventId",
  async (request: Request<EventParams>, response: Response) => {
    try {
      const { eventId } = request.params;
      const { data, error } = await supabase
        .from("events")
        .select(`*, categories(*)`)
        .eq("id", eventId)
        .single();

      if (error) {
        console.error("Supabase Error:", error.message);
        return response.status(500).json({ error: error.message });
      }

      if (!data) {
        return response.status(404).json({ error: "Event not found" });
      }

      return response.json(data);
    } catch (err) {
      console.error("Server Error:", err);
      response.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// NOTE: gets the category from the request param to search supabase table
app.get(
  "/events/category/:categoryId",
  async (_request: Request<CategoryParams>, response: Response) => {
    try {
      // fetch events from the study category in display them on the frontend
      // TODO: CHANGE THE VALUE TO THE REQUEST ROUTIING WHEN SELECTED

      // save the categoryId from request
      const { categoryId } = _request.params;

      //NOTE: might do a check to see if the param is equal to all's id and look up all events and then return

      console.log(categoryId);

      const { data, error } = await supabase
        .from("events")
        .select(`*, categories(*)`) // NOTE: get all the elements for the events as well as the data from the category table
        .eq("category_id", categoryId);

      // check if there was an error
      if (error) {
        console.error("Supabase Error:", error.message);
        response.status(500).json({ error: error.message });
        // exit the function
        return;
      }

      // return the data
      return response.json(data);
    } catch (err) {
      console.error("Server Error", err);
      response.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// route to fetch events created by a specific user (host)
app.get(
  "/events/host/:hostId",
  async (request: Request<{ hostId: string }>, response: Response) => {
    try {
      const { hostId } = request.params;

      const { data, error } = await supabase
        .from("events")
        .select(`*, categories(*)`)
        .eq("host_id", hostId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
        return response.status(500).json({ error: error.message });
      }

      return response.json(data ?? []);
    } catch (err) {
      console.error("Server Error", err);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// route to update an event (only by host)
app.put(
  "/events/:eventId",
  async (request: Request<{ eventId: string }>, response: Response) => {
    try {
      const { eventId } = request.params;
      const {
        title,
        description,
        category_id,
        image_url,
        date,
        time,
        location,
        host_id,
      } = request.body;

      // Validate required fields
      if (!title || !category_id || !date || !time || !location || !host_id) {
        return response.status(400).json({
          error: "Missing required fields: title, category_id, date, time, location, host_id",
        });
      }

      // First, verify the event exists and the user is the host
      const { data: existingEvent, error: fetchError } = await supabase
        .from("events")
        .select("host_id")
        .eq("id", eventId)
        .single();

      if (fetchError || !existingEvent) {
        return response.status(404).json({ error: "Event not found" });
      }

      if (existingEvent.host_id !== host_id) {
        return response.status(403).json({
          error: "You are not authorized to update this event",
        });
      }

      // Update the event
      const { data, error } = await supabase
        .from("events")
        .update({
          title,
          description: description || null,
          category_id,
          image_url: image_url || null,
          date,
          time,
          location,
        })
        .eq("id", eventId)
        .select()
        .single();

      if (error) {
        console.error("Supabase Error:", error.message);
        return response.status(500).json({ error: error.message });
      }

      return response.json(data);
    } catch (err) {
      console.error("Server Error:", err);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// route to delete an event (only by host)
app.delete(
  "/events/:eventId",
  async (request: Request<{ eventId: string }>, response: Response) => {
    try {
      const { eventId } = request.params;
      const { host_id } = request.body;

      if (!host_id) {
        return response.status(400).json({ error: "host_id is required" });
      }

      // First, verify the event exists and the user is the host
      const { data: existingEvent, error: fetchError } = await supabase
        .from("events")
        .select("host_id")
        .eq("id", eventId)
        .single();

      if (fetchError || !existingEvent) {
        return response.status(404).json({ error: "Event not found" });
      }

      if (existingEvent.host_id !== host_id) {
        return response.status(403).json({
          error: "You are not authorized to delete this event",
        });
      }

      // Delete related records first (event_attendees, event_messages)
      await supabase.from("event_attendees").delete().eq("event_id", eventId);
      await supabase.from("event_messages").delete().eq("event_id", eventId);

      // Delete the event
      const { error } = await supabase.from("events").delete().eq("id", eventId);

      if (error) {
        console.error("Supabase Error:", error.message);
        return response.status(500).json({ error: error.message });
      }

      return response.json({ message: "Event deleted successfully" });
    } catch (err) {
      console.error("Server Error:", err);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// route to register for an event
app.post(
  "/events/register/:eventId",
  async (request: Request<EventRegisterParams>, response: Response) => {
    try {
      const { eventId, userId, registeredDate } = request.body;

      // NOTE: data isn't being returned (noting for lsp reasons, might just remove as a variable)
      const { data, error } = await supabase.from("event_attendees").insert({
        event_id: eventId,
        user_id: userId,
        status: "registered",
        joined_at: registeredDate,
      });
      if (error) {
        console.error("Supabase Error:", error.message);
        response.status(500).json({ error: error.message });
        return;
      }

      // After the user is registered, update the event attendees count
      // Fetch the current attendees_count
      const { data: currentEvent, error: fetchError } = await supabase
        .from("events")
        .select("attendees_count")
        .eq("id", eventId)
        .single();

      if (fetchError) {
        console.error("Supabase Fetch Error:", fetchError.message);
        response.status(500).json({ error: fetchError.message });
        return;
      }

      // Update the attendees_count
      const { data: updatedEvent, error: updateError } = await supabase
        .from("events")
        .update({ attendees_count: (currentEvent?.attendees_count || 0) + 1 }) // sets to zero if no attendees_count and add 1
        .eq("id", eventId);

      if (updateError) {
        console.error("Supabase Update Error:", updateError.message);
        response.status(500).json({ error: updateError.message });
        return;
      }

      // NOTE: Returns the updated events data to the frontend
      response.json(updatedEvent);
    } catch (err) {
      console.error("Server Error", err);
      response.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// route to unregister from an event
app.delete(
  "/event/register/:eventId",
  async (request: Request<EventRegisterParams>, response: Response) => {
    try {
      // get the params from the request
      const { eventId, userId } = request.body; // might not need to use the registeredDate to remove the user

      // remove the user from the attendees table for the event (might not need to return the data)
      const { data, error } = await supabase
        .from("event_attendees")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId);

      // check if there was an error removing the user from the table
      if (error) {
        return response.json({
          error: `There was an error deleting the user: ${error}`,
        });
      }

      // otherwise
      return response.json({
        message: `This user got deleted from the database: ${data}`,
      });
    } catch (error) {
      // catch if there is an error with deleting the user from the database
      response.json({
        error: `There was an error deleting the user: ${error}`,
      });
    }
  },
);

// function to get the chat messages from the backend
app.get(
  "/event/:eventId/chat",
  async (request: Request<{ eventId: string }>, response: Response) => {
    try {
      // use the event id from the param
      const { eventId } = request.params;

      // get the event message from supabase to package later in this function
      const { data: messageData, error: messageError } = await supabase
        .from("event_messages")
        .select(
          `id, event_id, user_id, message, created_at, users:user_id( full_name, profile_image)`,
        )
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

      // if there is are no messages in the chat
      // if (messageData?.length === 0) {
      //   return response
      //     .status(404)
      //     .json({ error: "There is are no messages in this event" });
      // }

      if (messageError) {
        console.error("Supabase Error:", messageError.message);
        return response.status(500).json({ error: messageError.message });
      }

      // handle if the message data is available or not
      response
        .status(200)
        .json({ messages: (messageData ?? []) as EventMessageWithUser[] });
    } catch (err) {
      console.error("Server Error", err);
      response.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// route to send messages to the database
app.post(
  "/event/:eventId/chat",
  async (
    request: Request<{ eventId: string }, EventMessageBody>,
    response: Response,
  ) => {
    try {
      // assign the variables and do all the checking

      // get the event id from the request param (might have to tweak later)
      const { eventId } = request.params;

      // get the message and the user_id from the request body
      const { message, user_id } = request.body;

      // check if there is a message or user_id
      if (!message || !user_id) {
        response.status(400).json({ error: "Message or user_id is missing" });
        return;
      }

      //add the message to the event messages
      const { data, error } = await supabase
        .from("event_messages")
        .insert([
          {
            event_id: eventId,
            user_id: user_id,
            message: message, // messages sent to the backend
          },
        ])
        .select(
          `id, event_id, user_id, message, created_at, users:user_id ( full_name, profile_image)`,
        )
        .single();

      // check for an error
      if (error) {
        throw error;
      }
      // return the one message that the user just sent
      response.status(200).json({ message: data as EventMessageWithUser }); // returns the single message with all the info about the user that just sent the message
    } catch (err) {
      console.error("Server Error", err);
      response.status(500).json({ error: "Internal Server Error" });
      return;
    }
  },
);

// TODO: make a route to get the profile data from supabase user table for profile pictures and user display names

// start the actual server
// listen - has the port run on 5000 and then the 0.0.0.0 listens to everything so that docker can connect and run
app.listen(PORT, "0.0.0.0", () => {
  console.log("This server is running on the correct port rn:" + PORT);
});
