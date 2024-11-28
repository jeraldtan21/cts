import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import axios from 'axios';

const EmployeeList = () => {
  // State variables
  const [employees, setEmployees] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState('active'); // New state for filtering by status

  // Fetch employee data from the API
  const fetchEmployees = async () => {
    setDepLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get('http://localhost:3000/api/employee', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        // Process employee data to include serial number and action buttons
        const data = response.data.employees.map((emp, index) => ({
          _id: emp._id,
          employeeId: emp.employeeId,
          dep_name: emp.department?.dep_name || "No Department", // Use optional chaining and provide fallback text
          name: emp.userId?.name || "No Name", // Fallback for missing name
          gender: emp.gender || "No Gender", // Fallback for missing name
          role: emp.userId?.role || "No Role", // Fallback for missing name
          status: emp.userId?.status || "No Role", // Fallback for missing name
          dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "No Date", // Fallback for missing DOB
          profileImage: emp.userId?.profileImage ? (
            <img
              src={`http://localhost:3000/${emp.userId.profileImage}`}
              alt={`${emp.userId.name}'s profile`}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover', // Ensures the image fills the area without distortion
                borderRadius: '50%' // Makes the image circular
              }}
            />
          ) : (
            <div style={{ width: '50px', height: '50px', backgroundColor: '#ccc', borderRadius: '50%' }}></div> // Placeholder for missing image
          ),
          action: <EmployeeButtons Id={emp._id} onEmployee={fetchEmployees} />, // Pass fetchEmployees to refresh data after delete
        }));

        setEmployees(data);
        setFilteredEmployees(data); // Set initial filtered employees
      }
    } catch (error) {
      console.error("Error fetching employees:", error.message);
      alert("Error fetching employees. Please try again.");
    } finally {
      setDepLoading(false); // Stop loading indicator
    }
  };

  // Filter employees by name, employeeId, or status
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
  
    const filtered = employees.filter((emp) => 
      (emp.name.toLowerCase().includes(searchTerm) || 
      emp.employeeId.toLowerCase().includes(searchTerm)) && 
      (statusFilter === 'all' || emp.status.toLowerCase() === statusFilter)
    );

    setFilteredEmployees(filtered); // Set filtered employees
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Initial fetch of employee data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Refine the filtered employees whenever the status filter changes
    const filtered = employees.filter((emp) => 
      (statusFilter === 'all' || emp.status.toLowerCase() === statusFilter)
    );
    setFilteredEmployees(filtered);
  }, [statusFilter, employees]); // Trigger re-filtering when employees or statusFilter changes

  return (
    <>
      {depLoading ? (
        <div>Loading...</div> // Show loading indicator if data is still being fetched
      ) : (
        <div className="responsive flex flex-col h-screen px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold">Manage Employee</h3>
          </div>

          {/* Search and Add New Employee Section */}
          <div className="flex flex-col md:flex-row justify-between items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search By Name or ID"
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              onChange={handleSearch} // Attach the search handler
            />
            {/* Status Filter Dropdown */}
            <select
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="active">Active</option>
              <option value="all">All Statuses</option>
              <option value="deactivated">Deactivated</option>
            </select>
            {/* Add New Employee Button */}
            <Link
              to="/admin-dashboard/add-new-employee"
              className="w-full md:w-auto px-4 py-2 bg-sky-500 rounded text-white hover:bg-sky-600 text-center"
            >
              Add New Employee
            </Link>
          </div>

          {/* DataTable */}
          <div className="flex-auto overflow-y-auto">
            <DataTable
              columns={columns} // Columns defined in EmployeeHelper
              data={filteredEmployees} // Display filtered data
              pagination // Enable pagination
              fixedHeader
              fixedHeaderScrollHeight="calc(100vh - 250px)" // Adjust height dynamically
              responsive
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
