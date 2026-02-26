# HRMS Frontend

A modern Human Resource Management System (HRMS) frontend built using React and Vite.
This application allows administrators to manage employees and handle date-wise attendance with secure token-based authentication.

## 🚀 Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Token Authentication
- CSS / Custom Styling

## ✨ Core Features

### 🔐 Admin Authentication

- Token-based login system
- Protected routes
- Token stored securely in localStorage
- Automatic Authorization header using Axios

### 📊 Dashboard

- Centralized admin panel
- Quick navigation to Employees & Attendance
- Clean and responsive UI

### 👥 Employee Management

- Add new employees
- View all employees
- Delete employees with confirmation
- Attendance tracking per employee

### 📅 Attendance Management

- Select date (today or past only)
- Prevent future date selection
- Weekend restriction (Saturday/Sunday blocked)
- Mark Present / Absent
- Prevent editing after submission for data integrity
- Fetch attendance records by date

## 🛠 Installation

### Prerequisites

- Node.js 18+ (or compatible)
- npm or yarn

### Clone and Install

```bash
git clone https://github.com/utk123arsh/hrmsfrontend.git
cd hrmsfrontend
npm install
```

## ▶ Running the App

### Development (with hot reload)

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

After running `npm run dev`, open the URL shown in the terminal (e.g. `http://localhost:5173`).

### Demo Credentials

For demo or testing:

- **Username:** `admin`
- **Password:** `12345`

(Shown on the login page.)

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js                # Axios instance, base URL, auth header
├── components/
│   ├── Layout.jsx              # Sidebar + main content wrapper
│   ├── Sidebar.jsx             # Navigation sidebar
│   ├── Loader.jsx              # Spinner component
│   ├── ProtectedRoute.jsx       # Auth guard for routes
│   └── StatCard.jsx            # Dashboard stat card component
├── pages/
│   ├── Login.jsx               # Admin login page
│   ├── Dashboard.jsx           # Dashboard with quick stats
│   ├── Employees.jsx           # Create, list, delete employees
│   └── Attendance.jsx          # View & mark attendance by date
├── App.jsx                     # Routes and layout
├── main.jsx                    # Entry point
└── index.css                   # Global styles and theme
```

## 🔗 Backend Integration

The app talks to a REST API. The base URL is set in `src/api/axios.js`:

**Base URL:** `https://web-production-15d00.up.railway.app/api`

### Endpoints Used

- `POST /token/` — Login (username, password) → returns token
- `GET/POST /employees/` — List and create employees
- `DELETE /employees/{id}/` — Delete employee
- `GET /attendance/?date=YYYY-MM-DD` — List attendance for a date
- `POST /attendance/` — Create attendance (employee, date, status)
- `PATCH /attendance/{id}/` — Update attendance (status)

### Authentication

Requests send `Authorization: Token <token>` after login; token is stored in localStorage.

To point to another backend, change `baseURL` in `src/api/axios.js` (or use an env variable and reference it there).

## 🔒 Authentication Flow

1. Admin logs in
2. Backend returns authentication token
3. Token stored in localStorage
4. Axios attaches token to all protected API requests
5. ProtectedRoute ensures secure page access

## 📋 Assumptions & Constraints

### Core Assumptions
- Single admin user with hardcoded credentials for demo purposes
- No multi-user or role-based access control implemented
- All attendance data is date-specific and employee-specific
- Backend API is always available and responds correctly

### Out of Scope
- Leave management system
- Payroll and salary processing
- Advanced HR features (appraisals, training, recruitment, etc.)
- Multi-department reporting
- Bulk import/export of employee data
- SMS/Email notifications
- Mobile app

### UI/UX Guidelines Applied
- Clean layout with consistent spacing
- Intuitive navigation via sidebar
- Responsive design for different screen sizes
- Clear visual hierarchy with typography
- Reusable components (Layout, Loader, StatCard, ProtectedRoute)
- Meaningful UI states: Loading, Empty, Error, Success

### Code Quality Standards
- Modular and well-structured React components
- Readable and maintainable code
- Consistent naming conventions
- Proper error handling and logging
- API error messages displayed to user
- Console logs for debugging

### Data Integrity
- Attendance records are immutable once submitted
- Date-based filtering prevents data mixing across dates
- Employee deduplication by normalized ID
- Proper status normalization (Present/Absent)

## ✨ Implemented Features

### Bonus Features Implemented
✅ **Filter attendance records by date** — View Attendance tab shows records for selected date only  
✅ **Date-wise filtering** — Prevents data contamination when switching dates  
✅ **Dashboard summary** — Total employees, present today, absent today counts  
✅ **Attendance statistics** — View historical records with status per date  

### Additional Features
✅ **Dual-mode attendance** — Separate View and Mark modes for clarity  
✅ **Employee deduplication** — Handles duplicate API responses gracefully  
✅ **Status normalization** — Consistent Present/Absent handling across the app  
✅ **Not Marked state** — Shows employees with no attendance record for a date  
✅ **Auto-save detection** — Visual indicator when attendance is saved vs. unsaved  

## 🔄 Data Flow

```
Login → Dashboard → Employees/Attendance
   ↓
   ├─ Employees Tab: Add/Delete employees
   │
   └─ Attendance Tab:
      ├─ View Mode: Shows attendance for selected date
      ├─ Mark Mode: Allows marking Present/Absent for all employees
      └─ Auto-PATCH for updates, POST for new records
```

## 🐛 Known Limitations & Notes

1. **Demo Credentials**: Hardcoded username/password (admin/admin1) — replace with real auth in production
2. **No weekend handling**: Weekend blocking mentioned in requirements is validated server-side
3. **Single admin**: No user management or permission levels
4. **Local state**: Attendance updates are optimistic; UI may not sync if backend fails
5. **Deduplication**: Records prioritized by highest ID when duplicates exist

## 🌐 Deployment

### Frontend
- **Live URL**: (Share your deployed frontend URL here)
- **Platform**: Vite-based React app

### Backend
- **Base URL**: `https://web-production-15d00.up.railway.app/api`
- **Status**: Deployed and running

### Repository
- **GitHub**: https://github.com/utk123arsh/hrmsfrontend

## �📌 Author

**Utkarsh Chaudhary**  
Frontend Developer | React Enthusiast

## 📄 License

Private / use as needed.
