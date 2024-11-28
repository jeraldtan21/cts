import React, { useState } from 'react'

const Setting = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  const handleLanguageChange = (event) => setSelectedLanguage(event.target.value)

  return (
    <div className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}>
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Language Selector */}
        <div className="mb-6">
          <label className="block mb-2 text-lg">Language</label>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="border px-4 py-2 rounded-lg w-full"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Dark Mode Toggle */}
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <span className="ml-2">Enable Dark Mode</span>
          </label>
        </div>

        {/* Other settings can be added here */}
      </div>
    </div>
  )
}

export default Setting
