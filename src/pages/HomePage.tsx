import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import type { EventItem } from "../data/mockEvents"

type ViewMode = "grid" | "list" | "calendar"
type EventTypeFilter = "All" | EventItem["eventType"]
type ModeFilter = "All" | "Online" | "In Person"
type TagFilter = "All" | string

export default function HomePage({ events }: { events: EventItem[] }) {
  const [q, setQ] = useState("")
  const [eventType, setEventType] = useState<EventTypeFilter>("All")
  const [mode, setMode] = useState<ModeFilter>("All")
  const [tag, setTag] = useState<TagFilter>("All")
  const [date, setDate] = useState("")
  const [view, setView] = useState<ViewMode>("grid")

  const allTags = useMemo(() => {
    const set = new Set<string>()
    events.forEach((e) => {
      e.tags.forEach((t) => set.add(t))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [events])

  const filteredEvents = useMemo(() => {
    const query = q.trim().toLowerCase()

    return events
      .filter((e) => e.isPublished)
      .filter((e) => {
        const typeOk = eventType === "All" || e.eventType === eventType
        const modeOk =
          mode === "All" ||
          (mode === "Online" && e.isOnline) ||
          (mode === "In Person" && !e.isOnline)
        const tagOk = tag === "All" || e.tags.includes(tag)
        const dateOk = date === "" || e.startDate.slice(0, 10) === date

        const searchOk =
          query === "" ||
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.location.toLowerCase().includes(query) ||
          e.tags.some((t) => t.toLowerCase().includes(query))

        return typeOk && modeOk && tagOk && dateOk && searchOk
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
  }, [events, q, eventType, mode, tag, date])

  const reset = () => {
    setQ("")
    setEventType("All")
    setMode("All")
    setTag("All")
    setDate("")
  }

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    color: "#111827",
    whiteSpace: "nowrap",
  }

  const softBadge = (bg: string, fg: string): React.CSSProperties => ({
    ...pillStyle,
    border: `1px solid ${bg}`,
    background: bg,
    color: fg,
    fontWeight: 600,
  })

  const eventTypeBadge = (t: EventItem["eventType"]) => {
    if (t === "CONFERENCE") return softBadge("#dbeafe", "#1d4ed8")
    if (t === "WORKSHOP") return softBadge("#ffedd5", "#9a3412")
    if (t === "HACKATHON") return softBadge("#ede9fe", "#5b21b6")
    return softBadge("#e0f2fe", "#0369a1")
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

  const formatPrice = (price: number) => {
    if (price === 0) return "Free"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }


  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  }

  const controlStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
  }

  const toggleButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 12px",
    border: "none",
    cursor: "pointer",
    background: active ? "#1d4ed8" : "#ffffff",
    color: active ? "#ffffff" : "#111827",
    fontWeight: 700,
  })

  return (
    <div style={{ padding: "32px 24px 40px", maxWidth: 1120, margin: "0 auto" }}>
      <section
        style={{
          ...cardStyle,
          marginBottom: 14,
          padding: 20,
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 60%)",
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15, letterSpacing: -0.6 }}>
            Discover Events
          </h1>
          <p style={{ margin: "10px 0 0", color: "#6b7280", fontSize: 15, lineHeight: 1.7, maxWidth: 700 }}>
            Browse published meetups, conferences, hackathons, and workshops. Use search and filters
            below to find the right event for your interests.
          </p>
        </div>
      </section>

      <div
        style={{
          ...cardStyle,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          padding: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            flex: "1 1 360px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <span style={{ color: "#6b7280" }}>Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />
        </div>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventTypeFilter)}
          style={controlStyle}
        >
          <option value="All">All Types</option>
          <option value="MEETUP">Meetup</option>
          <option value="CONFERENCE">Conference</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="HACKATHON">Hackathon</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as ModeFilter)}
          style={controlStyle}
        >
          <option value="All">All Modes</option>
          <option value="Online">Online</option>
          <option value="In Person">In Person</option>
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value as TagFilter)}
          style={controlStyle}
        >
          <option value="All">All Tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={controlStyle} />

        <button onClick={reset} type="button" style={{ ...controlStyle, cursor: "pointer", fontWeight: 700 }}>
          Reset
        </button>

        <div
          style={{
            display: "inline-flex",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            overflow: "hidden",
            marginLeft: "auto",
          }}
        >
          <button type="button" onClick={() => setView("grid")} style={toggleButtonStyle(view === "grid")}>Grid</button>
          <button type="button" onClick={() => setView("list")} style={{ ...toggleButtonStyle(view === "list"), borderLeft: "1px solid #e5e7eb" }}>List</button>
          <button type="button" onClick={() => setView("calendar")} style={{ ...toggleButtonStyle(view === "calendar"), borderLeft: "1px solid #e5e7eb" }}>Calendar</button>
        </div>
      </div>

      <div style={{ marginTop: 14, marginBottom: 4, color: "#6b7280", fontSize: 15 }}>
        <strong style={{ color: "#111827" }}>{filteredEvents.length}</strong> events found
      </div>

      {filteredEvents.length === 0 ? (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            color: "#6b7280",
          }}
        >
          No events match your filters.
        </div>
      ) : view === "grid" ? (
        <div
          id="events-grid"
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          {filteredEvents.map((e) => (
            <div
              key={e.id}
              style={{
                ...cardStyle,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                overflow: "hidden",
              }}
            >
              <img
                src={e.imageUrl}
                alt={e.title}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={eventTypeBadge(e.eventType)}>{e.eventType}</span>
                <span style={softBadge("#f3f4f6", "#374151")}>
                  {e.isOnline ? "Online" : "In Person"}
                </span>
                <span style={softBadge("#ecfccb", "#3f6212")}>{formatPrice(e.price)}</span>
              </div>

              <Link
                to={`/event/${e.id}`}
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#111827",
                  textDecoration: "none",
                  lineHeight: 1.25,
                }}
              >
                {e.title}
              </Link>

              <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{e.description}</div>

              <div style={{ color: "#4b5563", fontSize: 13 }}>
                <div>{formatDateTime(e.startDate)}</div>
                <div>{e.location}</div>
                <div>Capacity: {e.capacity}</div>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {e.tags.map((t) => (
                  <span key={t} style={softBadge("#eff6ff", "#1d4ed8")}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: "auto", paddingTop: 4 }}>
                <Link
                  to={`/event/${e.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "#1d4ed8",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 800,
                  }}
                >
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : view === "calendar" ? (
        <div style={{ marginTop: 16, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          Calendar view is coming next.
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Title", "Start", "Location", "Type", "Price"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                      padding: 10,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((e) => (
                <tr key={e.id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <Link to={`/event/${e.id}`}>{e.title}</Link>
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{formatDateTime(e.startDate)}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{e.location}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{e.eventType}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{formatPrice(e.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}