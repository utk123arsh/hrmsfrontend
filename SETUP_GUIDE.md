# HRMS Lite Frontend - Setup & Deployment Guide

## 📋 Overview

HRMS Lite is a production-ready HR Management System frontend built with:
- **React 18**
- **Vite** (fast development server)
- **React Router v6** (routing)
- **Axios** (API calls)
- **Clean CSS** (professional styling)

---

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Configure Backend URL**

The app connects to a Railway backend via environment variables. Update `.env.local`:

```env
# Railway Production Backend (RECOMMENDED)
VITE_API_URL=https://web-production-15d00.up.railway.app/api

# OR local backend for development
# VITE_API_URL=http://localhost:8000/api
```

### 3. **Start Development Server**
```bash
npm run dev
```

The app will open at: `http://localhost:5173`

---

## 🔗 Backend Connection

### **Environment Files**

- `.env.local` - Used locally (ignored by git)
- `.env.development` - Dev environment settings
- `.env.production` - Production settings for Vercel

### **How It Works**

1. **Vite reads** `.env.local` or `.env.production` at build time
2. **Axios** (`src/api/axios.js`) uses the URL from `import.meta.env.VITE_API_URL`
3. **All API calls** automatically use the configured backend URL

### **Check Connection**

Open browser console (F12) and you'll see logs like:
```
🚀 API URL: https://web-production-15d00.up.railway.app/api
📤 Request: GET /employees/
✅ Response: 200
```

---

## 📱 Application Routes

| Route | Description |
|-------|-------------|
| `/` | Login page (demo: admin/admin1) |
| `/dashboard` | Dashboard with stats |
| `/employees` | Employee management (add/list/delete) |
| `/attendance` | Attendance marking |

---

## 🎨 Features

✅ **Professional UI** - Red accent color, card-based layouts  
✅ **Responsive Design** - Works on desktop & mobile  
✅ **Protected Routes** - localStorage-based authentication  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Spinner for async operations  
✅ **Active Navigation** - Current page highlighted in sidebar  

---

## 🏗️ Project Structure

```
src/
├── api/
│   └── axios.js          # API client with error handling
├── components/
│   ├── Layout.jsx        # Main layout wrapper
│   ├── Sidebar.jsx       # Navigation sidebar
│   ├── ProtectedRoute.jsx # Auth guard
│   ├── Loader.jsx        # Loading spinner
│   └── StatCard.jsx      # Dashboard stat card
├── pages/
│   ├── Login.jsx         # Login page
│   ├── Dashboard.jsx     # Dashboard with stats
│   ├── Employees.jsx     # Employee management
│   └── Attendance.jsx    # Attendance marking
├── App.jsx               # Main router
├── main.jsx              # Entry point
└── index.css             # Utility CSS classes
```

---

## 🔐 Authentication

**Demo Login Credentials:**
- Username: `admin`
- Password: `admin1`

Login data is stored in `localStorage` with key: `isLoggedIn`

To logout: Click "Logout" button in sidebar

---

## 📡 API Endpoints Used

The frontend connects to these backend endpoints:

```
GET    /api/employees/                    # Get all employees
POST   /api/employees/                    # Create employee
DELETE /api/employees/{id}/               # Delete employee
GET    /api/attendance/?date=YYYY-MM-DD   # Get attendance by date
POST   /api/attendance/                   # Mark attendance
```

---

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm lint
```

---

## 🚀 Deployment

### **Deploy to Vercel**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variable**
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add: `VITE_API_URL=https://web-production-15d00.up.railway.app/api`

### **Backend on Railway**

The backend is already deployed at:
```
https://web-production-15d00.up.railway.app/api
```

---

## 🐛 Troubleshooting

### **Backend Connection Error**

**Error:** `Network Error: net::ERR_CONNECTION_REFUSED`

**Solution:**
1. Check `.env.local` has correct Railway URL
2. Restart dev server: `npm run dev`
3. Check Rails backend is running
4. Clear browser cache: `Ctrl+Shift+Del`

### **Sidebar Buttons Not Aligned**

Already fixed! Buttons are now:
- Properly aligned vertically
- With bold text and no underlines
- Show active state (highlighted in red)

### **Buttons Overlapping**

Already fixed! Layout now uses:
- `z-index` for proper layering
- `relative` positioning for stacking context
- No content overlapping

---

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.1",
  "axios": "^1.13.5"
}
```

---

## ✨ Bonus Features Implemented

1. ✅ **Active Navigation** - Current page highlighted in sidebar
2. ✅ **Better Error Handling** - Helpful error messages
3. ✅ **Console Logging** - Debug API calls in console
4. ✅ **Professional Styling** - Red theme with yellow accents
5. ✅ **Loading States** - Spinner on all pages
6. ✅ **Empty States** - Helpful messages when no data

---

## 🎯 Next Steps

1. ✅ Start dev server: `npm run dev`
2. ✅ Login with demo credentials
3. ✅ Navigate sidebar (Dashboard → Employees → Attendance)
4. ✅ Build for production: `npm run build`
5. ✅ Deploy to Vercel

---

## 📞 Support

For issues, check:
- Browser console (F12) for API logs
- Error messages in the app UI
- Backend status at Railway dashboard

---

**Happy coding! 🚀**
