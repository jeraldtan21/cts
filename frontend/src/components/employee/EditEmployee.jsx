import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDepartments } from '../../utils/EmployeeHelper.jsx';
import { format } from 'date-fns';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial state for employee fields
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    dob: '',
    gender: '',
    role: '',
    status: '',
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const departments = await fetchDepartments();
        setDepartments(departments);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          const employeeData = response.data.employee;
          setEmployee({
            name: employeeData.userId?.name || '',
            email: employeeData.userId?.email || '',
            employeeId: employeeData.employeeId || '',
            department: employeeData.department?._id || '',
            dob: employeeData.dob ? format(new Date(employeeData.dob), "yyyy-MM-dd") : '',
            gender: employeeData.gender || '',
            role: employeeData.userId?.role || '',
            status: employeeData.userId?.status || ''
          });
        } else {
          setError('Failed to fetch employee data');
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:3000/api/employee/edit/${id}`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 200) {
        showToast('Employee Update successful!', 'success'); // Triggering a success toast
        navigate('/admin-dashboard/employees');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {departments.length && employee ? (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-center">Update Employee Details</h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                  value={employee.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  disabled={true} // disable text input (since you want to pre-fill)
                  type="email"
                  name="email"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                  value={employee.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <input
                  disabled={true} // disable text input (since you want to pre-fill)
                  type="text"
                  name="employeeId"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  value={employee.employeeId}
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                  value={employee.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                  onChange={handleChange}
                  value={employee.dob}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                  value={employee.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                  value={employee.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                  value={employee.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option className="bg-red-500 text-white" value="deactivated">Deactivated</option>
                </select>
              </div>
            </div>

            <div className="mt-6 text-right">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Update Employee
          </button>
           </div>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default EditEmployee;
