import React from 'react';
import { useAuth } from '../context/authContext.jsx';
import AdminSidebar from '../components/dashboard/admin-dashboard/AdminSidebar.jsx';
import Navbar from '../components/dashboard/admin-dashboard/Navbar.jsx';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  return (
    <div className="flex font-monfont">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 bg-gray-100 h-screen">
        <Navbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
