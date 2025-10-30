// this is the event card component that will display the event data from supabse

// imports for this component
import type React from "react";
import { Link } from "react-router";

// interface for this component (will be moved later into schema folder)
// NOTE: MAKE EVERYTHING BUT THE IMAGEURL OPTIONAL WHEN FINALIZING
export interface EventCardI {
  date?: string;
  time?: string;
  title?: string;
  host?: string;
  attendees?: number; // number of attendees that are going to the event
  imageUrl?: string; // image url to use to make the request to storage
}

const EventCard: React.FC<EventCardI> = ({
  date,
  time,
  title,
  host,
  attendees,
  imageUrl,
}) => {
  return (
    <div className="bg-white overflow-hidden w-80 flex-shrink-0 hover:cursor-pointer ">
      {/* Image / Banner */}
      <div className="relative rounded-3xl w-full h-40 bg-gray-800">
        {/* if there is an image then display the image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <button className="absolute bottom-3 right-3 bg-black text-white text-sm font-medium px-4 py-2 rounded-3xl hover:bg-gray-600 cursor-pointer transition">
          I’m Down
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-1">
          {date} • {time} EDT
        </p>

        <Link to={"/"}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700">
            {title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mb-4">Hosted by {host}</p>

        {/* Attendees */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gray-800 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-700">
            {attendees} attendees
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
