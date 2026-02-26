import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editedDates, setEditedDates] = useState(new Set());

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all employees
      const employeesRes = await api.get('/employees/');
      setEmployees(employeesRes.data);
      
      // Fetch attendance for selected date
      const attendanceRes = await api.get(`/attendance/?date=${selectedDate}`);
      
      const attendanceMap = {};
      attendanceRes.data.forEach(record => {
        attendanceMap[record.employee_id] = record.status;
      });
      
      setAttendance(attendanceMap);
      setEditedDates(new Set());
    } catch (err) {
      setError('Failed to fetch attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance(prev => ({
      ...prev,
      [employeeId]: status
    }));
    setEditedDates(prev => new Set([...prev, employeeId]));
  };

  const handleSaveAttendance = async (employeeId) => {
    try {
      setSaving(true);
      const status = attendance[employeeId];
      
      console.log('📤 [ATTENDANCE] Saving:', { employeeId, date: selectedDate, status });
      await api.post('/attendance/', {
        employee_id: employeeId,
        date: selectedDate,
        status: status,
      });
      
      console.log('✅ [ATTENDANCE] Saved successfully');
      setEditedDates(prev => {
        const newSet = new Set(prev);
        newSet.delete(employeeId);
        return newSet;
      });
    } catch (err) {
      console.error('❌ [ATTENDANCE] Failed to save:', err.response?.data || err.message);
      setError('Failed to save attendance: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Attendance</h1>
          <p className="text-gray-500">Mark attendance for employees</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Date Picker */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <label className="block text-gray-700 font-medium mb-4">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={getMaxDate()}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* Attendance Records */}
        {employees.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">No employees found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Employee ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.employee_id || emp.id || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{emp.name || emp.full_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${emp.employee_id}`}
                            value="present"
                            checked={attendance[emp.employee_id] === 'present'}
                            onChange={() => handleAttendanceChange(emp.employee_id, 'present')}
                            className="mr-2"
                          />
                          <span>Present</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${emp.employee_id}`}
                            value="absent"
                            checked={attendance[emp.employee_id] === 'absent'}
                            onChange={() => handleAttendanceChange(emp.employee_id, 'absent')}
                            className="mr-2"
                          />
                          <span>Absent</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editedDates.has(emp.employee_id) ? (
                        <button
                          onClick={() => handleSaveAttendance(emp.employee_id)}
                          disabled={saving}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-1 px-4 rounded transition"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      ) : (
                        <span className="text-gray-400">Saved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
