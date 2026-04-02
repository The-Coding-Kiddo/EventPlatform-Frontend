import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { EventItem, EventType } from "../data/mockEvents"

export default function CreateEventPage({
  setEvents,
}: {
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>
}) {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState<EventType>("MEETUP")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [city, setCity] = useState("Ankara")
  const [venue, setVenue] = useState("")
  const [isOnline, setIsOnline] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [capacity, setCapacity] = useState(0)
  const [price, setPrice] = useState(0)
  const [tagsInput, setTagsInput] = useState("")

  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const location = useMemo(() => {
    if (isOnline) return "Online"
    const cleanedVenue = venue.trim()
    const cleanedCity = city.trim()
    if (cleanedVenue && cleanedCity) return `${cleanedVenue}, ${cleanedCity}`
    return cleanedVenue || cleanedCity
  }, [isOnline, venue, city])

  const parsedTags = useMemo(() => {
    return tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  }, [tagsInput])

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      startDate.trim().length > 0 &&
      endDate.trim().length > 0 &&
      location.trim().length > 0 &&
      capacity > 0 &&
      price >= 0
    )
  }, [title, description, startDate, endDate, location, capacity, price])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setSubmitMessage(null)
    setSubmitError(null)

    if (!canSubmit) {
      setSubmitError("Please complete all required fields before submitting.")
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setSubmitError("End date and time must be after the start date and time.")
      return
    }

    const now = new Date().toISOString()

    const newEvent: EventItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      eventType,
      startDate,
      endDate,
      location,
      isOnline,
      imageUrl:
        imageUrl.trim() ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      capacity,
      price,
      tags: parsedTags,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
      publisherId: "frontend-demo-user",
    }

    setEvents((prev) => [newEvent, ...prev])
    setSubmitMessage("Submitted for review. Your event will appear after publication.")

    setTitle("")
    setDescription("")
    setEventType("MEETUP")
    setStartDate("")
    setEndDate("")
    setCity("Ankara")
    setVenue("")
    setIsOnline(false)
    setImageUrl("")
    setCapacity(0)
    setPrice(0)
    setTagsInput("")

    navigate("/")
  }

  const sectionStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
    marginBottom: 20,
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    marginBottom: 8,
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d0d5dd",
    outline: "none",
    background: "#fff",
    color: "#111827",
    fontSize: 15,
  }

  const sectionHeadingStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    color: "#111827",
  }

  return (
    <div
      style={{
        padding: "32px 20px 40px",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, lineHeight: 1.15, margin: 0, color: "#111827" }}>Host Event</h1>
        <p style={{ marginTop: 8, color: "#64748b", fontSize: 15 }}>
          Submit your event for review and publication.
        </p>
      </div>

      {(submitError || submitMessage) && (
        <div
          style={{
            marginTop: 12,
            marginBottom: 16,
            padding: "12px 14px",
            borderRadius: 12,
            border: submitError ? "1px solid #fca5a5" : "1px solid #a7f3d0",
            background: submitError ? "#fef2f2" : "#ecfdf5",
            color: submitError ? "#991b1b" : "#065f46",
            fontSize: 14,
          }}
          role={submitError ? "alert" : "status"}
        >
          {submitError ?? submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <section style={sectionStyle}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={sectionHeadingStyle}>Basic Information</h3>
            <p style={{ marginTop: 6, marginBottom: 0, color: "#64748b", fontSize: 14 }}>
              Provide the core details about your event.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Event Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tech Innovation Summit 2026"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event, what attendees can expect, key topics..."
                rows={5}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  style={inputStyle}
                >
                  <option value="MEETUP">Meetup</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="HACKATHON">Hackathon</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Tags</label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. React, Frontend, Vite"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={sectionHeadingStyle}>Date & Time</h3>
            <p style={{ marginTop: 6, marginBottom: 0, color: "#64748b", fontSize: 14 }}>
              Set the start and end schedule for the event.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>Start</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>End</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={sectionHeadingStyle}>Location</h3>
            <p style={{ marginTop: 6, marginBottom: 0, color: "#64748b", fontSize: 14 }}>
              Configure whether the event is online or in person.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>Mode</label>
              <select
                value={isOnline ? "online" : "inPerson"}
                onChange={(e) => setIsOnline(e.target.value === "online")}
                style={inputStyle}
              >
                <option value="inPerson">In Person</option>
                <option value="online">Online</option>
              </select>
            </div>

            {!isOnline ? (
              <>
                <div>
                  <label style={labelStyle}>City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle}>
                    <option value="Ankara">Ankara</option>
                    <option value="Istanbul">Istanbul</option>
                    <option value="Izmir">Izmir</option>
                    <option value="Gebze">Gebze</option>
                  </select>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Venue</label>
                  <input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Convention Center"
                    style={inputStyle}
                  />
                </div>
              </>
            ) : (
              <div>
                <label style={labelStyle}>Location Preview</label>
                <input value="Online" readOnly style={{ ...inputStyle, background: "#f9fafb" }} />
              </div>
            )}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={sectionHeadingStyle}>Publishing Details</h3>
            <p style={{ marginTop: 6, marginBottom: 0, color: "#64748b", fontSize: 14 }}>
              Add pricing, capacity, and an optional banner image.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>Capacity</label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value) || 0)}
                placeholder="e.g. 200"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Price</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                placeholder="0 for free"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Image URL (optional)</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/event-image.jpg"
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 8,
            paddingBottom: 8,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "1px solid #d0d5dd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "1px solid #2563eb",
              background: canSubmit ? "#2563eb" : "#93c5fd",
              color: "#fff",
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontWeight: 800,
              boxShadow: canSubmit ? "0 10px 20px rgba(37, 99, 235, 0.18)" : "none",
            }}
          >
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  )
}