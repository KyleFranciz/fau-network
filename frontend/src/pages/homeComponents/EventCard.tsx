import { useAuth } from "@/context/AuthContext";
import { detailPagePrefetcher } from "@/prefetchers/detailPagePrefetcher";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";

interface EventCardProps {
  eventId: string;
  date: string;
  title: string;
  host: string;
  attendees: number;
  image: string;
  onJoinClick?: () => void;
}

// TODO: REFACTOR LATER ON TO PASS IN ONE PROP OBJECT INTO THIS COMPONENT
export default function EventCard({
  eventId,
  date,
  title,
  host,
  attendees,
  image,
  onJoinClick,
}: EventCardProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handlePrefetch = (): void => {
    void detailPagePrefetcher(queryClient, eventId, user?.id);
  };

  return (
    <div className="rounded-2xl bg-card overflow-hidden hover:cursor-pointer">
      <div className="relative h-56 bg-muted rounded-3xl overflow-hidden">
        <Link
          to={`/event/${eventId}`}
          className="block h-full"
          aria-label={`View event ${title || "Event"}`}
          onMouseEnter={handlePrefetch}
        >
          <img
            src={image}
            alt={title || "Event image"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-700/40" />
        </Link>
        <button
          onClick={onJoinClick}
          className="absolute cursor-pointer bottom-3 right-3 bg-foreground hover:bg-foreground/90 text-background text-sm font-medium px-4 py-2 rounded-3xl transition-colors duration-200"
          aria-label="Join event"
        >
          I'm Down
        </button>
      </div>
      <div className="p-5 space-y-3">
        <p className="text-sm font-medium text-foreground">
          {date || "Date TBA"}
        </p>
        <Link to={`/event/${eventId}`} onClick={handlePrefetch}>
          <h3 className="text-xl hover:underline font-semibold text-foreground leading-tight">
            {title || "Event Title"}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          Hosted: {host || "Unknown"}
        </p>
        <div className="flex items-center gap-2 pt-2">
          {/* NOTE: Avatar images for the card  */}
          <div className="flex items-center -space-x-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full bg-muted border-2 border-card"
              />
            ))}
          </div>
          <span className="text-sm font-bold text-black">
            {attendees} attendees
          </span>
        </div>
      </div>
    </div>
  );
}
