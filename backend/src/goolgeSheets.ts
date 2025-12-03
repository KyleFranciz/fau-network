// this file has the neccessary parts needed to use google sheets

import { google, sheets_v4 } from "googleapis";
import { AttendeeRow } from "./schema/googleSheets.schema";

// check for the neccessary variables to be imported
if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error("Missing Google service account env vars");
}

// setting up the auth connection (might import into the neccessary files and seperate the services)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // Convert the \n from .env into real newlines
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  // scope so that we can do what we want with the spreadsheet
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// sheets will be used in the neccessary routes to make changes where needed
export const sheets = google.sheets({
  version: "v4",
  auth,
});

// Helper function to append one row to the sheet
export async function appendRowToSheet(values: (string | number | null)[]) {
  // use the spreadsheet info
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  // check to see if the google sheet variable is working
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID env var is not set");
  }

  // adding the data to the spreadsheet
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A1", // change to "Attendees!A1" if your tab is named Attendees
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}

// Function to create use to add in the attendees to the row
export async function appendAttendeeRow(row: AttendeeRow) {
  await appendRowToSheet([
    row.eventId,
    row.eventName,
    row.attendeeName,
    row.attendeeEmail,
    row.timestamp,
  ]);
}
