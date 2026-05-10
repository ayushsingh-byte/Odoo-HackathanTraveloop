# ✈️ Traveloop — AI-Assisted Travel Planning Platform

> Plan cinematic journeys. Build itineraries. Explore destinations. Track budgets. Share adventures.

![Login Page](public/images/hero-paris.png)

---

## 📌 Overview

**Traveloop** is a full-stack travel planning web application built for the **Odoo Hackathon**. It enables users to plan multi-city trips, manage itineraries, track budgets, collaborate via community posts, and generate trip invoices — all from a clean, sidebar-driven UI.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | Register / Login with session-based auth. Bcrypt password hashing. |
| 🗺️ **Trip Builder** | Create trips, add city stops, attach activities and transport. |
| 📋 **Itinerary View** | Timeline and list view of all stops and activities. |
| 💰 **Budget Tracker** | Set trip budget, track spending, visualize over/under. |
| ☑️ **Packing Checklist** | Per-trip checklist with reset functionality. |
| 📝 **Trip Notes** | Rich notes per trip, filterable by stop. |
| 🧾 **Invoice Generator** | Auto-generate invoice from trip data. Export as PDF or CSV. |
| 💬 **Community** | Post travel experiences, tips, photos. Like and comment. |
| 🌍 **City Explorer** | Browse 50+ seeded cities with daily cost estimates. |
| ⚙️ **Admin Panel** | User management, popular cities/activities charts, trip trends (Chart.js). |
| 🔗 **Share Trips** | Generate public share links for trips. |
| 👤 **Profile** | Edit profile, phone, city, country, additional info. |

---

## 🖥️ Screenshots

<table>
  <tr>
    <td align="center"><b>Login Page</b></td>
    <td align="center"><b>Register Page</b></td>
  </tr>
  <tr>
    <td><img src="public/bg_login.png" width="400" alt="Login"/></td>
    <td><img src="public/bg_register.jpg" width="400" alt="Register"/></td>
  </tr>
  <tr>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>City Explorer</b></td>
  </tr>
  <tr>
    <td><img src="public/images/hero-japan.png" width="400" alt="Dashboard"/></td>
    <td><img src="public/images/city-kyoto.png" width="400" alt="Cities"/></td>
  </tr>
  <tr>
    <td align="center"><b>Destinations</b></td>
    <td align="center"><b>Community</b></td>
  </tr>
  <tr>
    <td><img src="public/images/hero-santorini.png" width="400" alt="Destinations"/></td>
    <td><img src="public/images/hero-bali.png" width="400" alt="Community"/></td>
  </tr>
</table>

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MySQL 8+ |
| **Auth** | express-session + express-mysql-session + bcryptjs |
| **Frontend** | Vanilla HTML / CSS / JavaScript (no framework, no build step) |
| **Charts** | Chart.js (admin panel) |
| **Fonts/Icons** | Google Fonts (Outfit, Inter) + Font Awesome 6 |
| **UUID** | uuid v9 |

---

## 📁 Project Structure

```
traveloop/
├── server/
│   ├── index.js              # Express app entry point
│   ├── db.js                 # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js           # requireAuth middleware
│   └── routes/
│       ├── auth.js           # /api/auth — login, register, logout, profile
│       ├── trips.js          # /api/trips — CRUD, stops, activities, invoice, share
│       ├── cities.js         # /api/cities — browse, search
│       ├── activities.js     # /api/activities — by city
│       ├── budget.js         # /api/budget — trip budget
│       ├── checklist.js      # /api/checklist — packing list
│       ├── notes.js          # /api/notes — trip notes
│       ├── transport.js      # /api/transport — trip transport legs
│       ├── community.js      # /api/community — posts, likes
│       ├── admin.js          # /api/admin — stats, user management
│       └── share.js          # /api/share — public share tokens
├── public/
│   ├── index.html            # Login / Register (glassmorphism UI)
│   ├── dashboard.html        # Home dashboard with recent trips
│   ├── trips.html            # All trips list
│   ├── trip-new.html         # Create new trip
│   ├── trip-view.html        # Itinerary timeline / list view
│   ├── trip-builder.html     # Add stops and activities
│   ├── trip-budget.html      # Budget tracker
│   ├── trip-checklist.html   # Packing checklist
│   ├── trip-notes.html       # Trip notes
│   ├── trip-invoice.html     # Invoice generator
│   ├── cities.html           # City explorer
│   ├── community.html        # Community feed
│   ├── profile.html          # User profile
│   ├── admin.html            # Admin panel
│   ├── share.html            # Public shared itinerary view
│   ├── css/style.css         # Global styles + sidebar layout
│   └── js/
│       ├── api.js            # Fetch wrapper + auth helpers
│       └── layout.js         # Sidebar injection (overrides checkAuth)
├── package.json
├── .env                      # DB credentials (not committed)
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MySQL** 8.0+ — [mysql.com](https://dev.mysql.com/downloads/) or via Homebrew: `brew install mysql`

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/ayushsingh-byte/Traveloop.git
cd Traveloop
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create MySQL database and load schema

Start MySQL if not running:

```bash
# macOS (Homebrew)
brew services start mysql

# or start manually
mysql.server start
```

Create the database and load schema + seed data:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS traveloop;"
mysql -u root -p traveloop < sql/schema.sql
mysql -u root -p traveloop < sql/seed.sql
```

> **Note:** If you don't have a password set on MySQL root, omit the `-p` flag.

### Step 4 — Configure environment variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=traveloop
SESSION_SECRET=any_random_secret_string
PORT=3000
```

### Step 5 — Start the server

```bash
npm start
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@traveloop.com` | `Admin@123` |
| **User** | Create via Register | your choice |

> Admin account has access to the Admin Panel with full stats and user management.

---

## 🗄️ Database Schema

Key tables:

| Table | Purpose |
|---|---|
| `users` | Accounts with role (user/admin), phone, city, country |
| `trips` | Trip records with dates, visibility, cover image |
| `trip_stops` | City stops within a trip (ordered) |
| `trip_activities` | Activities attached to stops |
| `trip_budgets` | Budget with currency, total, actual cost |
| `trip_checklist_items` | Packing list items per trip |
| `trip_notes` | Notes per trip (optionally per stop) |
| `transport` | Transport legs between stops |
| `cities` | 50+ seeded cities with avg daily cost |
| `activities` | Activity library per city |
| `community_posts` | Community posts with category, likes |
| `sessions` | Express session store |

---

## 🌐 API Endpoints

### Auth
```
POST /api/auth/register     — create account
POST /api/auth/login        — log in
POST /api/auth/logout       — log out
GET  /api/auth/me           — current user
PUT  /api/auth/profile      — update profile
```

### Trips
```
GET    /api/trips                              — all user trips
POST   /api/trips                              — create trip
GET    /api/trips/:id                          — trip detail
PUT    /api/trips/:id                          — update trip
DELETE /api/trips/:id                          — delete trip
POST   /api/trips/:id/stops                    — add stop
DELETE /api/trips/:id/stops/:stopId            — remove stop
POST   /api/trips/:id/stops/:stopId/activities — add activity
GET    /api/trips/:id/invoice                  — generate invoice
POST   /api/trips/:id/share                    — create share link
```

### Other
```
GET  /api/cities            — browse/search cities
GET  /api/activities        — activities by city
GET  /api/budget/:tripId    — trip budget
PUT  /api/budget/:tripId    — update budget
GET  /api/checklist/:tripId — checklist items
POST /api/community         — create post
GET  /api/community         — community feed
GET  /api/admin/stats       — platform stats (admin only)
GET  /api/admin/users       — all users (admin only)
```

---

## 👥 Team

| Name | GitHub |
|---|---|
| Ayush Singh | [@ayushsingh-byte](https://github.com/ayushsingh-byte) |
| Ridam | [@w1tn3sss](https://github.com/w1tn3sss) |

---

## 📄 License

MIT — built for Odoo Hackathon 2026.
