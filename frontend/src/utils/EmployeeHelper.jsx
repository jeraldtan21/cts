import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaEye, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";

export const columns = [
  { name: "Employee ID", selector: (row) => row.employeeId, width: "120px" },
  { name: "Image", selector: (row) => row.profileImage, width: "80px" },
  { name: "Name", selector: (row) => row.name, sortable: true },
  { name: "Birth Day", selector: (row) => row.dob, width: "120px" },
  { name: "Department", selector: (row) => row.dep_name, sortable: true },
  { name: "Gender", selector: (row) => row.gender, sortable: true, width: "120px" },
  { name: "Role", selector: (row) => row.role, sortable: true, width: "180px" },
    // Column for the employee's status, displaying an icon with conditional styling
  {
    name: "Status",
    selector: (row) => (
      <span
        className="flex items-center space-x-2"
      >
        {row.status === "active" ? (
          <FaCheckCircle className="text-green-500" size={15} />
        ) : (
          <FaTimesCircle className="text-red-500" size={15} />
        )}
      </span>
    ),
    width: "200px",
  },
  { name: "Action", selector: (row) => row.action, width: "80px" },
];


export const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.success ? response.data.departments : [];
  } catch (error) {
    alert(error.message);
    return [];
  }
};

export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleEdit = () => navigate(`/admin-dashboard/employee/edit/${Id}`);
  const handleView = () => navigate(`/admin-dashboard/employee/${Id}`);
  const handleReset = () => navigate(`/admin-dashboard/resetpassword/${Id}`);

  return (
    <div className="" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-600 hover:text-gray-900 focus:outline-none relative inline-block text-left"
      >
        <FaEllipsisV size={20} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white border border-gray-300 z-50">
          <ul className="py-1">
                  {/*View*/}
            <li
              onClick={handleView}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 cursor-pointer transition-all duration-200 ease-in-out"
            >
              <FaEye className="inline mr-2" />
              View
            </li>
                 {/*Edit*/}
            <li
              onClick={handleEdit}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-all duration-200 ease-in-out"
            >
              <FaEdit className="inline mr-2" />
              Edit
            </li>

                  {/*Edit*/}
                  <li
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer transition-all duration-200 ease-in-out"
            >
              <FaLock className="inline mr-2" />
              Reset
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
