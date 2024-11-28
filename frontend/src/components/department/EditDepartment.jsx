import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications

const EditDepartment = () => {
  const { id } = useParams(); // Get department ID from URL parameters
  const [department, setDepartment] = useState({ dep_name: '', description: '' });
  const [depLoading, setDepLoading] = useState(false);
  const [error, setError] = useState(null); // State to store any errors
  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications

  const navigate = useNavigate();

  // Fetch department data when component mounts
  useEffect(() => {
    const fetchDepartment = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/department/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          setDepartment(response.data.department); // Populate department data
        } else {
          setError('Failed to fetch department data');
        }
      } catch (error) {
        setError(error.message);
        alert(`Error fetching department: ${error.message}`);
      } finally {
        setDepLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  // Submit updated department data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/department/${id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        showToast('Depparment update successful!', 'success'); // Triggering a success toast
        navigate('/admin-dashboard/departments'); // Redirect on success
      } else {
        setError('Failed to update department');
      }
    } catch (error) {
      setError(error.message);
      alert(`Error updating department: ${error.message}`);
    }
  };

  return (
    <>
      {depLoading ? (
        <div>Loading...</div> // Show loading indicator while fetching data
      ) : (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
          <h3 className="text-2xl font-bold mb-6">Update Department</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
                Department Name
              </label>
              <input
                name="dep_name"
                type="text"
                placeholder="Enter Department Name"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onChange={handleChange}
                value={department.dep_name}
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Description"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                onChange={handleChange}
                value={department.description}
                required
              />
            </div>

            {error && (
              <div className="mt-4 text-red-500">
                {error} {/* Display error message if any */}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 rounded"
            >
              Update Department
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditDepartment;
