import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError('');
      const todayDate = new Date().toISOString().split('T')[0];
      
      const employeesRes = await api.get('/employees/');
      const attendanceRes = await api.get(`/attendance/?date=${todayDate}`);
      
      const totalEmployees = employeesRes.data.length;
      const presentToday = attendanceRes.data.filter(a => a.status === 'present').length;
      const absentToday = totalEmployees - presentToday;
      
      setStats({
        totalEmployees,
        presentToday,
        absentToday,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Backend connection failed. Check your Railway URL.');
      // Default stats
      setStats({
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Get an overview of your HRMS system</p>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">⚠️ {error}</p>
            <p className="text-sm mt-2">Check that your Railway backend is running.</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Employees" value={stats.totalEmployees} icon="👥" />
          <StatCard title="Present Today" value={stats.presentToday} icon="✓" />
          <StatCard title="Absent Today" value={stats.absentToday} icon="✗" />
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/employees')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition text-left"
            >
              <div className="text-2xl mb-2">+</div>
              <div>Add Employee</div>
            </button>
            <button
              onClick={() => navigate('/attendance')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition text-left"
            >
              <div className="text-2xl mb-2">📅</div>
              <div>Mark Attendance</div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
