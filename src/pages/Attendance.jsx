import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [mode, setMode] = useState('view'); // 'view' or 'mark'
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

      // Deduplicate raw records by employee (normalize using fetched employees)
      const raw = attendanceRes.data || [];
      const recMap = {};

      const findEmployeeId = (val) => {
        if (!val && val !== 0) return null;
        // try to match against employees by id or employee_id
        const byId = employeesRes.data.find(e => String(e.id) === String(val));
        if (byId) return String(byId.id);
        const byEmpId = employeesRes.data.find(e => String(e.employee_id) === String(val));
        if (byEmpId) return String(byEmpId.id);
        return String(val);
      };

      raw.forEach(record => {
        const empKey = findEmployeeId(record.employee);
        const key = empKey || String(record.employee || '');
        // attach normalized employee identifier to record for later use
        const rec = { ...record, employeeNormalized: key };
        // also store normalized employee on the record for consistent lookups
        rec.employee = key;

        if (!recMap[key]) {
          recMap[key] = rec;
        } else {
          const existing = recMap[key];
          // Prefer record with an explicit status (not null/empty)
          const hasStatus = rec.status !== null && rec.status !== undefined && String(rec.status).trim() !== '';
          const existingHasStatus = existing.status !== null && existing.status !== undefined && String(existing.status).trim() !== '';
          if (hasStatus && !existingHasStatus) {
            recMap[key] = rec;
          } else if (hasStatus === existingHasStatus) {
            // tie-breaker: prefer higher numeric id
            if (rec.id && existing.id) {
              if (Number(rec.id) > Number(existing.id)) recMap[key] = rec;
            } else {
              // fallback to latest seen
              recMap[key] = rec;
            }
          }
        }
      });

      const deduped = Object.values(recMap);
      // Keep deduped records for view mode
      setAttendanceRecords(deduped);

      // Build a normalized map for mark mode from deduped records
      const attendanceMap = {};
      deduped.forEach(record => {
        const statRaw = record.status;
        if (statRaw === null || statRaw === undefined || String(statRaw).trim() === '') return; // skip unset
        const stat = String(statRaw || '').toLowerCase();
        attendanceMap[String(record.employeeNormalized || String(record.employee))] = stat === 'present' ? 'Present' : 'Absent';
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
      
      const payload = {
        employee: employeeId,
        date: selectedDate,
        status: status, // send as-is (Present or Absent)
      };
      
      console.log('📤 [ATTENDANCE] Payload being sent:', payload);
      console.log('📤 [ATTENDANCE] Employee ID type:', typeof employeeId, 'Value:', employeeId);
      console.log('📤 [ATTENDANCE] Status type:', typeof status, 'Value:', status);
      console.log('📤 [ATTENDANCE] Date type:', typeof selectedDate, 'Value:', selectedDate);
      
      // If an attendance record for this employee on this date already exists, PATCH it instead of POST
      const existingRecord = (attendanceRecords || []).find(r => String(r.employee || r.employeeNormalized) === String(employeeId));
      let response;
      if (existingRecord && existingRecord.id) {
        response = await api.patch(`/attendance/${existingRecord.id}/`, payload);
      } else {
        response = await api.post('/attendance/', payload);
      }

      console.log('✅ [ATTENDANCE] Response:', response.data);

      // Update local attendanceRecords with returned record
      const returned = response.data;
      setAttendanceRecords(prev => {
        const map = {};
        (prev || []).forEach(r => { map[r.id || `${r.employee}-${r.date}`] = r; });
        const key = returned.id || `${returned.employee}-${returned.date}`;
        map[key] = returned;
        return Object.values(map);
      });
      setEditedDates(prev => {
        const newSet = new Set(prev);
        newSet.delete(employeeId);
        return newSet;
      });
    } catch (err) {
      console.error('❌ [ATTENDANCE] Full Error Object:', err.response);
      console.error('❌ [ATTENDANCE] Error Data:', JSON.stringify(err.response?.data || err.message, null, 2));
      console.error('❌ [ATTENDANCE] Error Message:', err.message);
      setError('Failed to save attendance: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // derive a simple lookup of status by normalized employee key - only for CURRENT selected date
  const statusMap = {};
  (attendanceRecords || []).forEach(rec => {
    // Only include records for the currently selected date
    if (rec.date !== selectedDate) return;
    const key = String(rec.employeeNormalized || rec.employee || '');
    statusMap[key] = rec.status;
  });

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

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('view')}
            className={`py-2 px-4 rounded ${mode === 'view' ? 'bg-red-600 text-white' : 'bg-white border'}`}
          >
            View Attendance
          </button>
          <button
            onClick={() => setMode('mark')}
            className={`py-2 px-4 rounded ${mode === 'mark' ? 'bg-red-600 text-white' : 'bg-white border'}`}
          >
            Mark Attendance
          </button>
        </div>

        {/* Attendance Records / Marking */}
        {mode === 'view' ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-medium mb-4">Date</h2>
            <p className="mb-4">{selectedDate}</p>

            {/* always show employee list, use statusMap to display values */}
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Employee ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => {
                    const key = String(emp.id || emp.employee_id || idx);
                    const raw = statusMap[key];
                    const status = raw == null
                      ? 'Not Marked'
                      : (String(raw).toLowerCase() === 'present' ? 'Present' : 'Absent');
                    return (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{emp.employee_id || emp.id || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{emp.name || emp.full_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Mark mode
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
                            name={`attendance-${emp.id}`}
                            value="Present"
                            checked={attendance[emp.id] === 'Present'}
                            onChange={() => handleAttendanceChange(emp.id, 'Present')}
                            className="mr-2"
                          />
                          <span>Present</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${emp.id}`}
                            value="Absent"
                            checked={attendance[emp.id] === 'Absent'}
                            onChange={() => handleAttendanceChange(emp.id, 'Absent')}
                            className="mr-2"
                          />
                          <span>Absent</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editedDates.has(emp.id) ? (
                        <button
                          onClick={() => handleSaveAttendance(emp.id)}
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
