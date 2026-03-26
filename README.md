# TechEvent Platform - Frontend MVP 🚀

This is the frontend repository for the TechEvent Platform, a localized event discovery and management system built specifically for the Turkish developer ecosystem (Hackathons, Conferences, Meetups, etc.).

## Tech Stack
* **Framework:** React 19 + Vite
* **Routing:** React Router v7
* **Styling:** Tailwind CSS
* **Icons:** Lucide React

## Architecture & MVP Scope
The system is divided into two primary entry points:
1. **Public Web App (Citizens/Users):** For event discovery, searching, and viewing details.
2. **Admin Interfaces (Super/Institution Admins):** A secured dashboard for publishing events (Authentication to be implemented).

## 🚀 Getting Started

**1. Install Dependencies**
```bash
npm install
```

**2. Start the Development Server**
```bash
npm run dev
```

## 📌 Recent Updates
* Authentication Engine: Fully implemented `AuthContext` for global session management.
* Session Persistence: Added logic to auto-restore user sessions from localStorage on page refresh.
* Security & Networking: 
    Set up Axios instance with Request Interceptors to automatically attach JWT tokens. 
    Implemented a Response Interceptor to handle 401 Unauthorized errors (auto-logout on token expiry).
* UI Components:
    Created Login and Register pages with native HTML validation.
    Updated Navbar with dynamic user profile dropdowns and logout functionality.