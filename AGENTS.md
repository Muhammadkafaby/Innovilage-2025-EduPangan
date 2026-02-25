# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
EduPangan is a Smart Food Village application for Indramayu, Indonesia. It helps families manage home gardens, track harvests, access a community seed bank, and learn about nutrition and gardening. The UI supports both a mobile-first consumer app and an admin dashboard for BUMDes administrators.

**Language**: Indonesian (Bahasa Indonesia) - all user-facing text is in Indonesian.

## Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

Alternate port: `npm run dev -- -p 3001`

Clear cache if issues arise: Delete `.next/` folder and restart dev server.

## Architecture

### Tech Stack
- **Next.js 14** (App Router)
- **React 18** with client-side state management
- **Tailwind CSS 3** with custom theme colors
- **MQTT** for IoT smart watering device integration

### Directory Structure
```
app/
├── page.jsx              # Main mobile app entry - manages all page routing via state
├── layout.jsx            # Root layout with metadata
├── admin/page.jsx        # Admin dashboard
├── api/                  # Next.js Route Handlers
│   ├── garden/route.js
│   ├── notifications/route.js
│   ├── seeds/route.js
│   └── users/route.js
components/
├── mobile/               # Mobile app screens (BankBibit, Dashboard, Login, etc.)
├── web/                  # Admin components (AdminDashboard.jsx)
└── shared/               # Reusable UI components (Button, Card)
hooks/
├── useGardenData.js      # Garden activities, harvests, plants (localStorage)
├── useNotifications.js   # Notification management (localStorage)
├── useLocalStorage.js    # Base localStorage hook
├── useMqtt.js            # MQTT connection for IoT devices
└── useAdminMqtt.js       # Admin MQTT functionality
data/
└── staticData.js         # Dummy data: vegetables, recipes, articles, users, etc.
```

### Navigation Pattern
The mobile app uses **state-based routing** in `app/page.jsx`. All screens are conditionally rendered based on `currentPage` state. Navigation happens via the `navigate(page)` function passed to components.

```jsx
// Example: navigating to bank-bibit
onNavigate('bank-bibit')
```

Page names: `splash`, `login`, `register`, `dashboard`, `bank-bibit`, `catat-panen`, `menu-gizi`, `edukasi`, `device-monitor`, `kebun`, `profil`

### Data Persistence
- **Client-side**: Custom hooks (`useGardenData`, `useNotifications`) persist to `localStorage` with keys prefixed `edupangan_`
- **API routes**: In-memory storage (resets on server restart) - meant for prototyping only

### Design System (Tailwind)
Custom color palette defined in `tailwind.config.js`:
- **Primary (Green)**: `primary-50` to `primary-900` - main UI color
- **Secondary (Orange)**: `secondary-50` to `secondary-900` - accents/CTAs
- **Accent (Yellow)**: `accent-light`, `accent`, `accent-dark` - highlights

Custom shadows: `shadow-green`, `shadow-orange`

### Component Patterns
- All client-side components must have `'use client'` directive at top
- Components receive `onNavigate` and `onNavigateBack` props for navigation
- Loading states use Tailwind `animate-spin` spinner
- Error messages use red background with border styling
- Empty states include emoji icon + gray text

### MQTT/IoT Integration
The app integrates with smart watering devices via MQTT. Hooks in `hooks/useMqtt.js` handle connection and message handling. Device credentials are passed through the login flow.

## API Routes
All routes are in `app/api/` using Next.js Route Handlers:

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/users` | GET, POST | User management |
| `/api/garden` | GET, POST, PUT, DELETE | Garden activities, plants, harvests |
| `/api/seeds` | GET, POST | Seed bank catalog and transactions |
| `/api/notifications` | GET, POST, PUT, DELETE | User notifications |

Query params and body formats are documented in `API_DOCUMENTATION.md`.

## Key Files Reference
- `data/staticData.js` - All dummy data (vegetables, recipes, articles, users, transactions)
- `styles/theme.js` - Design system constants
- `COMPONENT_STRUCTURE.md` - Detailed component documentation
- `API_DOCUMENTATION.md` - API endpoint specifications
- `API_USAGE_GUIDE.md` - Usage examples for API integration
