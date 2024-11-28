import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Setting = () => {
    const [passwordError, setPasswordError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();
    const [setting, setSetting] = useState({
        userId: user._id,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSetting({ ...setting, [name]: value });
        if (name === "newPassword") evaluatePasswordStrength(value);
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setSetting({ ...setting, confirmPassword: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (setting.newPassword !== setting.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:3000/api/setting/change-password",
                setting,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                setError("");
                navigate('/employee-dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        }
    };

    const evaluatePasswordStrength = (password) => {
        let strength = "";
        if (password.length >= 8) {
            if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@$!%*?&#]/.test(password)) {
                strength = "Strong";
            } else if ((/[A-Z]/.test(password) || /[a-z]/.test(password)) && /\d/.test(password) && password.length >= 6) {
                strength = "Moderate";
            } else {
                strength = "Weak";
            }
        } else {
            strength = "Too Short";
        }
        setPasswordStrength(strength);
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
            <h3 className="text-2xl font-bold mb-6">Change Password</h3>
            <p className="text-red-500">{error}</p>
            <form onSubmit={handleSubmit}>
                {/* Old Password Input */}
                <div>
                    <label className="text-sm font-medium text-gray-700">Old Password</label>
                    <div className="relative">
                        <input
                            type={oldPasswordVisible ? "text" : "password"}
                            name="oldPassword"
                            placeholder="*********"
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                            required
                            onChange={handleChange}
                        />
                        <span
                            className="absolute right-2 top-2 cursor-pointer"
                            onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                        >
                            {oldPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>
                </div>

                {/* New Password Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="newPassword"
                            placeholder="*********"
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                            required
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

                {/* Confirm Password Input */}
                <div>
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

export default Setting;
