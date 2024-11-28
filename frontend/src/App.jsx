import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes"; // Restricts routes based on user authentication
import RoleBaseRoutes from "./utils/RoleBaseRoutes"; // Restricts routes based on user roles
import AdminSummary from "./components/dashboard/admin-dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import EmployeeList from "./components/employee/EmployeeList";
import AddEmployee from "./components/employee/AddEmployee";
import ViewEmployee from "./components/employee/ViewEmployee";
import EditEmployee from "./components/employee/EditEmployee";
import Summary from "./components/dashboard/employee-dashboard/Summary";
import Setting from "./components/dashboard/employee-dashboard/Setting";
import ResetEmployee from "./components/employee/ResetEmployee";
import ComputerList from "./components/computer/ComputerList";
import AddComputer from "./components/computer/AddComputer";
import ViewComputer from "./components/computer/ViewComputer"
import EditComputer from "./components/computer/EditComputer"
import HistoryLog from "./components/computer/HistoryLog"
import AdminSetting from "./components/dashboard/admin-dashboard/Setting"
import ProfileEmployee from "./components/employee/ProfileEmployee"



import { ToastProvider } from './context/ToastContext'; // Import the ToastProvider
import Toast from './context/Toast'; // Import Toast component

function App() {
  return (
    <ToastProvider>  {/* Wrap the entire app with ToastProvider */}
      <BrowserRouter>
        <Routes>
          {/* Redirects root path to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin-dashboard" />} />
          
          {/* Login page route */}
          <Route path="/login" element={<Login />} />

          {/* Admin dashboard route, protected by authentication and role-based access */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoutes> {/* Ensures user is authenticated */}
                <RoleBaseRoutes requiredRole={["admin"]}> {/* Ensures user has 'admin' role */}
                  <AdminDashboard />
                </RoleBaseRoutes>
              </PrivateRoutes>
            }
          >
            {/* Nested routes within the admin dashboard */}
            <Route index element={<AdminSummary />} />
            <Route path="/admin-dashboard/employees" element={<EmployeeList />} />
            <Route path="/admin-dashboard/add-new-employee" element={<AddEmployee />} />
            <Route path="/admin-dashboard/employee/:id" element={<ViewEmployee />} />
            <Route path="/admin-dashboard/employee/edit/:id" element={<EditEmployee />} />
            <Route path="/admin-dashboard/resetpassword/:id" element={<ResetEmployee />} />

            <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
            <Route path="/admin-dashboard/add-new-department" element={<AddDepartment />} />
            <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />

            <Route path="/admin-dashboard/computers" element={<ComputerList />} />
            <Route path="/admin-dashboard/add-new-computer" element={<AddComputer />} />
            <Route path="/admin-dashboard/computer/:id" element={<ViewComputer />} />
            <Route path="/admin-dashboard/computer/edit/:id" element={<EditComputer />} />
            <Route path="/admin-dashboard/computer/history/:id" element={<HistoryLog />} />
            <Route path="/admin-dashboard/settings" element={<AdminSetting />} />
          </Route>

          {/* Employee dashboard route */}
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoutes> {/* Ensures user is authenticated */}
                <RoleBaseRoutes requiredRole={["employee"]}> {/* Ensures user has 'employee' role */}
                  <EmployeeDashboard />
                </RoleBaseRoutes>
              </PrivateRoutes>
            }
          >
            <Route index element={<Summary />} />
            <Route path="/employee-dashboard/profile/:id" element={<ProfileEmployee />} />
            <Route path="/employee-dashboard/setting" element={<Setting />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toast /> {/* Include Toast component to display toast messages */}
    </ToastProvider>  
  );
}

export default App;
