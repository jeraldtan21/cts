import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper';
import axios from 'axios';


const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Fetch department data from the API
  const fetchDepartments = async () => {
    setDepLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get('http://localhost:3000/api/department', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        // Map over departments to add serial number and action buttons
        const data = response.data.departments.map((dep, index) => ({
          _id: dep._id,
          sno: index + 1, // Serial number
          dep_name: dep.dep_name,
          description: dep.description,
          action: <DepartmentButtons Id={dep._id} onDepartmentDelete={fetchDepartments} />, // Pass fetchDepartments to refresh data after delete
        }));

        setDepartments(data);
        setFilteredDepartments(data); // Set initial filtered departments
      }
    } catch (error) {
      console.error("Error fetching departments:", error.message);
      alert("Error fetching departments. Please try again.");
    } finally {
      setDepLoading(false); // Stop loading indicator
    }
  };

  // Filter departments by name
  const filterDepartments = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(searchTerm)
    );
    setFilteredDepartments(filtered); // Update filtered departments
  };

  // Initial fetch of department data on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      {depLoading ? (
        <div>Loading...</div> // Show loading indicator if data is still being fetched
      ) : (
        <div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Departments</h3>
          </div>
          <div className="flex justify-between items-center px-5">
            {/* Input field for searching departments */}
            <input
              type="text"
              placeholder="Search By Department Name"
              className="px-4 py-2 border rounded"
              onChange={filterDepartments}
            />
            {/* Link to add a new department */}
            <Link
              to="/admin-dashboard/add-new-department"
              className="px-4 py-2 bg-sky-500 rounded text-white"
            >
              Add New Department
            </Link>
          </div>

          {/* DataTable component to display department data */}
          <div className="mt-5 px-2">
             <DataTable
                columns={columns} // Columns defined in DepartmentHelper
                data={filteredDepartments} // Display filtered data
                 pagination // Enable pagination
                 fixedHeader // Make the table header fixed
                 fixedHeaderScrollHeight="600px" // Set the height for the scrollable area
                  responsive // Make the table responsive
  />
                 </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
