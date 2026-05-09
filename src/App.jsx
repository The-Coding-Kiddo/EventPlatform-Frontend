import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { EventProvider } from './context/EventContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InstitutionDashboard from './pages/InstitutionDashboard'
import PublishEventPage from './pages/PublishEventPage'
import ModerationPage from './pages/ModerationPage'
import AdminDashboard from './pages/AdminDashboard'
import SavedEventsPage from './pages/SavedEventsPage'
import RegisteredEventsPage from './pages/RegisteredEventsPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'

// ── Error boundary (shows the real error instead of a blank screen) ──
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace' }}>
          <h2 style={{ color: '#dc2626' }}>Runtime Error</h2>
          <pre style={{ background: '#fef2f2', padding: 16, borderRadius: 8, overflowX: 'auto', fontSize: 13 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button onClick={() => { this.setState({ error: null }); window.location.reload() }}
            style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function Layout({ children, hideFooter }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <EventProvider>
            <Routes>
              <Route path="/" element={<Layout><LandingPage /></Layout>} />
              <Route path="/events" element={<Layout><EventsPage /></Layout>} />
              <Route path="/events/:id" element={<Layout><EventDetailPage /></Layout>} />
              <Route path="/login"    element={<Layout hideFooter><LoginPage /></Layout>} />
              <Route path="/register" element={<Layout hideFooter><RegisterPage /></Layout>} />
              {/* Admin-only dashboard route */}
              <Route path="/dashboard" element={<Layout><InstitutionDashboard /></Layout>} />

              {/* Citizen routes */}
              <Route path="/saved-events" element={<Layout><SavedEventsPage /></Layout>} />
              <Route path="/registered-events" element={<Layout><RegisteredEventsPage /></Layout>} />
              <Route path="/subscriptions" element={<Layout><SubscriptionsPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
              <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />

              <Route path="/publish" element={<Layout><PublishEventPage /></Layout>} />
              <Route path="/moderation" element={<Layout hideFooter><ModerationPage /></Layout>} />
              <Route path="/admin" element={<Layout hideFooter><AdminDashboard /></Layout>} />
              <Route path="*" element={
                <Layout>
                  <div className="min-h-screen pt-24 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-6">🌐</div>
                      <h1 className="text-4xl font-black text-gray-900 mb-3">404</h1>
                      <p className="text-gray-500 mb-8">This page doesn't exist.</p>
                      <a href="/" className="btn-primary">Go Home</a>
                    </div>
                  </div>
                </Layout>
              } />
            </Routes>
          </EventProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
