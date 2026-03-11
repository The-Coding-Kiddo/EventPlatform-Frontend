import { Link } from "react-router-dom";
import { ArrowRight, Code, Users, MonitorPlay, Mic, Terminal } from "lucide-react";
import EventListCard from "../../components/EventListCard";
import mockData from "../../mockData/events.json";

const categories = [
  { name: "Hackathons", icon: <Terminal className="w-6 h-6" />, count: "12 Events" },
  { name: "Conferences", icon: <Mic className="w-6 h-6" />, count: "8 Events" },
  { name: "Meetups", icon: <Users className="w-6 h-6" />, count: "24 Events" },
  { name: "Workshops", icon: <Code className="w-6 h-6" />, count: "15 Events" },
  { name: "Webinars", icon: <MonitorPlay className="w-6 h-6" />, count: "30 Events" },
];

export default function Home() {
  const events = mockData.events;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="items-center gap-12 grid md:grid-cols-2 mx-auto px-6 md:px-12 py-16 md:py-24 max-w-7xl">
        <div>
          <h1 className="mb-6 font-extrabold text-gray-900 text-5xl md:text-6xl leading-tight">
            Discover Tech Events <span className="text-blue-600">That Inspire.</span>
          </h1>
          <p className="mb-8 max-w-lg text-gray-600 text-lg">Find and book tickets for hackathons, software conferences, and developer meetups happening in Ankara, Istanbul, and beyond.</p>
          <div className="flex space-x-4">
            <Link to="/events" className="flex items-center bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-full font-semibold text-white transition duration-300">
              Browse Events <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/" className="flex items-center px-5 py-3 border border-gray-200 rounded-full font-semibold hover:text-blue-600 transition duration-300">
              Create Event
            </Link>
          </div>
        </div>
        <div className="relative shadow-2xl rounded-3xl h-[400px] overflow-hidden">
          {/* Replace this Unsplash link with hero graphic later */}
          <img src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop" alt="Developers at a hackathon" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto px-6 md:px-12 py-16 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-bold text-gray-900 text-3xl">Explore By Category</h2>
          <a href="#" className="font-medium text-blue-600 hover:underline">
            View All
          </a>
        </div>
        <div className="gap-6 grid grid-cols-2 md:grid-cols-5">
          {categories.map((cat, idx) => (
            <div key={idx} className="group bg-gray-50 hover:bg-blue-50 p-6 border border-gray-200 rounded-2xl hover:text-blue-600 transition cursor-pointer">
              <div className="flex justify-center items-center bg-white shadow-sm mb-4 rounded-xl w-12 h-12 text-gray-800 group-hover:text-blue-600">{cat.icon}</div>
              <h3 className="mb-1 font-bold text-gray-900">{cat.name}</h3>
              <p className="text-gray-500 text-sm">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events (List View) */}
      <section className="bg-gray-50/50 mx-auto my-8 px-6 md:px-12 py-16 rounded-[3rem] max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-bold text-gray-900 text-3xl">Upcoming Events</h2>
          <a href="/events" className="font-medium text-blue-600 hover:underline">
            View All events
          </a>
        </div>
        <div className="flex flex-col space-y-6">
          {events.map((event) => (
            <EventListCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto px-6 md:px-12 py-20 max-w-7xl text-center">
        <div className="relative bg-gray-900 px-8 py-20 rounded-[3rem] overflow-hidden text-white">
          <div className="z-10 relative mx-auto max-w-2xl">
            <h2 className="mb-6 font-bold text-4xl">Host Your Own Tech Event</h2>
            <p className="mb-8 text-gray-300 text-lg">Are you organizing a hackathon or a developer meetup? Our platform makes it easy to handle registrations and check-ins.</p>
            <button className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8 py-4 rounded-full font-bold text-white transition duration-300">Get Started For Free</button>
          </div>
        </div>
      </section>
    </div>
  );
}
