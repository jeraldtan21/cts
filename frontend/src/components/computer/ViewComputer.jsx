// ViewComputer.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { columnsHistory } from "../../utils/ComputerHelper";  // Import from ComputerHelper

const ViewComputer = () => {
  const { id } = useParams();
  const [computer, setComputer] = useState(null);
  const [computerHistory, setComputerHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [depLoading, setDepLoading] = useState(false);

  // Function to fetch computer data
  const fetchComputerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/computer/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success && response.data.computer) {
        setComputer(response.data.computer);
      } else {
        setError('No computer data found');
      }
    } catch (err) {
      setError(`Error fetching computer data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    console.log("Fetching activity history for computer ID:", id);
    setDepLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/computer/history/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      console.log("Fetched activity history response:", response.data);
  
      // Updated condition to check for 'computerHistory' instead of 'computers'
      if (response.data.success && Array.isArray(response.data.computerHistory)) {
        const data = response.data.computerHistory.map((history) => ({
          _id: history._id,
          createAt: history.createAt ? new Date(history.createAt).toLocaleDateString() : 'N/A', // Format date, fallback if missing
          remarks: history.remarks || 'No remarks', // Fallback if remarks are missing
          assignee: history.assignee.name|| 'Unassigned', // Handle missing assignee
        }));
        setComputerHistory(data);
      } else {
        setError('No activity history found');
      }
    } catch (err) {
      console.error("Error fetching activity history:", err);
      setError(`Error fetching activity history: ${err.message}`);
    } finally {
      setDepLoading(false);
    }
  };

  useEffect(() => {
    fetchComputerData();
    fetchHistory();
  }, [id]);

  return (
    <>
      {computer ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-4 md:p-8 rounded-md shadow-md">
          <h3 className="text-2xl font-bold mb-8 text-center">Computer Details</h3>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative w-40 h-40 md:w-72 md:h-72 mx-auto">
              <img
                className="rounded-lg border w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                src={`http://localhost:3000/${computer.comImage}`}
                alt="Computer Model"
              />
            </div>
            <div className="flex flex-col items-center md:items-start space-y-2">
              <p className="text-lg font-bold">Model: <span className="font-medium">{computer.comModel}</span></p>
              <p className="text-lg font-bold">Serial Number: <span className="font-medium">{computer.comSerial}</span></p>
              <p className="text-lg font-bold">Processor: <span className="font-medium">{computer.comCpu}</span></p>
              <p className="text-lg font-bold">RAM: <span className="font-medium">{computer.comRam}</span></p>
              <p className="text-lg font-bold">Storage: <span className="font-medium">{computer.comStorage}</span></p>
              <p className="text-lg font-bold">GPU: <span className="font-medium">{computer.comGpu}</span></p>
              <p className="text-lg font-bold">Operating System: <span className="font-medium">{computer.comOs}</span></p>
              <p className="text-lg font-bold">Unit Type: <span className="font-medium">{computer.comType}</span></p>
              <p className="text-lg font-bold">Assigned To: <span className="font-medium">{computer.cpuAccount?.userId?.name || 'Unassigned'}</span></p>
              <p className="text-lg font-bold">Status: 
                <span className="font-medium flex items-center space-x-2">
                  {computer.status === "working" ? (
                    <FaCheckCircle className="text-green-500" size={20} />
                  ) : (
                    <FaTimesCircle className="text-red-500" size={20} />
                  )}
                  <span>{computer.status || 'N/A'}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h4 className="text-xl font-bold mb-4">Activity Log</h4>
            {computerHistory.length > 0 ? (
              <div className="flex-auto overflow-y-auto">
                <DataTable
                  columns={columnsHistory}
                  data={computerHistory}
                  pagination
                  fixedHeader
                  fixedHeaderScrollHeight="calc(100vh - 250px)"
                  responsive
                  progressPending={depLoading}
                />
              </div>
            ) : (
              <p className="text-center text-gray-500">No activity log available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-10">
          {loading ? <p>Loading...</p> : <p>No computer data found.</p>}
        </div>
      )}
    </>
  );
};

export default ViewComputer;
