import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import Loader from '../components/Loader';

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employee_id: '',
    name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/employees/');
      setEmployees(response.data);
    } catch (err) {
      setError('Backend connection failed. Ensure Railway backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!form.name || !form.email || !form.department) {
      setFormError('Name, Email, and Department are required');
      return;
    }

    if (!isValidEmail(form.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    try {
      // Send only the required fields, backend may auto-generate ID
      const payload = {
        full_name: form.name,
        email: form.email,
        department: form.department,
      };
      
      // Add employee_id only if provided
      if (form.employee_id) {
        payload.employee_id = form.employee_id;
      }
      
      console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
      const response = await api.post('/employees/', payload);
      console.log('✅ Employee added successfully:', response.data);
      setForm({ employee_id: '', name: '', email: '', department: '' });
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error('❌ Full error response:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
      });
      
      // Extract error message from backend
      let errorMsg = err.message;
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.non_field_errors) {
          errorMsg = err.response.data.non_field_errors[0];
        } else if (err.response.data.email) {
          errorMsg = 'Email: ' + (Array.isArray(err.response.data.email) ? err.response.data.email[0] : err.response.data.email);
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      }
      
      setFormError('Failed to add employee: ' + errorMsg);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}/`);
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee');
        console.error(err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Employees</h1>
            <p className="text-gray-500">Manage your workforce</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ Add Employee'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Employee Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Employee</h2>
            
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Employee ID</label>
                <input
                  type="text"
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleFormChange}
                  placeholder="e.g., EMP001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleFormChange}
                  placeholder="e.g., IT, HR"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition w-full"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employees Table */}
        {employees.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">No employees found. Add one to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Employee ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.employee_id || emp.id || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.name || emp.full_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteEmployee(emp.employee_id || emp.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
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
