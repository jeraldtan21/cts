import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import {
  FaBars,
  FaBuilding,
  FaDesktop,
  FaTachometerAlt,
  FaTools,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {logout } = useAuth()

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-sky-500 text-white rounded focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-sky-500 text-white transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-64`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-center border-b border-sky-400">
          <h3 className="text-center text-lg font-bold">
            Computer Tracker System
          </h3>
        </div>

        {/* Sidebar Links */}
        <div className="px-4 mt-4 space-y-2">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${isActive ? 'bg-sky-600' : ''} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-sky-600 transition`
            }
            end
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/computers"
            className={({ isActive }) =>
              `${isActive ? 'bg-sky-600' : ''} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-sky-600 transition`
            }
          >
            <FaDesktop />
            <span>Computer</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/employees"
            className={({ isActive }) =>
              `${isActive ? 'bg-sky-600' : ''} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-sky-600 transition`
            }
          >
            <FaUser />
            <span>Employee</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/departments"
            className={({ isActive }) =>
              `${isActive ? 'bg-sky-600' : ''} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-sky-600 transition`
            }
          >
            <FaBuilding />
            <span>Department</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/settings"
            className={({ isActive }) =>
              `${isActive ? 'bg-sky-600' : ''} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-sky-600 transition`
            }
          >
            <FaTools />
            <span>Settings</span>
          </NavLink>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={logout}
            className="flex items-center space-x-4 w-full py-2.5 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;
