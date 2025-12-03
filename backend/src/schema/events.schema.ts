// Interface for fetching a single event via route params
export interface EventParams {
  eventId: string;
}

export interface EventRegisterParams {
  eventId: string;
  userId: string;
  registeredDate: string;
  name?: string;
  email?: string;
}

