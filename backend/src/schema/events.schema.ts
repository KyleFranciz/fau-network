// Interface for fetching a single event via route params
export interface EventParams {
  eventId: string;
}

// change the optional after all the routes incorporate google sheets
export interface EventRegisterParams {
  eventId: string;
  eventName?: string; //
  userId: string;
  registeredDate: string;
  userName?: string;
  email?: string;
}
