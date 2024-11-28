import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDepartments } from '../../utils/EmployeeHelper.jsx';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const navigate = useNavigate();
  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
      // Create a URL for the preview of the image
      const file = files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl); // Set the preview URL
      }
    } else if (name === "password") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      evaluatePasswordStrength(value);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);

    if (formData.password && value !== formData.password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const evaluatePasswordStrength = (password) => {
    let strength = "";
    if (password.length >= 8) {
      if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@$!%*?&#]/.test(password)) {
        strength = "Strong";
      } else if ((/[A-Z]/.test(password) || /[a-z]/.test(password)) && /\d/.test(password) && password.length >= 6) {
        strength = "Moderate";
      } else {
        strength = "Weak";
      }
    } else {
      strength = "Too Short";
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/api/employee/add',
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 200) {
        showToast('Employee add successful!', 'success'); // Triggering a success toast
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      showToast('Email or Employee already registered', 'error'); // Triggering a success toast
    }
  };

  // Drag-and-drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping
    e.stopPropagation(); // Prevent other default behaviors
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0]; // Get the dropped file
    if (file) {
      setFormData((prevData) => ({ ...prevData, image: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Set the preview URL
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFormData((prevData) => ({ ...prevData, image: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Set the preview URL
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h3 className="text-2xl font-bold mb-6">Add New Employee</h3>
      <form onSubmit={handleSubmit}>

        {/* Show image preview */}
        {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-32 h-32 object-cover rounded-md mx-auto"
              />
            </div>
          )}
         {/* Drag-and-Drop Image upload */}
         <div
            className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.querySelector('input[name="image"]').click()}
          >
            <input
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p >Drag & drop an image here, or click to select one</p>
          </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={handleChange}
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"} // Toggle password visibility
                name="password"
                placeholder="*********"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
                onChange={handleChange}
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {/* Display password strength */}
            {passwordStrength && (
              <p
                className={`text-sm mt-1 ${
                  passwordStrength === 'Strong'
                    ? 'text-green-500'
                    : passwordStrength === 'Moderate'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          {/* Confirm Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"} // Toggle confirm password visibility
                name="confirmPassword"
                placeholder="*********"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} // Toggle visibility
              >
                {confirmPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} {/* Display error */}
          </div>

          {/* Employee ID input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={handleChange}
            />
          </div>

          {/* Department dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
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

          {/* Date of Birth input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              placeholder="DOB"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={handleChange}
            />
          </div>

          {/* Gender dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Role dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

         
        </div>

        {/* Submit button */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
