import { Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import type { EventItem } from "../data/mockEvents"

export default function MyEnrollmentsPage({ events }: { events: EventItem[] }) {
  const [enrolledIds, setEnrolledIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("event-platform-enrollments")
      if (raw) setEnrolledIds(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const enrolledEvents = useMemo(() => {
    const set = new Set(enrolledIds)
    return events.filter((e) => set.has(e.id))
  }, [events, enrolledIds])

  const clearEnrollments = () => {
    setEnrolledIds([])
    try {
      localStorage.setItem("event-platform-enrollments", JSON.stringify([]))
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>My Enrollments</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <p style={{ margin: 0 }}>Total enrolled: {enrolledEvents.length}</p>
        <button onClick={clearEnrollments}>Clear</button>
      </div>

      {enrolledEvents.length === 0 ? (
        <p>You haven’t enrolled in any events yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Title", "Start", "Location", "Type", "Price", "Published"].map((h) => (
                <th
                  key={h}
                  style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrolledEvents.map((e) => (
              <tr key={e.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  <Link to={`/event/${e.id}`}>{e.title}</Link>
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {new Date(e.startDate).toLocaleString()}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{e.location}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{e.eventType}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {e.price === 0 ? "Free" : `$${e.price}`}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {e.isPublished ? "Published" : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: 16 }}>
        <Link to="/">← Back to Home</Link>
      </p>
    </div>
  )
}