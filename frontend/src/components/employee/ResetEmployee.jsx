import React, { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext'; // Importing useToast hook to trigger toast notifications

const ResetEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const [setting, setSetting] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSetting({ ...setting, [name]: value });
        if (name === "newPassword") evaluatePasswordStrength(value);
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setSetting(prevState => ({ ...prevState, confirmPassword: value }));
        setPasswordError(value !== setting.newPassword ? 'Passwords do not match' : '');
    };

    const evaluatePasswordStrength = (password) => {
        let strength = "";
        if (password.length >= 8) {
            if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@$!%*?&#]/.test(password)) {
                strength = "Strong";
            } else if ((/[A-Z]/.test(password) || /[a-z]/.test(password)) && /\d/.test(password)) {
                strength = "Moderate";
            } else {
                strength = "Weak";
            }
        } else {
            strength = "Too Short";
        }
        setPasswordStrength(strength);
    };

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.success && response.data.employee) {
                    setEmployee(response.data.employee);
                } else {
                    setError('No employee data found');
                }
            } catch (err) {
                setError(`Error fetching employee data: ${err.message}`);
            }
        };

        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (setting.newPassword !== setting.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:3000/api/employee/change-password/${id}`,
                { password: setting.newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                console.log('Employee ID:', id);
                showToast('Password reset successful!', 'success'); // Triggering a success toast
                setError("");
                navigate('/admin-dashboard/employees');
            }
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {employee ? (
                <div className="mb-3 items-center">
                    <div className="flex items-center space-x-3 ">
                        <p className="text-lg font-semibold">Name:</p>
                        <p className="font-medium">{employee.userId?.name || 'N/A'}</p>
                    </div>
                    <img
                        className="rounded-full border w-100 object-cover cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                        src={`http://localhost:3000/${employee.userId.profileImage}`}
                        alt="Employee Profile"
                    />
                    
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading employee details...</p>
            )}
            <h3 className="text-2xl font-bold mb-6 text-center">Change Password</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="newPassword"
                            placeholder="*********"
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                            required
                            value={setting.newPassword}
                            onChange={handleChange}
                        />
                        <span
                            className="absolute right-2 top-2 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>
                    {passwordStrength && (
                        <p className={`text-sm mt-1 ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Moderate' ? 'text-yellow-500' : 'text-red-500'}`}>
                            Password Strength: {passwordStrength}
                        </p>
                    )}
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="*********"
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                            required
                            value={setting.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <span
                            className="absolute right-2 top-2 cursor-pointer"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        >
                            {confirmPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 rounded"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ResetEmployee;
