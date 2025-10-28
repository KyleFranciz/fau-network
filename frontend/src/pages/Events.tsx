// imports
import FeaturedEvent from "@/components/FeaturedEvent";

//variables (will change for actual query later on)
const categories = [
  {
    category: "Study",
    events: [
      {
        date: "Sat Oct 25",
        time: "4:00 PM",
        title: "Library Study Session",
        host: "Mark Random Name",
        attendees: 12,
        imageUrl: "/images/library.jpg",
      },
      {
        date: "Sun Oct 26",
        time: "2:00 PM",
        title: "Coding Jam in the Lab",
        host: "Jane Doe",
        attendees: 8,
        imageUrl: "/images/coding.jpg",
      },
    ],
  },
  {
    category: "Social",
    events: [
      {
        date: "Mon Oct 27",
        time: "6:00 PM",
        title: "Campus Picnic",
        host: "Student Council",
        attendees: 20,
        imageUrl: "/images/picnic.jpg",
      },
      {
        date: "Tue Oct 28",
        time: "8:00 PM",
        title: "Movie Night in the Quad",
        host: "Cinema Club",
        attendees: 30,
        imageUrl: "/images/movie.jpg",
      },
    ],
  },
];

export default function EventsPage() {
  return (
    <div className="">
      <h2>Events</h2>
      <p>Here are all the events.</p>
      <FeaturedEvent categories={categories} />
    </div>
  );
}
