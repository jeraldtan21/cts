import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications

const AddDepartment = () => {
  // State to manage the department form data
  const [departmentData, setDepartmentData] = useState({
    dep_name: '',
    description: ''
  });

  // State to handle error messages
  const [error, setError] = useState('');

  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications

  // useNavigate hook to programmatically navigate to another page
  const navigate = useNavigate();

  // Handles input changes for the department form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    try {
      // Send POST request to add a new department
      const response = await axios.post(
        'http://localhost:3000/api/department/add',
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Set auth token header
            'Content-Type': 'application/json' // Set content type for JSON payload
          }
        }
      );

      // If the response status is 200, navigate to the departments list page
      if (response.status === 200) {
         // Show a success toast
         showToast('Department add successful!', 'success'); // Triggering a success toast
        navigate('/admin-dashboard/departments');
      }
    } catch (error) {
      // Set an error message if the request fails
      setError(error.response?.data?.error || 'Failed to add department. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h3 className="text-2xl font-bold mb-6">Add Department</h3>

      {/* Display error message if there is an error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Department form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
            Department Name
          </label>
          <input
            name="dep_name"
            type="text"
            placeholder="Enter Department Name"
            value={departmentData.dep_name}
            onChange={handleChange} // Update state when input changes
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required // Set field as required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={departmentData.description}
            onChange={handleChange} // Update state when input changes
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            required // Set field as required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full mt-6 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 rounded"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
