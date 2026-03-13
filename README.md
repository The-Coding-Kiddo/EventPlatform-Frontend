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
\`\`\`bash
npm install
\`\`\`

**2. Start the Development Server**
\`\`\`bash
npm run dev
\`\`\`

## 📌 Recent Updates
* Set up standard `PublicLayout` with global `Navbar` and `Footer`.
* Implemented the `Home` page.
* Created the `EventListCard` component for displaying horizontal event rows.