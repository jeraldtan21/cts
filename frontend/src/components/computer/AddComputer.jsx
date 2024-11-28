import React, { useState, useEffect } from "react";
import { fetchEmployees } from "../../utils/ComputerHelper.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../context/ToastContext'; 
import { cpuPerformance, gpuPerformance, ramPerformance, storagePerformance } from '../../utils/ComputerSpecs.jsx'; 


const AddComputer = () => {
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetch employees for accountability
  useEffect(() => {
    const fetchUsers = async () => {
      const employees = await fetchEmployees();
      setUsers(employees);
    };
    fetchUsers();
  }, []);

  // Handle file input (image)
  const handleFile = (file) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only image files (jpeg, jpg, png, gif) are allowed!');
        return;
      }
      setFormData((prevData) => ({ ...prevData, image: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle search input for accountability
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  // Handle user selection from the dropdown
  const handleSelectUser = (user) => {
    setFormData((prevData) => ({ ...prevData, cpuAccount: user._id }));
    setSearchQuery(user.userId.name);
    setIsDropdownOpen(false);
  };



  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fileInputRef = React.createRef();

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

    try {
      const response = await axios.post(
        'http://localhost:3000/api/computer/add',
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 200) {
        showToast('Computer added successfully!', 'success');
        setFormData({});
        setImagePreview(null);
        navigate("/admin-dashboard/computers");
      }
    } catch (error) {
      showToast('Computer serial number already exists', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h3 className="text-2xl font-bold mb-6">Add New Computer</h3>
      
      {/* Start of the form for adding a new computer */}
      <form onSubmit={handleSubmit}>
      
        {/* Display image preview if an image is selected */}
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-32 h-32 object-cover rounded-md mx-auto"
            />
          </div>
        )}
        
        {/* Image upload section: clickable area for selecting an image */}
        <div
          className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer"
          onClick={() => fileInputRef.current.click()} // Triggers file input when clicked
        >
          <input
            type="file"
            name="image"
            accept="image/*" // Only accept image files
            className="hidden" // Hide the actual file input
            ref={fileInputRef} // Reference to the file input element
            onChange={(e) => handleFile(e.target.files[0])} // Handle file selection
          />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
  
        {/* Form Fields for Computer Details */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-3">
        
          {/* Computer Brand/Model input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Computer Brand/Model</label>
            <input
              type="text"
              name="comModel"
              placeholder="Computer Brand/Model"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={(e) => setFormData({ ...formData, comModel: e.target.value })} // Update form data
            />
          </div>
  
          {/* Serial Number input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              type="text"
              name="comSerial"
              placeholder="Serial Number"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={(e) => setFormData({ ...formData, comSerial: e.target.value })} // Update form data
            />
          </div>
  
          {/* Processor selection with suggestions from cpuPerformance object */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Processor</label>
            <input
              type="text"
              list="cpuOptions" // Link input to datalist
              name="comCpu"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              placeholder="Select or type a processor"
              required
              onChange={(e) => setFormData({ ...formData, comCpu: e.target.value })} // Update form data
            />
            {/* Datalist containing processor options */}
            <datalist id="cpuOptions">
              {Object.keys(cpuPerformance).map((cpu) => (
                <option key={cpu} value={cpu} />
              ))}
            </datalist>
          </div>
  
          {/* RAM selection with suggestions from ramPerformance object */}
          <div>
            <label className="block text-sm font-medium text-gray-700">RAM</label>
            <input
              type="text"
              list="ramOptions" // Link input to datalist
              name="comRam"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              placeholder="Select or type RAM"
              required
              onChange={(e) => setFormData({ ...formData, comRam: e.target.value })} // Update form data
            />
            {/* Datalist containing RAM options */}
            <datalist id="ramOptions">
              {Object.keys(ramPerformance).map((ram) => (
                <option key={ram} value={ram} />
              ))}
            </datalist>
          </div>
  
          {/* Storage selection with suggestions from storagePerformance object */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Storage</label>
            <input
              type="text"
              list="storageOptions" // Link input to datalist
              name="comStorage"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              placeholder="Select or type storage"
              required
              onChange={(e) => setFormData({ ...formData, comStorage: e.target.value })} // Update form data
            />
            {/* Datalist containing storage options */}
            <datalist id="storageOptions">
              {Object.keys(storagePerformance).map((storage) => (
                <option key={storage} value={storage} />
              ))}
            </datalist>
          </div>
  
          {/* GPU selection with suggestions from gpuPerformance object */}
          <div>
            <label className="block text-sm font-medium text-gray-700">GPU</label>
            <input
              type="text"
              list="gpuOptions" // Link input to datalist
              name="comGpu"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              placeholder="Select or type GPU"
              required
              onChange={(e) => setFormData({ ...formData, comGpu: e.target.value })} // Update form data
            />
            {/* Datalist containing GPU options */}
            <datalist id="gpuOptions">
              {Object.keys(gpuPerformance).map((gpu) => (
                <option key={gpu} value={gpu} />
              ))}
            </datalist>
          </div>
  
          {/* Operating System selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating System</label>
            <select
              name="comOs"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={(e) => setFormData({ ...formData, comOs: e.target.value })} // Update form data
            >
              <option value="">Select OS</option>
              <option value="windows">Windows</option>
              <option value="macOs">Mac OS</option>
              <option value="linux">Linux</option>
              <option value="server">Server</option>
            </select>
          </div>
  
          {/* Unit Type selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit Type</label>
            <select
              name="comType"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={(e) => setFormData({ ...formData, comType: e.target.value })} // Update form data
            >
              <option value="">Select type</option>
              <option value="Windows Laptop">Windows Laptop</option>
              <option value="Windows Desktop">Windows Desktop</option>
              <option value="Mac Laptop">Mac Laptop</option>
              <option value="Mac Desktop">Mac Desktop</option>
            </select>
          </div>
  
          {/* Accountability search input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Accountability</label>
            <div className="mt-1 w-full p-2 border border-gray-300 rounded-md">
              <input
                type="text"
                name="cpuAccount"
                value={searchQuery}
                onChange={handleSearchChange} // Update search query
                className="w-full border-none outline-none"
                placeholder="Search accountability"
                required
              />
            </div>
            
            {/* Display search results as a dropdown */}
            {isDropdownOpen && searchQuery && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <ul>
                  {/* Map over filtered users and display them */}
                  {filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => handleSelectUser(user)} // Handle user selection
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {user.userId.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
  
        {/* Submit button to add the new computer */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Add Computer
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default AddComputer;

