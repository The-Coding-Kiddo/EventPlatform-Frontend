import { MapPin, Users, Calendar } from "lucide-react";

export default function EventListCard({ event }: { event: any }) {
  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex md:flex-row flex-col bg-white hover:shadow-lg border border-gray-200 rounded-2xl overflow-hidden transition-shadow">
      <div className="rounded-2xl w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex flex-col justify-between p-6 w-full md:w-2/3">
        <div>
          <div className="flex items-center space-x-2 mb-2 text-sm">
            <span className="bg-blue-50 px-3 py-1 rounded-full font-medium text-blue-600 text-xs uppercase tracking-wider">{event.eventType}</span>
            <span className="flex items-center text-gray-500">
              <Calendar className="mr-1 w-4 h-4" /> {formattedDate}
            </span>
          </div>
          <h3 className="mb-2 font-bold text-gray-900 text-xl">{event.title}</h3>
          <div className="flex items-center space-x-4 mb-4 text-gray-500 text-sm">
            <span className="flex items-center">
              <MapPin className="mr-1 w-4 h-4" /> {event.location}
            </span>
            <span className="flex items-center">
              <Users className="mr-1 w-4 h-4" /> {event.capacity} Spots
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-gray-50 border-t">
          <span className="font-bold text-gray-900 text-lg">{event.price === 0 ? "Free" : `₺${event.price}`}</span>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium text-white transition">View Details</button>
        </div>
      </div>
    </div>
  );
}
