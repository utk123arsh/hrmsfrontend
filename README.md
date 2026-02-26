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

## � Attendance Rules

- **View Attendance** — Date picker and list are limited to today and past dates (no future).
- **Mark Attendance** — Same: only today or past dates; each employee has Present/Absent checkboxes; save creates or updates records via the API.
- **Weekends** — Weekends (Saturday/Sunday) are automatically prevented; selecting a weekend adjusts to the previous weekday (Friday).
- **Editing** — Once attendance is saved for a date, editing is disabled for that date to ensure data credibility.

## �📌 Author

**Utkarsh Chaudhary**  
Frontend Developer | React Enthusiast

## 📄 License

Private / use as needed.
