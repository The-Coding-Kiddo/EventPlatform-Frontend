import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import type { EventItem } from "../data/mockEvents"

function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: 999,
        background: isPublished ? "#dcfce7" : "#fff7ed",
        border: `1px solid ${isPublished ? "#bbf7d0" : "#fed7aa"}`,
        color: isPublished ? "#166534" : "#9a3412",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {isPublished ? "Published" : "Pending Review"}
    </span>
  )
}

export default function EventDetailsPage({ events }: { events: EventItem[] }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = events.find((e) => e.id === id)

  const [enrolledIds, setEnrolledIds] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("event-platform-enrollments")
      if (raw) setEnrolledIds(JSON.parse(raw))

      const storedUser = localStorage.getItem("event-platform-user")
      setIsLoggedIn(Boolean(storedUser))
    } catch {
      // ignore
    }
  }, [])

  const enroll = () => {
    if (!event) return

    if (!isLoggedIn) {
      setAuthMessage("Please log in to enroll in this event.")
      navigate("/login")
      return
    }

    if (enrolledIds.includes(event.id)) return

    const updated = [...enrolledIds, event.id]
    setEnrolledIds(updated)
    setAuthMessage(null)

    try {
      localStorage.setItem("event-platform-enrollments", JSON.stringify(updated))
    } catch {
      // ignore
    }
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

  const isEnrolled = useMemo(() => {
    return event ? enrolledIds.includes(event.id) : false
  }, [enrolledIds, event])

  const badgeStyle = (bg: string, fg: string, border: string): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 999,
    border: `1px solid ${border}`,
    background: bg,
    color: fg,
    fontSize: 12,
    fontWeight: 800,
  })

  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  }

  if (!event) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ ...cardStyle, padding: 24 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Event not found</h2>
          <p style={{ marginTop: 0, color: "#6b7280" }}>
            The event you are looking for could not be found.
          </p>
          <Link to="/" style={{ color: "#1d4ed8", fontWeight: 700, textDecoration: "none" }}>
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 40px" }}>
      <div style={{ marginBottom: 16 }}>
        <Link
          to="/"
          style={{
            color: "#1d4ed8",
            fontWeight: 800,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ← Back to Events
        </Link>
      </div>

      <section style={{ ...cardStyle, overflow: "hidden", marginBottom: 22 }}>
        <img
          src={event.imageUrl}
          alt={event.title}
          style={{
            width: "100%",
            height: 340,
            objectFit: "cover",
            display: "block",
          }}
        />

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={badgeStyle("#eff6ff", "#1d4ed8", "#dbeafe")}>{event.eventType}</span>
              <span style={badgeStyle("#f8fafc", "#334155", "#e5e7eb")}>
                {event.isOnline ? "Online" : "In Person"}
              </span>
              <span style={badgeStyle("#ecfdf5", "#065f46", "#d1fae5")}>{formatPrice(event.price)}</span>
            </div>
            <PublishBadge isPublished={event.isPublished} />
          </div>

          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.1, letterSpacing: -0.8, color: "#0f172a" }}>
            {event.title}
          </h1>

          <p style={{ margin: "14px 0 0", color: "#475569", lineHeight: 1.75, fontSize: 15 }}>
            {event.description}
          </p>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 18 }}>
          <section style={{ ...cardStyle, padding: 22 }}>
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 22, color: "#111827" }}>Event Information</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <div style={{ padding: 16, borderRadius: 14, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                  Start
                </div>
                <div style={{ color: "#111827", fontWeight: 700, lineHeight: 1.55 }}>{formatDateTime(event.startDate)}</div>
              </div>

              <div style={{ padding: 16, borderRadius: 14, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                  End
                </div>
                <div style={{ color: "#111827", fontWeight: 700, lineHeight: 1.55 }}>{formatDateTime(event.endDate)}</div>
              </div>

              <div style={{ padding: 16, borderRadius: 14, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                  Location
                </div>
                <div style={{ color: "#111827", fontWeight: 700, lineHeight: 1.55 }}>{event.location}</div>
              </div>

              <div style={{ padding: 16, borderRadius: 14, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                  Capacity
                </div>
                <div style={{ color: "#111827", fontWeight: 700, lineHeight: 1.55 }}>{event.capacity} attendees</div>
              </div>
            </div>
          </section>

          <section style={{ ...cardStyle, padding: 22 }}>
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 22, color: "#111827" }}>Topics</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "7px 12px",
                    borderRadius: 999,
                    border: "1px solid #dbeafe",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside style={{ display: "grid", gap: 18 }}>
          <section style={{ ...cardStyle, padding: 22 }}>
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 22, color: "#111827" }}>Registration</h2>
            <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              {event.isPublished
                ? isLoggedIn
                  ? "Reserve your place for this event. Enrollment is stored locally for the current demo experience."
                  : "You need to log in before enrolling in this event."
                : "This event is not publicly available yet. It will become visible after publication."}
            </div>

            {authMessage && (
              <div
                style={{
                  marginBottom: 14,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  color: "#9a3412",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {authMessage}
              </div>
            )}

            {event.isPublished ? (
              isEnrolled ? (
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "#ecfdf5",
                    border: "1px solid #d1fae5",
                    color: "#065f46",
                    fontWeight: 800,
                  }}
                >
                  You are enrolled in this event.
                </div>
              ) : (
                <button
                  onClick={enroll}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: 14,
                    border: "none",
                    background: "#1d4ed8",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.18)",
                  }}
                >
                  {isLoggedIn ? "Enroll Now" : "Log in to Enroll"}
                </button>
              )
            ) : (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  color: "#9a3412",
                  fontWeight: 700,
                }}
              >
                This event is currently pending review.
              </div>
            )}
          </section>

          <section style={{ ...cardStyle, padding: 22 }}>
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 22, color: "#111827" }}>Additional Details</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "#64748b", textTransform: "uppercase", marginBottom: 5 }}>
                  Publisher ID
                </div>
                <div style={{ color: "#111827", fontWeight: 700, lineHeight: 1.5 }}>{event.publisherId}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "#64748b", textTransform: "uppercase", marginBottom: 5 }}>
                  Created
                </div>
                <div style={{ color: "#111827", fontWeight: 700, lineHeight: 1.5 }}>{formatDateTime(event.createdAt)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "#64748b", textTransform: "uppercase", marginBottom: 5 }}>
                  Updated
                </div>
                <div style={{ color: "#111827", fontWeight: 700, lineHeight: 1.5 }}>{formatDateTime(event.updatedAt)}</div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}