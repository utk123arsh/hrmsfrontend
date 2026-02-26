import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg z-50 overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition no-underline">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center font-bold text-lg">
            HR
          </div>
          <span className="text-lg font-bold text-yellow-300 no-underline">HRMS Lite</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3 flex flex-col">
        <Link
          to="/dashboard"
          className={`block w-full px-6 py-4 rounded-lg font-bold text-base transition no-underline ${
            isActive('/dashboard')
              ? 'bg-red-600 text-white'
              : 'text-gray-100 hover:bg-red-600'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/employees"
          className={`block w-full px-6 py-4 rounded-lg font-bold text-base transition no-underline ${
            isActive('/employees')
              ? 'bg-red-600 text-white'
              : 'text-gray-100 hover:bg-red-600'
          }`}
        >
          Employees
        </Link>
        <Link
          to="/attendance"
          className={`block w-full px-6 py-4 rounded-lg font-bold text-base transition no-underline ${
            isActive('/attendance')
              ? 'bg-red-600 text-white'
              : 'text-gray-100 hover:bg-red-600'
          }`}
        >
          Attendance
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
