import { useEffect, useState } from "react"
import { Navigate, NavLink, Route, Routes } from "react-router-dom"

import HomePage from "./pages/HomePage"
import EventDetailsPage from "./pages/EventDetailsPage"
import CreateEventPage from "./pages/CreateEventPage"
import AdminPage from "./pages/AdminPage"
import LoginPage from "./pages/LoginPage"
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage"

import { mockEvents, type EventItem } from "./data/mockEvents"

const LS_EVENTS_KEY = "event-platform-events"
const LS_IS_ADMIN_KEY = "event-platform-is-admin"

export default function App() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_EVENTS_KEY)
      if (raw) return JSON.parse(raw) as EventItem[]
    } catch {
      // ignore
    }
    return mockEvents
  })

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_IS_ADMIN_KEY) === "true"
    } catch {
      return false
    }
  })

  const storedUser = (() => {
    try {
      return localStorage.getItem("event-platform-user")
    } catch {
      return null
    }
  })()

  const currentUser = storedUser ? JSON.parse(storedUser) as { role?: string } : null
  const isLoggedIn = Boolean(currentUser)
  const isAdminUser = currentUser?.role === "admin"

  useEffect(() => {
    try {
      localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(events))
    } catch {
      // ignore
    }
  }, [events])

  useEffect(() => {
    try {
      localStorage.setItem(LS_IS_ADMIN_KEY, String(isAdmin))
    } catch {
      // ignore
    }
  }, [isAdmin])

  const navItems: Array<{ to: string; label: string; end?: boolean }> = [
    ...(isAdminUser ? [{ to: "/create", label: "Host Event" }] : []),
  ]

  const handleLogout = () => {
    setIsAdmin(false)
    try {
      localStorage.removeItem("event-platform-user")
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(229, 231, 235, 0.9)",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 6px 24px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            minHeight: 78,
            paddingTop: 14,
            paddingBottom: 14,
          }}
        >
          {/* Left: Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 190 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow: "0 10px 20px rgba(37, 99, 235, 0.25)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
              aria-hidden
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 2V5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 2V5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M3.5 9H20.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M6 4H18C19.1046 4 20 4.89543 20 6V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V6C4 4.89543 4.89543 4 6 4Z"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <NavLink
              to="/"
              end
              onClick={() => {
                if (window.location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              }}
              style={{
                fontWeight: 900,
                fontSize: 22,
                color: "#0f172a",
                letterSpacing: -0.4,
                textDecoration: "none",
              }}
            >
              EventHub
            </NavLink>
          </div>

          {/* Middle: Nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isAdminUser ? "center" : "flex-end",
              gap: 12,
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "11px 18px",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 15,
                  border: "1px solid #e5e7eb",
                  background: isActive ? "#e8f0ff" : "rgba(255,255,255,0.92)",
                  color: isActive ? "#1d4ed8" : "#334155",
                  boxShadow: isActive ? "0 8px 18px rgba(37, 99, 235, 0.10)" : "0 1px 2px rgba(15, 23, 42, 0.03)",
                  transition: "all 160ms ease",
                })}
              >
                {item.label}
              </NavLink>
            ))}

            {isAdminUser && (
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "11px 18px",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 15,
                  border: "1px solid #e5e7eb",
                  background: isActive ? "#e8f0ff" : "rgba(255,255,255,0.92)",
                  color: isActive ? "#1d4ed8" : "#334155",
                  boxShadow: isActive ? "0 8px 18px rgba(37, 99, 235, 0.10)" : "0 1px 2px rgba(15, 23, 42, 0.03)",
                  transition: "all 160ms ease",
                })}
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right: Auth */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 210,
              justifyContent: "flex-end",
            }}
          >
            {isLoggedIn ? (
              <>
                {isAdminUser ? (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#065f46",
                      background: "#ecfdf5",
                      border: "1px solid #d1fae5",
                      padding: "7px 11px",
                      borderRadius: 999,
                      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
                    }}
                    title="Admin mode is enabled"
                  >
                    Admin mode
                  </span>
                ) : (
                  <NavLink
                    to="/enrollments"
                    style={({ isActive }) => ({
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "11px 18px",
                      borderRadius: 14,
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: 15,
                      border: "1px solid #e5e7eb",
                      background: isActive ? "#e8f0ff" : "rgba(255,255,255,0.92)",
                      color: isActive ? "#1d4ed8" : "#334155",
                      boxShadow: isActive ? "0 8px 18px rgba(37, 99, 235, 0.10)" : "0 1px 2px rgba(15, 23, 42, 0.03)",
                      transition: "all 160ms ease",
                    })}
                  >
                    My Enrollments
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "11px 18px",
                    borderRadius: 14,
                    fontWeight: 800,
                    fontSize: 15,
                    border: "1px solid #e5e7eb",
                    background: "rgba(255,255,255,0.92)",
                    color: "#334155",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
                  }}
                  title="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "11px 18px",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 15,
                  border: "1px solid #e5e7eb",
                  background: isActive ? "#e8f0ff" : "rgba(255,255,255,0.92)",
                  color: isActive ? "#1d4ed8" : "#334155",
                  boxShadow: isActive ? "0 8px 18px rgba(37, 99, 235, 0.10)" : "0 1px 2px rgba(15, 23, 42, 0.03)",
                  transition: "all 160ms ease",
                })}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 30, paddingBottom: 48 }}>
        <Routes>
          <Route path="/" element={<HomePage events={events} />} />
          <Route path="/event/:id" element={<EventDetailsPage events={events} />} />
          <Route
            path="/create"
            element={isAdminUser ? <CreateEventPage setEvents={setEvents} /> : <Navigate to="/login" replace />}
          />
          <Route path="/enrollments" element={<MyEnrollmentsPage events={events} />} />

          <Route
            path="/admin"
            element={
              isAdminUser ? (
                <AdminPage events={events} setEvents={setEvents} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={<LoginPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
          />
        </Routes>
      </main>
    </div>
  )
}