import React, { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard.jsx';
import {
  FaBuilding,
  FaCheckCircle,
  FaDesktop,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUser,
} from 'react-icons/fa';
import axios from 'axios';

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSummary(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) {
    return <div className="text-center text-lg font-semibold mt-6">Loading...</div>;
  }

  return (
    <div className="px-6 py-10 bg-gradient-to-r">
      <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Dashboard Overview</h3>

      {/* Dashboard Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <SummaryCard
          icon={<FaUser />}
          text="Total Employees"
          number={summary.totalEmployees || 0}
          color="bg-gradient-to-r from-blue-400 to-blue-600"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartments || 0}
          color="bg-gradient-to-r from-green-400 to-green-600"
        />
        <SummaryCard
          icon={<FaDesktop />}
          text="Total Computers"
          number={summary.totalComputer || 0}
          color="bg-gradient-to-r from-yellow-400 to-yellow-600"
        />
      </div>

      {/* Computer Details Section */}
      <div className="mt-12">
        <h4 className="text-center text-2xl font-semibold text-gray-800">Computer Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Computers Working"
            number={summary.workingComputers || 0}
            color="bg-gradient-to-r from-green-400 to-green-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Defective Computers"
            number={summary.defectiveComputers || 0}
            color="bg-gradient-to-r from-red-400 to-red-600"
          />
          <SummaryCard
            icon={<FaFileAlt />}
            text="Computers Under Warranty"
            number={summary.warrantyComputers || 0}
            color="bg-gradient-to-r from-gray-400 to-gray-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Computers Under Repair"
            number={summary.repairComputers || 0}
            color="bg-gradient-to-r from-orange-400 to-orange-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
