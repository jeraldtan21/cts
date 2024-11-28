import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications
import { fetchEmployees } from "../../utils/ComputerHelper.jsx";
import { cpuPerformance, gpuPerformance, ramPerformance, storagePerformance } from '../../utils/ComputerSpecs.jsx'; 

const EditComputer = () => {
  const { id } = useParams(); // Get the computer ID from the URL
  const navigate = useNavigate(); // For navigation after a successful update
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    comModel: '',
    comSerial: '',
    comCpu: '',
    comRam: '',
    comStorage: '',
    comGpu: '',
    comOs: '',
    comType: '',
    status: '',
    cpuAccount: '', // Add cpuAccount to form data for accountability
    comImage: '', // Add comImage to form data for image URL
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications
  const [searchQuery, setSearchQuery] = useState(""); // Track search query for accountability
  const [filteredUsers, setFilteredUsers] = useState([]); // For filtered user suggestions
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For controlling dropdown visibility
  const fileInputRef = useRef(null); // Reference to the file input element

  // Fetch users (employees) for the accountability search
  useEffect(() => {
    const fetchUsers = async () => {
      const employees = await fetchEmployees();
      setUsers(employees); // Populate the users state with fetched employees
    };
    fetchUsers();
  }, []);

  // Fetch the existing computer details
  useEffect(() => {
    const fetchComputerDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/computer/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success && response.data.computer) {
          setFormData({
            comModel: response.data.computer.comModel || '',
            comSerial: response.data.computer.comSerial || '',
            comCpu: response.data.computer.comCpu || '',
            comRam: response.data.computer.comRam || '',
            comStorage: response.data.computer.comStorage || '',
            comGpu: response.data.computer.comGpu || '',
            comOs: response.data.computer.comOs || '',
            comType: response.data.computer.comType || '', // Populate comType correctly
            status: response.data.computer.status || '', // Populate status correctly
            comImage: response.data.computer.comImage || '', // Handle the image URL properly
          });

          // If cpuAccount exists, set the searchQuery to the user's name
          if (response.data.computer.cpuAccount?.userId) {
            // Check if the user is deactivated
            const user = response.data.computer.cpuAccount.userId;
            if (user.status === 'deactivated') {
              setSearchQuery(`${user.name} (Deactivated)`); // Append (Deactivated) to the name
            } else {
              setSearchQuery(user.name || ''); // Set the name as usual if not deactivated
            }
          }
        } else {
          setError('Computer details not found.');
        }
      } catch (err) {
        setError(`Failed to fetch computer details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchComputerDetails();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const gpuPerf = gpuPerformance[formData.comGpu] || 0;
    const cpuPerf = cpuPerformance[formData.comCpu] || 0;
    const ramPerf = ramPerformance[formData.comRam] || 0;
    const storagePerf = storagePerformance[formData.comStorage] || 0;
    
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });
    formDataObj.append('gpuPerformance', gpuPerf);
    formDataObj.append('cpuPerformance', cpuPerf);
    formDataObj.append('ramPerformance', ramPerf);
    formDataObj.append('storagePerformance', storagePerf);

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/computer/edit/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (response.data.success) {
        showToast('Computer updated successfully!', 'success'); // Triggering a success toast
        navigate('/admin-dashboard/computers'); // Redirect to the list of computers
      } else {
        console.log(formData); // Check if any field is undefined or incorrect
        setError(response.data.error || 'Failed to update computer.');
      }
    } catch (err) {
      setError(`Failed to update computer: ${err.message}`);
      showToast(`Accountability not found or Failed to update computer!`, 'error'); 
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true); // Open dropdown when the user starts typing
  };

  const handleSelectUser = (user) => {
    setFormData((prevData) => ({ ...prevData, cpuAccount: user._id })); // Set the selected user ID
    setSearchQuery(user.userId.name); // Set the search query to the selected user's name
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  // Filter users based on the search query
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered); // Update filtered users list
  }, [searchQuery, users]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Log the selected file
  
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file); // Append the selected image to FormData
  
      try {
        console.log("Uploading profile image...");
        setLoading(true); // Show loading state during image upload
        
        const response = await axios.put(
          `http://localhost:3000/api/computer/update-computer-image/${id}`, // Fixed endpoint
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentication token
              'Content-Type': 'multipart/form-data', // Set content type to handle file upload
            },
          }
        );
  
        console.log("Profile image upload response:", response.data); // Log response after image upload
  
        if (response.data.success) {
          // Successfully updated profile image, update formData state to reflect changes
          setFormData((prevState) => ({
            ...prevState,
            comImage: response.data.comImage, // Update with the new image path
          }));
          
          showToast('Profile image updated successfully', 'success'); // Triggering a success toast
          console.log("Profile image updated successfully");
        } else {
          const errorMessage = response.data.error || 'Failed to update profile image';
          setError(errorMessage);
          console.log("Error updating profile image:", errorMessage);
        }
      } catch (err) {
        const errorMessage = `Error uploading profile image: ${err.message}`;
        setError(errorMessage);
        console.error("Error uploading profile image:", errorMessage);
        alert(errorMessage); // Notify the user about the error
      } finally {
        setLoading(false); // Hide loading state after request is done
        console.log("Image upload complete");
      }
    }
  };
  


  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h3 className="text-2xl font-bold mb-6">Edit Computer Details</h3>
      
      {/* Display error message if there's any error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Display loading text while the form is being processed */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
        
          {/* Computer Image Section */}
          <div className="flex justify-center items-center mb-4">
            <div className="relative w-40 h-40 md:w-72 md:h-72 overflow-hidden rounded-lg shadow-lg">
              
              {/* Display the current computer image if it exists */}
              {formData.comImage && (
                <img
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  src={`http://localhost:3000/${formData.comImage}`}
                  alt="Computer Model"
                />
              )}
  
              {/* Hover overlay to trigger file input for image upload */}
              <div
                className="border w-full h-full absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
                onClick={() => fileInputRef.current.click()} // Trigger file input when clicking overlay
              >
                <span className="text-white text-2xl font-bold">📸</span>
              </div>
  
              {/* Hidden File Input for image upload */}
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                ref={fileInputRef} // Reference for triggering file input
                onChange={handleImageChange} // Handle file selection and upload
                className="hidden" // Hide the actual file input
              />
            </div>
          </div>
    
          {/* Form Fields: Grid for displaying fields in columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
          
            {/* Computer Brand/Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Computer Brand/Model</label>
              <input
                type="text"
                name="comModel"
                value={formData.comModel}
                onChange={handleChange}
                placeholder="Computer Brand/Model"
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
    
            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Serial Number</label>
              <input
                disabled={true} // disable text input (since you want to pre-fill)
                type="text"
                name="comSerial"
                value={formData.comSerial}
                onChange={handleChange}
                placeholder="Serial Number"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
    
            {/* Processor Selection with Datalist */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Processor</label>
              <input
                type="text"
                list="cpuOptions" // List options for CPU
                name="comCpu"
                value={formData.comCpu}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Select or type a processor"
                required
                onChange={(e) => setFormData({ ...formData, comCpu: e.target.value })}
              />
              <datalist id="cpuOptions">
                {Object.keys(cpuPerformance).map((cpu) => (
                  <option key={cpu} value={cpu} />
                ))}
              </datalist>
            </div>
  
            {/* RAM Selection with Datalist */}
            <div>
              <label className="block text-sm font-medium text-gray-700">RAM</label>
              <input
                type="text"
                list="ramOptions" // List options for RAM
                name="comRam"
                value={formData.comRam}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Select or type RAM"
                required
                onChange={(e) => setFormData({ ...formData, comRam: e.target.value })}
              />
              <datalist id="ramOptions">
                {Object.keys(ramPerformance).map((ram) => (
                  <option key={ram} value={ram} />
                ))}
              </datalist>
            </div>
  
            {/* Storage Selection with Datalist */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Storage</label>
              <input
                type="text"
                list="storageOptions" // List options for Storage
                name="comStorage"
                value={formData.comStorage}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Select or type storage"
                required
                onChange={(e) => setFormData({ ...formData, comStorage: e.target.value })}
              />
              <datalist id="storageOptions">
                {Object.keys(storagePerformance).map((storage) => (
                  <option key={storage} value={storage} />
                ))}
              </datalist>
            </div>
  
            {/* GPU Selection with Datalist */}
            <div>
              <label className="block text-sm font-medium text-gray-700">GPU</label>
              <input
                type="text"
                list="gpuOptions" // List options for GPU
                name="comGpu"
                value={formData.comGpu}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Select or type GPU"
                required
                onChange={(e) => setFormData({ ...formData, comGpu: e.target.value })}
              />
              <datalist id="gpuOptions">
                {Object.keys(gpuPerformance).map((gpu) => (
                  <option key={gpu} value={gpu} />
                ))}
              </datalist>
            </div>
    
            {/* Operating System Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Operating System</label>
              <select
                name="comOs"
                value={formData.comOs}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select OS</option>
                <option value="windows">Windows</option>
                <option value="macOs">Mac OS</option>
                <option value="linux">Linux</option>
                <option value="server">Server</option>
              </select>
            </div>
    
            {/* Unit Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit Type</label>
              <select
                name="comOs" // Same name as OS, probably should be `comType`
                value={formData.comType}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select type</option>
                <option value="Windows Laptop">Windows Laptop</option>
                <option value="Windows Desktop">Windows Desktop</option>
                <option value="Mac Laptop">Mac Laptop</option>
                <option value="Mac Desktop">Mac Desktop</option>
              </select>
            </div>
    
           {/* Accountability Search */}
<div className="relative">
  <label className="block text-sm font-medium text-gray-700">Accountability</label>
  <div className="mt-1 w-full p-2 border border-gray-300 rounded-md">
    <input
      type="text"
      name="cpuAccount"
      value={searchQuery}
      onChange={(e) => {
        handleSearchChange(e); // Handle search query
        handleChange(e); // Handle form data change
      }}
      className="w-full border-none outline-none"
      placeholder="Search accountability"
      required
    />
  </div>
  {isDropdownOpen && searchQuery && filteredUsers.length > 0 && (
    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
      <ul>
        {/* Display filtered users based on search */}
        {filteredUsers.map((user) => (
          <li
            key={user._id}
            onClick={() => handleSelectUser(user)} // Select user when clicked
            className="p-2 cursor-pointer hover:bg-gray-200"
          >
            {/* Show 'Deactivated' if the user is deactivated */}
            {user.userId.status === 'deactivated' 
              ? `${user.userId.name} (Deactivated)` // Add "(Deactivated)" next to the name
              : user.userId.name}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
  
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Operating System</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select OS</option>
                <option value="working">Working</option>
                <option value="warranty">Warranty</option>
                <option value="repair">Repair</option>
                <option className="bg-red-500 text-white" value="defective">Defective</option>
              </select>
            </div>
          </div>
    
          {/* Submit Button */}
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? 'Updating...' : 'Update Computer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
  
  
  
};

export default EditComputer;
