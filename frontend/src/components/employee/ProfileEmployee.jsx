import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications
import { fetchDepartments } from '../../utils/EmployeeHelper.jsx';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Importing the icons for status
import { Accountcolumns } from "../../utils/ComputerHelper";  // Import from ComputerHelper
import DataTable from 'react-data-table-component'; // Make sure you have the correct import for DataTable
//  employee profile itong pages
const ProfileEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL params
  const [employee, setEmployee] = useState(null); // State to store employee details
  const [error, setError] = useState(null); // State to store any errors if they occur
  const [loading, setLoading] = useState(false); // State to handle loading state during image upload
  const fileInputRef = useRef(null); // Reference to the file input element
  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications
  const [departments, setDepartments] = useState([]); // State to store department details
  const [computerHistory, setComputerHistory] = useState([]); // State to store computer history

  // Fetch departments when the component mounts
  useEffect(() => {
    const getDepartments = async () => {
      try {
        console.log("Fetching departments...");
        const departmentData = await fetchDepartments();
        setDepartments(departmentData);
        console.log("Departments fetched:", departmentData);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to load departments");
      }
    };
    getDepartments();
  }, []);

  // Fetch employee data when the component mounts or when `id` changes
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log("Fetching employee data for ID:", id);  // Log the employee ID being fetched

        const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
          },
        });

        console.log("Employee Data Response:", response.data);  // Log the response

        if (response.data.success && response.data.employee) {
          setEmployee(response.data.employee); // Set employee details in state
          console.log("Employee data set:", response.data.employee);
        } else {
          setError('No employee data found');
          console.log("Error: No employee data found");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(`Error fetching employee data: ${err.message}`);
      }
    };

    if (id) {
      fetchEmployee(); // Call the function to fetch the employee data
    }
  }, [id]); // Dependency array: re-run the effect if the `id` changes

  const fetchAccoutability = async () => {
    console.log("Fetching activity history for computer ID:", id);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/computer/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      console.log("Fetched Accoutability  response:", response.data);
  
      if (response.data.success && Array.isArray(response.data.computerHistory)) {
        const data = response.data.computerHistory.map((com) => ({
          _id: com._id,
          comModel: com.comModel,
          comSerial: com.comSerial,
          comCpu: com.comCpu,
          comRam: com.comRam,
          comStorage: com.comStorage,
          comGpu: com.comGpu,
          comOs: com.comOs,
          comStatus: com.status, 
          comImage: com.comImage ? (
            <img
              src={`http://localhost:3000/${com.comImage}`}
              alt={com.comModel}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <div
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#ccc",
                borderRadius: "50%",
              }}
            />
          )
        }));
        setComputerHistory(data);
      } else {
        setError('No Accountability found');
      }
    } catch (err) {
     // console.error("Error fetching Accountability:", err);
      setError(`Error fetching Accountability: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection for profile image and upload it
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Log the selected file
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file); // Append the selected image to the FormData

      try {
        console.log("Uploading profile image...");
        setLoading(true); // Show loading state during image upload
        const response = await axios.put(`http://localhost:3000/api/employee/update-profile-image/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentication token
            'Content-Type': 'multipart/form-data', // Set content type to handle file upload
          },
        });

        console.log("Profile image upload response:", response.data); // Log response after image upload

        if (response.data.success) {
          // Successfully updated profile image, reload the employee data to reflect changes
          setEmployee((prevState) => ({
            ...prevState,
            userId: { ...prevState.userId, profileImage: response.data.profileImage },
          }));
          showToast('Profile image updated successfully', 'success'); // Triggering a success toast
          console.log("Profile image updated successfully");
        } else {
          setError(response.data.error || 'Failed to update profile image');
          console.log("Error updating profile image:", response.data.error);
        }
      } catch (err) {
        setError(`Error uploading profile image: ${err.message}`);
        console.error("Error uploading profile image:", err.message);
        alert(`Error: ${err.message}`);
      } finally {
        setLoading(false); // Hide loading state after request is done
        console.log("Image upload complete");
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchAccoutability(); // Fetch the accountability data when the ID is available
    }
  }, [id]);

  return (
    <>
      {employee ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-4 md:p-8 rounded-md shadow-md">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Employee Details</h3>

          {/* Employee data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Profile Image */}
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 mx-auto">
              <img
                className="rounded-full border w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                src={employee.userId.profileImage ? `http://localhost:3000/${employee.userId.profileImage}` : '/default-avatar.png'} // Fallback if image is missing
                alt="Employee Profile"
                onClick={() => fileInputRef.current.click()} // Trigger the file input click when the image is clicked
              />
              {/* Hover overlay */}
              <div
                className="rounded-full border w-full h-full absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
                onClick={() => fileInputRef.current.click()} // Trigger file input on overlay click
              >
                <span className="text-white text-2xl font-bold">📸</span>
              </div>
  
              {/* Hidden File Input */}
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                ref={fileInputRef} // Reference to trigger the input
                onChange={handleImageChange} // Handle file selection and trigger upload
                className="hidden" // Hide the input element
              />
            </div>
  
            {/* Employee Details */}
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-3 mb-2">
                <p className="text-lg font-bold">Name:</p>
                <p className="font-medium">{employee.userId.name}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-3 mb-2">
                <p className="text-lg font-bold">Employee ID:</p>
                <p className="font-medium">{employee.employeeId}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-3 mb-2">
                <p className="text-lg font-bold">Date of Birth:</p>
                <p className="font-medium">{new Date(employee.dob).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-3 mb-2">
                <p className="text-lg font-bold">Department:</p>
                <p className="font-medium">{employee.department?.description || 'N/A'}</p>
              </div>
              {/* Status with color indicators */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-3 mb-2">
                <p className="text-lg font-bold">Status:</p>
                <p className="font-medium flex items-center space-x-2">
                  {employee.userId?.status === "active" ? (
                    <FaCheckCircle className="text-green-500" size={20} /> // Green for Active
                  ) : (
                    <FaTimesCircle className="text-red-500" size={20} /> // Red for Deactivated
                  )}
                  <span>{employee.userId?.status || 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>
        
        </div>
  
  
      ) : (
        <div className="text-center text-gray-500">Loading...</div>
      )}

         {/* Accountability List */}
         <div className="mt-10">
          <h4 className="text-xl sm:text-2xl font-bold mb-4">Accountability List</h4>
  
          {/* Show loading state for accountability data */}
          {loading ? (
            <p className="text-center text-gray-500">Loading accountability data...</p>
          ) : computerHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <DataTable
                columns={Accountcolumns} // Columns defined in Accountcolumns
                data={computerHistory} // Data fetched for the accountability list
                pagination
                fixedHeader
                fixedHeaderScrollHeight="calc(100vh - 250px)"
                responsive
                progressPending={loading} // Use loading state for progressPending
              />
            </div>
          ) : (
            <p className="text-center text-gray-500">No accountability data.</p>
          )}
        </div>
    </>
  );
  
  
};

export default ProfileEmployee;
