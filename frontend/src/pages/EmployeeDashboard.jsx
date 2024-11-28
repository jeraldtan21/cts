import React from 'react'
import { useAuth } from '../context/authContext.jsx'
import EmployeeSidebar from '../components/dashboard/employee-dashboard/EmployeeSidebar.jsx'
import Navbar from '../components/dashboard/employee-dashboard/Navbar.jsx'
import Summary from '../components/dashboard/employee-dashboard/Summary.jsx'
import { Outlet } from 'react-router-dom'


const EmployeeDashboard = () => {
    const {user, loading} = useAuth()

  return (
    <div className='flex font-monfont'>
      <EmployeeSidebar/>
      <div className="flex-1 md:ml-64 bg-gray-100 h-screen">
        <Navbar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default EmployeeDashboard