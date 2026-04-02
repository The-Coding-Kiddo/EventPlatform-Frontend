import { Link } from "react-router-dom"
import type { EventItem } from "../data/mockEvents"

type Props = {
  events: EventItem[]
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>
}

function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: isPublished ? "#d1e7dd" : "#fff3cd",
        border: `1px solid ${isPublished ? "#badbcc" : "#ffecb5"}`,
        color: isPublished ? "#0f5132" : "#664d03",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {isPublished ? "Published" : "Pending"}
    </span>
  )
}

export default function AdminPage({ events, setEvents }: Props) {
  const pending = events.filter((e) => !e.isPublished)
  const published = events.filter((e) => e.isPublished)

  const approve = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, isPublished: true } : e)))
  }

  const unpublish = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, isPublished: false } : e)))
  }

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Review</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <span><strong>Pending:</strong> {pending.length}</span>
        <span><strong>Published:</strong> {published.length}</span>
      </div>

      {pending.length === 0 ? (
        <p>No pending events right now.</p>
      ) : (
        <>
          <p style={{ marginTop: 0, marginBottom: 12 }}>
            Review pending events below. Publishing will make them visible on the Home page.
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Title",
                  "Start",
                  "Location",
                  "Type",
                  "Price",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      padding: 8,
                      fontWeight: 700,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.map((e) => (
                <tr key={e.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                    <Link to={`/event/${e.id}`}>{e.title}</Link>
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{formatDateTime(e.startDate)}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{e.location}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{e.eventType}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                    {e.price === 0 ? "Free" : `$${e.price}`}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                    <PublishBadge isPublished={e.isPublished} />
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                    <button onClick={() => approve(e.id)} style={{ marginRight: 8 }}>
                      Publish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <hr style={{ margin: "24px 0" }} />

      <details>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Show published history</summary>
        <div style={{ marginTop: 12 }}>
          <h3 style={{ marginBottom: 8 }}>Published</h3>
          {published.length === 0 ? (
            <p>No published events yet.</p>
          ) : (
            <ul>
              {published.map((e) => (
                <li key={e.id}>
                  <Link to={`/event/${e.id}`}>{e.title}</Link> — <PublishBadge isPublished={e.isPublished} />
                  <button onClick={() => unpublish(e.id)} style={{ marginLeft: 8 }}>
                    Unpublish
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
    </div>
  )
}