// This is  the main file for running the backend server

// imports
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient";
import cors from "cors";
// import { request } from "http";
import { CategoryParams } from "./schema/category.schema";

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

// supabase route to fetch all events (featured events)
app.get("/events", async (_request: Request, response: Response) => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    response.status(500).json({ error: error.message });
  }
  response.json(data);
});

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

// TODO: make a route to get the profile data from supabase user table for profile pictures and user display names

// start the actual server
// listen - has the port run on 5000 and then the 0.0.0.0 listens to everything so that docker can connect and run
app.listen(PORT, "0.0.0.0", () => {
  console.log("This server is running on the correct port rn:" + PORT);
});
