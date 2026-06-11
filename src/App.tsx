import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import CreateEventPage from "@/pages/CreateEventPage"
import EventsPage from "@/pages/EventsPage"
import EventDetailPage from "@/pages/EventDetailPage"
import ProfilePage from "@/pages/ProfilePage"
import InstitutionDashboard from "@/pages/InstitutionDashboard"
import InstitutionProfilePage from "@/pages/InstitutionProfilePage"
import InstitutionsPage from "@/pages/InstitutionsPage"
import EventAttendeesPage from "@/pages/EventAttendeesPage"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

// Scrolls to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// A layout wrapper for pages that need Navbar and Footer but don't explicitly include them
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<MainLayout><EventDetailPage /></MainLayout>} />
          <Route path="/institutions" element={<MainLayout><InstitutionsPage /></MainLayout>} />
          <Route path="/institutions/:id" element={<MainLayout><InstitutionProfilePage /></MainLayout>} />
          
          {/* General Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          </Route>

          {/* Admin & Institution Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["super_admin", "institution"]} />}>
            <Route path="/create-event" element={<MainLayout><CreateEventPage /></MainLayout>} />
            <Route path="/institution/dashboard" element={<MainLayout><InstitutionDashboard /></MainLayout>} />
            <Route path="/institution/events/:id/attendees" element={<MainLayout><EventAttendeesPage /></MainLayout>} />
          </Route>
        </Routes>
        <Toaster position="top-center" richColors />
      </Router>
    </AuthProvider>
  )
}

export default App
