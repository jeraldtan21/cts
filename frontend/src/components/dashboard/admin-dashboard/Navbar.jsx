import React from 'react'
import { useAuth } from '../../../context/authContext'

const Navbar = () => {
  const { user} = useAuth()
  return (
    <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-12 bg-sky-500 px-5 py-3 text-white">
      {/* Welcome Message */}
      <p className="text-center md:text-left text-sm md:text-base mb-2 md:mb-0">
        Welcome, {user.name}
      </p>
     
    </div>
  )
}

export default Navbar
