import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext'; // Importing useToast hook to trigger toast notifications

export const columns = [
    {
        name: "No",
        selector: (row) => row.sno
    },
    {
        name: "Department Code",
        selector: (row) => row.dep_name,
        sortable: true
    },
    {
        name: "Department Description",
        selector: (row) => row.description,
    },
    {
        name: "Action",
        selector: (row) => row.action,
        width: "80px"
    },
]

export const DepartmentButtons = ({ Id, onDepartmentDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleEdit = () => {
        // Navigate to the edit page for the department
        navigate(`/admin-dashboard/department/${Id}`);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Do you want to delete this department?");
        if (confirm) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/department/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data.success) {
                    showToast(`Department delete successful!`, 'error'); // Triggering a success toast
                    onDepartmentDelete(); // Refresh the department list after deletion
                } else {
                    alert("Error deleting department.");
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        }
    };

    return (
        <div className="" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="text-gray-600 hover:text-gray-900 focus:outline-none relative inline-block text-left"
            >
                <FaEllipsisV size={20} />
            </button>

            {dropdownOpen && (
                <div
                    className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white border border-gray-300 z-50"
                >
                    <ul className="py-1">
                        <li
                            onClick={handleEdit}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-all duration-200 ease-in-out"
                        >
                            <FaEdit className="inline mr-2" />
                            Edit
                        </li>
                        <li
                            // Use an anonymous function to call handleDelete with Id
                            onClick={() => handleDelete(Id)}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 cursor-pointer transition-all duration-200 ease-in-out"
                        >
                            <FaTrash className="inline mr-2" />
                            Delete
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
