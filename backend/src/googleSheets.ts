// this file has the neccessary parts needed to use google sheets

import dotenv from "dotenv";
import { google } from "googleapis";
import { createHash } from "crypto";
import { AttendeeRow } from "./schema/googleSheets.schema";

dotenv.config();

// check for the neccessary variables to be imported
if (
  !process.env.GOOGLE_CLIENT_EMAIL ||
  !process.env.GOOGLE_PRIVATE_KEY ||
  !process.env.GOOGLE_SHEET_ID
) {
  throw new Error("Missing Google service account env vars");
}

// setting up the auth connection (might import into the neccessary files and seperate the services)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    // Convert the \n from .env into real newlines
  },
  // scope so that we can do what we want with the spreadsheet
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// sheets will be used in the neccessary routes to make changes where needed
const sheets = google.sheets({
  version: "v4",
  auth,
});

export const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Helper function to make clean and better tab names for creating new tab names
function makeEventTabName(eventName: string, eventId: string): string {
  // Keep it short and safe: e.g. "EventName_1234abcd"
  const cleanName = eventName.replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 25);
  const shortId = eventId.slice(0, 8);
  return `${cleanName || "Event"}_${shortId}`;
}

// Helper function to check to see if a tab exists already or make one if it doesn't
async function getOrCreateTab(title: string): Promise<void> {
  // Get spreadsheet metadata to see existing tabs
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const existing = res.data.sheets?.find(
    (sheet) => sheet.properties?.title === title,
  );

  if (existing) {
    // Tab already exists, nothing to do
    return;
  }

  // Otherwise create a new tab with that title
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title,
            },
          },
        },
      ],
    },
  });

  // Add a header row to the new tab to help make the new tab clean
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${title}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      // titles for the columns
      values: [
        [
          "Registration ID",
          "Event ID",
          "Event Name",
          "Attendee Name",
          "Attendee Email",
          "RSVP Timestamp",
        ],
      ],
    },
  });
}

// function to create new tabs and append the attendees to it
export async function appendAttendeeToEventTab(
  row: AttendeeRow,
): Promise<void> {
  // make tabName to check or make new tab
  const tabName = makeEventTabName(row.eventName, row.eventId);

  // Ensure the tab exists (create it if needed)
  await getOrCreateTab(tabName);

  // Append to that tab
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A1`, // attendee to existing or non existing tab
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          row.registrationId,
          row.eventId,
          row.eventName,
          row.attendeeName,
          row.attendeeEmail,
          row.timestamp,
        ],
      ],
    },
  });
}

async function getSheetIdByTitle(title: string): Promise<number | null> {
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheet = res.data.sheets?.find(
    (sheet) => sheet.properties?.title === title,
  );

  if (
    sheet?.properties?.sheetId === undefined ||
    sheet?.properties?.sheetId === null
  ) {
    return null;
  }

  return sheet.properties.sheetId;
}

export function generateRegistrationId(
  eventId: string,
  userId: string,
): string {
  return createHash("sha256").update(`${eventId}:${userId}`).digest("hex");
}

export async function removeAttendeeFromEventTab(
  eventId: string,
  eventName: string,
  registrationId: string,
): Promise<void> {
  const tabName = makeEventTabName(eventName, eventId);
  const sheetId = await getSheetIdByTitle(tabName);

  if (sheetId === null) {
    console.warn(
      `Sheet tab ${tabName} not found; skipping removal for ${registrationId}`,
    );
    return;
  }

  const valuesResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A:F`,
  });

  const rows = valuesResponse.data.values ?? [];
  const rowIndex = rows.findIndex((row) => row[0] === registrationId);

  if (rowIndex <= 0) {
    // rowIndex === 0 is the header, < 0 means not found
    console.warn(
      `Registration ID ${registrationId} not found in sheet ${tabName}`,
    );
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });
}
