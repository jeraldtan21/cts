import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component"; // Assuming you're using this library
import { columns, ComputerButtons } from "../../utils/ComputerHelper"; // Make sure fetchEmployees is properly imported

const ComputerList = () => {
  const [depLoading, setDepLoading] = useState(false);
  const [computers, setComputers] = useState([]);
  const [filteredComputers, setFilteredComputers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Initialize the status filter

  useEffect(() => {
    const fetchComputers = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/computer", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          const data = response.data.computers.map((com) => ({
            _id: com._id,
            comModel: com.comModel,
            comSerial: com.comSerial,
            comCpu: com.comCpu,
            comRam: com.comRam,
            comStorage: com.comStorage,
            comGpu: com.comGpu,
            comOs: com.comOs,
            comStatus: com.status, // Include the status for filtering
            cpuAccount: com.cpuAccount?._id ? com.cpuAccount.userId.name : "No Role",
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
            ),
            action: <ComputerButtons Id={com._id} />,
          }));

          setComputers(data);
          setFilteredComputers(data);
        }
      } catch (error) {
        console.error("Error fetching computers:", error.message);
      } finally {
        setDepLoading(false);
      }
    };

    fetchComputers();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchQuery(searchTerm);

    // Apply search filtering
    const filtered = computers.filter((com) =>
      com.comSerial?.toLowerCase().includes(searchTerm) ||
      com.comModel?.toLowerCase().includes(searchTerm) ||
      com.comCpu?.toLowerCase().includes(searchTerm)
    );
    setFilteredComputers(filtered);
  };

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    // Apply both search and status filtering
    const filtered = computers.filter((com) => {
      const matchesStatus = selectedStatus === "all" || com.comStatus === selectedStatus;
      const matchesSearch =
        com.comSerial?.toLowerCase().includes(searchQuery) ||
        com.comModel?.toLowerCase().includes(searchQuery) ||
        com.comCpu?.toLowerCase().includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
    setFilteredComputers(filtered);
  };

  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Computers</h3>
      </div>
      <div className="flex justify-between items-center px-5 my-4">
        <input
          type="text"
          placeholder="Search by Serial, Model, or CPU"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />

        {/* Status Filter Dropdown */}
        <select
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="all">All Status</option>
          <option value="working">Working</option>
          <option value="warranty">Warranty</option>
          <option value="repair">Repair</option>
          <option className="bg-red-500 text-white" value="defective">
            Defective
          </option>
        </select>
        <Link to="/admin-dashboard/add-new-computer" className="px-4 py-2 bg-sky-500 rounded text-white">
          Add New Computer
        </Link>
      </div>
      <div className="flex-auto overflow-y-auto">
        <DataTable
          columns={columns}
          data={filteredComputers}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="calc(100vh - 250px)"
          responsive
          progressPending={depLoading}
        />
      </div>
    </div>
  );
};

export default ComputerList;