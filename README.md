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

Clone the repository:

```bash
git clone https://github.com/utk123arsh/hrmsfrontend.git
cd hrmsfrontend
```

Install dependencies:

```bash
npm install
```

## ▶ Running the Project

### Development Mode

```bash
npm run dev
```

Open in browser: `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
 ├── api/                # Axios configuration
 ├── components/         # Reusable components
 ├── pages/              # Application pages
 ├── App.jsx             # Routing configuration
 ├── main.jsx            # Entry point
 └── index.css           # Global styles
```

## 🔗 Backend Integration

The application connects to a REST API backend.

You can configure the backend base URL inside: `src/api/axios.js`

Example:

```javascript
baseURL: "YOUR_BACKEND_API_URL"
```

All authenticated requests include:

```
Authorization: Token <your_token>
```

## 🔒 Authentication Flow

1. Admin logs in
2. Backend returns authentication token
3. Token stored in localStorage
4. Axios attaches token to all protected API requests
5. ProtectedRoute ensures secure page access

## 📌 Author

**Utkarsh Chaudhary**  
Frontend Developer | React Enthusiast

## 📄 License

This project is built for educational and demonstration purposes.
