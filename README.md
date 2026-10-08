# PartsPal — Robotics Club Inventory Management

A full-stack web application for managing electronics and robotics parts inventory in a college robotics club. Built with **React** + **Node.js/Express**.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Problem Statement

> **#5 — PartsPal: Robotics-Club Inventory**
>
> College robotics clubs lose track of who borrowed what. Build a system to manage component inventory, issue items or kits to members, and flag overdue returns.

## Features

### Core
- **📊 Dashboard** — Real-time analytics with bar/pie charts showing stock by category, low-stock alerts, and recent activity feed
- **📦 Inventory Management** — Full CRUD for 25+ electronic components across 8 categories, with stock-level indicators (Critical / Low / In Stock)
- **🔧 Kit Builder** — Create pre-defined kits (Line Follower Bot, Obstacle Avoider, IoT Weather Station, Robotic Arm) for one-click issuing
- **📤 Issue System** — 3-step wizard to issue kits or individual parts to members with all-or-nothing stock validation
- **👥 Who Has What** — Track all active issues, filter by Active/Overdue/Returned, with member avatars and status indicators
- **📋 Audit Log** — Complete history of every inventory operation with color-coded action badges

### Technical Highlights
- **All-or-Nothing Stock Validation** — When issuing a kit, the server checks availability of *every* component before deducting *any*. If one part is insufficient, the entire request is rejected with a clear error message
- **Dark Industrial UI** — Professional dark theme with glassmorphism cards, gradient accents, and smooth animations
- **Responsive Design** — Sidebar navigation with clean layout works on all screen sizes
- **Toast Notifications** — Immediate user feedback on every action using react-hot-toast
- **Interactive Charts** — Recharts-powered bar and pie charts for inventory analytics

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, React Router v7    |
| Styling   | Tailwind CSS 3, Lucide Icons       |
| Charts    | Recharts                            |
| Backend   | Node.js, Express.js                |
| Database  | In-memory JSON (no external DB)    |
| UX        | react-hot-toast, date-fns          |

## Project Structure

```
partspal/
├── server/
│   ├── index.js          # Express API server (all routes + in-memory data)
│   └── package.json
└── client/
    ├── src/
    │   ├── api.js         # Axios instance
    │   ├── App.jsx        # Router + layout
    │   ├── main.jsx       # Entry point with Toaster
    │   ├── index.css      # Tailwind + custom animations
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   └── pages/
    │       ├── Dashboard.jsx
    │       ├── Inventory.jsx
    │       ├── Kits.jsx
    │       ├── Issue.jsx
    │       ├── WhoHasWhat.jsx
    │       └── AuditLog.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/partspal.git
cd partspal

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Terminal 1: Start the backend
cd server
npm start         # Runs on http://localhost:3000

# Terminal 2: Start the frontend
cd client
npm run dev       # Runs on http://localhost:5173
```

### Environment Variables

| Variable        | Default                  | Description          |
|-----------------|--------------------------|----------------------|
| `PORT`          | `3000`                   | Backend server port  |
| `VITE_API_URL`  | `http://localhost:3000`  | Backend API base URL |

## Deployment

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`

### Frontend (Vercel)
1. Import the repo on [Vercel](https://vercel.com)
2. Set root directory to `client`
3. Add env variable: `VITE_API_URL` = your Render backend URL
4. Deploy

## API Endpoints

| Method  | Endpoint                   | Description                    |
|---------|----------------------------|--------------------------------|
| GET     | `/api/stats`               | Dashboard statistics           |
| GET     | `/api/parts`               | List parts (search, filter)    |
| GET     | `/api/parts/categories`    | List all categories            |
| POST    | `/api/parts`               | Add a new part                 |
| PUT     | `/api/parts/:id`           | Update a part                  |
| DELETE  | `/api/parts/:id`           | Delete a part                  |
| GET     | `/api/kits`                | List all kits                  |
| POST    | `/api/kits`                | Create a new kit               |
| POST    | `/api/issues`              | Issue parts/kit to a member    |
| PATCH   | `/api/issues/:id/return`   | Mark an issue as returned      |
| GET     | `/api/issues?status=`      | List issues (active/overdue/returned) |
| GET     | `/api/audit-log`           | Full audit trail               |

## License

MIT
