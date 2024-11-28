import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useToast } from '../context/ToastContext'; // Importing useToast hook to trigger toast notifications

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Using the login function from auth context to handle user login
  const navigate = useNavigate(); // Hook for navigation after successful login
  const { showToast } = useToast(); // Get the showToast function from the ToastContext to trigger toast notifications

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

    const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send login request to the backend API
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      if (response.data.success) {
        // On successful login, store the user and token
        login(response.data.user);
        localStorage.setItem('token', response.data.token);
        
        // Show a success toast
        showToast('Login successful!', 'success'); // Triggering a success toast

        // Redirect user to their respective dashboard based on their role
        if (response.data.user.role === 'admin') {
          navigate('/admin-dashboard'); // Navigate to admin dashboard
        } else {
          navigate('/employee-dashboard'); // Navigate to employee dashboard
        }
      }
    } catch (error) {
      // In case of an error (e.g., invalid credentials)
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error); // Set error state to show the error message
        showToast(error.response.data.error, 'error'); // Show error toast with the error message
      } else {
        setError('Server Error'); // Generic server error message
        showToast('Server Error!', 'error'); // Show a generic error toast
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 font-sans px-4">
      <h1 className="text-4xl font-extrabold text-white mb-6">Computer Tracker System</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

        {/* Display error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="********"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handlePasswordVisibility}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {passwordVisible ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-sky-600" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sky-600 hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 focus:ring-2 focus:ring-sky-400 focus:outline-none"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="text-sky-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
