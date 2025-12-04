// this file has the schema for the google sheets functions

// (Optional) helper type so you can type your attendee rows
export interface AttendeeRow {
  registrationId: string;
  eventId: string;
  eventName: string;
  attendeeName: string;
  attendeeEmail: string;
  timestamp: string;
}
