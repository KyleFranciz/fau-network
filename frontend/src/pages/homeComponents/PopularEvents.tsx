import EventCard from './EventCard';

interface Event {
  date: string;
  title: string;
  host: string;
  attendees: number;
  image: string;
}

// Mock data - will be replaced with API calls later
const popularEvents: Event[] = [
  {
    date: 'Sat Oct 25 4:00 PM EDT',
    title: 'Study Session at the Library',
    host: 'Mark Random Name',
    attendees: 12,
    image: ''
  },
  {
    date: 'Sun Oct 26 2:00 PM EDT',
    title: 'Coffee & Coding',
    host: 'Sarah Johnson',
    attendees: 8,
    image: ''
  },
  {
    date: 'Mon Oct 27 6:00 PM EDT',
    title: 'Campus Walking Tour',
    host: 'Mike Chen',
    attendees: 15,
    image: ''
  }
];

export default function PopularEvents() {
  const handleJoinClick = () => {
    console.log('Join event clicked');
  };

  return (
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Popular Events
          </h2>
          <p className="text-muted-foreground">
            Here are events that a lot of students are in.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularEvents.map((event, index) => (
            <EventCard
              key={index}
              date={event.date}
              title={event.title}
              host={event.host}
              attendees={event.attendees}
              image={event.image}
              onJoinClick={handleJoinClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
