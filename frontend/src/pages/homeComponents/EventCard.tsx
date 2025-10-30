interface EventCardProps {
  date: string;
  title: string;
  host: string;
  attendees: number;
  image: string;
  onJoinClick?: () => void;
}

export default function EventCard({ 
  date, 
  title, 
  host, 
  attendees, 
  image,
  onJoinClick 
}: EventCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image placeholder */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-700/40" />
        
        {/* "I'm Down" button */}
        <button
          onClick={onJoinClick}
          className="absolute bottom-3 right-3 bg-foreground hover:bg-foreground/90 text-background text-sm font-medium px-4 py-1.5 rounded-lg transition-colors duration-200"
        >
          I'm Down
        </button>
      </div>
      
      {/* Event details */}
      <div className="p-5 space-y-3">
        <p className="text-sm font-medium text-foreground">{date}</p>
        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">Hosted: {host}</p>
        
        {/* Attendees */}
        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full bg-muted border-2 border-card"
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {attendees} attendees
          </span>
        </div>
      </div>
    </div>
  );
}
