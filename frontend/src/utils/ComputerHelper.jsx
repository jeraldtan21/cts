import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaEye, FaHistory } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";


export const columns = [
  { name: "Image", selector: (row) => row.comImage, width: "80px" },
  { name: "Computer Brand/Model", selector: (row) => row.comModel, sortable: true },
  { name: "Serial Number", selector: (row) => row.comSerial, width: "120px" },
  { name: "Processor", selector: (row) => row.comCpu  },
  { name: "RAM", selector: (row) => row.comRam },
  { name: "Storage", selector: (row) => row.comStorage},
  { name: "GPU", selector: (row) => row.comGpu, width: "120px" },
  { name: "Operating System", selector: (row) => row.comOs, width: "120px" },
  { name: "Assigned To", selector: (row) => row.cpuAccount, sortable: true, width: "200px" }, // cpuAccount field for employee
  { name: "Action", selector: (row) => row.action, width: "180px" },
];


// ComputerHelper.js

export const columnsHistory = [
  { 
    name: "Date", 
    sortable: true,
    selector: (row) => row.createAt, 
  },
  { 
    name: "Remarks", 
    selector: (row) => row.remarks, 
  },
  { 
    name: "Assignee", 
    selector: (row) => row.assignee, 
  },
];

export const Accountcolumns = [
  { name: "Image", selector: (row) => row.comImage, width: "80px" },
  { name: "Computer Brand/Model", selector: (row) => row.comModel, sortable: true },
  { name: "Serial Number", selector: (row) => row.comSerial, width: "150px" },
  { name: "Processor", selector: (row) => row.comCpu  },
  { name: "RAM", selector: (row) => row.comRam },
  { name: "Storage", selector: (row) => row.comStorage},
  { name: "GPU", selector: (row) => row.comGpu, width: "120px" },
  { name: "Operating System", selector: (row) => row.comOs, width: "120px" },

];

  
// Fetch employees for add accoutability in computer add
export const fetchEmployees = async () => {
  try {
    console.log("Fetching employee data...");
    const response = await axios.get("http://localhost:3000/api/employee/active/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success && Array.isArray(response.data.employees)) {
      return response.data.employees; // Return the list of employees
    } else {
      console.error("No employees found");
      return [];
    }
  } catch (err) {
    console.error(`Error fetching employee data: ${err.message}`);
    return [];
  }
};

// Buttons for actions
export const ComputerButtons = ({ Id }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-600 hover:text-gray-900 focus:outline-none relative"
      >
        <FaEllipsisV size={20} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0mt-2 w-36 rounded-md shadow-lg bg-white border border-gray-300 z-50 ">
          <ul className="py-1">
            <li
              onClick={() => navigate(`/admin-dashboard/computer/${Id}`)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 cursor-pointer"
            >
              <FaEye className="inline mr-2" />
              View
            </li>
            <li
              onClick={() => navigate(`/admin-dashboard/computer/edit/${Id}`)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600 cursor-pointer"
            >
              <FaEdit className="inline mr-2" />
              Edit
            </li>
            <li
              onClick={() => navigate(`/admin-dashboard/computer/history/${Id}`)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer"
            >
              <FaHistory className="inline mr-2" />
              Activity Log
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
