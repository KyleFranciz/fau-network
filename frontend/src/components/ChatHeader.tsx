import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// this file is for the chat header so the user knows what chat they are in

// interface for this component
export interface ChatHeaderI {
  eventTitle: string | undefined; // can be any of these
  eventImage?: string | undefined;
}

export function ChatHeader(event: ChatHeaderI) {
  return (
    <div className="flex h-16 w-full px-4 py-2 justify-center items-center rounded-2xl mt-3 shadow-sm">
      <div className="flex justify-center items-center">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {/* Event Chat Image */}
          <Avatar>
            <AvatarImage
              className="w-full h-full object-cover"
              src={event?.eventImage ? event.eventImage : ""}
              alt="Event Avatar"
            />
            <AvatarFallback>EV</AvatarFallback>
          </Avatar>
        </div>
        {/* Event Title Name */}
        <div className="ml-2.5 text-lg font-semibold">
          {event?.eventTitle ? event.eventTitle : ""}
        </div>
      </div>
    </div>
  );
}
