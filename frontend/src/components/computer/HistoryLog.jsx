import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications

const HistoryLog = () => {
  const [assignee, setAssignee] = useState(""); // Initialize assignee as an empty string
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [computer, setComputer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Get user from context
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate hook
  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications

  // Ensure assignee is pre-filled if available
  useEffect(() => {
    if (user?.name) {
      setAssignee(user.name); // Set assignee with user's name on component load
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields: assignee and remarks
    if (!assignee.trim() || !remarks.trim()) {
      setError("Assignee and Remarks are required.");
      return;
    }

    setError(""); // Clear any existing error

    // Prepare the data for the API call
    const historyData = {
      comId: id,  // Computer ID
      remarks: remarks, // Remarks
      assignee: user._id, // Assignee (user's ID from context)
    };

    try {
      // Send POST request to add history log
      const response = await axios.post(
        'http://localhost:3000/api/computer/history/add-history', // Adjust the URL accordingly
        historyData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentication token
          },
        }
      );

      console.log("API Response:", response.data); // Debugging the response

      if (response.data.success) {
        showToast('Computer added successfully!', 'success'); // Triggering a success toast
        navigate(`/admin-dashboard/computer/${id}`); // Navigate on successful submission
      } else {
        setError(response.data.message); // Display error message from response
      }
    } catch (err) {
      setError(`Error submitting activity log: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchComputer = async () => {
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

    fetchComputer();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h3 className="text-2xl font-bold mb-6">Add Activity Log</h3>

      {loading && <p>Loading...</p>}

      {/* Display error message if there is an error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && computer && (
        <form onSubmit={handleSubmit}>
          <p className="text-lg font-bold">
            Model: <span className="font-medium">{computer?.comModel}</span>
          </p>
          <p className="text-lg font-bold">
            Serial Number: <span className="font-medium">{computer?.comSerial}</span>
          </p>

          <div className="mt-4">
            <label htmlFor="remarks" className="text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              placeholder="Enter Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="assignee" className="text-sm font-medium text-gray-700">
              Assignee
            </label>
            <input
              disabled={true} // disable text input (since you want to pre-fill)
              id="assignee"
              name="assignee"
              type="text"
              placeholder="Enter Assignee Name"
              defaultValue={assignee || ""}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full mt-6 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 rounded"
          >
            Add Activity Log
          </button>
        </form>
      )}
    </div>
  );
};

export default HistoryLog;
