export type EventType = "MEETUP" | "HACKATHON" | "CONFERENCE" | "WORKSHOP"

export type EventItem = {
  id: string
  title: string
  description: string
  eventType: EventType
  startDate: string
  endDate: string
  location: string
  isOnline: boolean
  imageUrl: string
  capacity: number
  price: number
  tags: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
  publisherId: string
}

export const mockEvents: EventItem[] = [
  {
    id: "e1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    title: "Ankara React & Next.js Meetup",
    description:
      "Join us for an evening of deep dives into React 19 features, Vite tooling, and the future of Next.js routing. Perfect for frontend developers looking to network and share knowledge.",
    eventType: "MEETUP",
    startDate: "2026-04-15T18:30:00Z",
    endDate: "2026-04-15T21:00:00Z",
    location: "ODTÜ Teknokent, Ankara",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    capacity: 100,
    price: 0,
    tags: ["React", "Next.js", "Frontend"],
    isPublished: true,
    createdAt: "2026-03-05T10:00:00Z",
    updatedAt: "2026-03-05T10:00:00Z",
    publisherId: "u1a2b3c4-d5e6-7f8g",
  },
  {
    id: "a9b8c7d6-e5f4-3g2h-1i0j-k9l8m7n6o5p4",
    title: "Bilişim Vadisi FinTech Hackathon",
    description:
      "A 48-hour intensive hackathon focused on building the next generation of financial technology solutions. Mentors from top Turkish banks will be present. Grand prize: ₺50,000.",
    eventType: "HACKATHON",
    startDate: "2026-05-10T09:00:00Z",
    endDate: "2026-05-12T18:00:00Z",
    location: "Bilişim Vadisi, Gebze",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    capacity: 250,
    price: 0,
    tags: ["FinTech", "Web3", "Node.js"],
    isPublished: true,
    createdAt: "2026-03-08T14:30:00Z",
    updatedAt: "2026-03-09T09:15:00Z",
    publisherId: "u1a2b3c4-d5e6-7f8g",
  },
  {
    id: "f5e4d3c2-b1a0-9z8y-7x6w-5v4u3t2s1r0q",
    title: "Global AI & Big Data Expo 2026 - Istanbul",
    description:
      "The premier conference for artificial intelligence and big data professionals. Featuring keynote speakers from global tech giants, workshops on LLMs, and a massive networking floor.",
    eventType: "CONFERENCE",
    startDate: "2026-06-20T08:30:00Z",
    endDate: "2026-06-21T17:00:00Z",
    location: "Lütfi Kırdar International Convention Center, Istanbul",
    isOnline: false,
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    capacity: 2000,
    price: 750,
    tags: ["AI/ML", "Big Data", "Python"],
    isPublished: true,
    createdAt: "2026-02-15T11:00:00Z",
    updatedAt: "2026-03-01T16:45:00Z",
    publisherId: "u9z8y7x6-w5v4-3u2t",
  },
  {
    id: "m1n2o3p4-q5r6-s7t8-u9v0-w1x2y3z4a5b6",
    title: "NestJS Advanced Patterns Workshop",
    description:
      "An intensive, hands-on online workshop covering microservices, GraphQL integration, and advanced architectural patterns in NestJS.",
    eventType: "WORKSHOP",
    startDate: "2026-04-25T13:00:00Z",
    endDate: "2026-04-25T17:00:00Z",
    location: "Online",
    isOnline: true,
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    capacity: 50,
    price: 150,
    tags: ["NestJS", "Backend", "TypeScript"],
    isPublished: true,
    createdAt: "2026-03-07T08:20:00Z",
    updatedAt: "2026-03-07T08:20:00Z",
    publisherId: "u1a2b3c4-d5e6-7f8g",
  },
]