// ToastContext.js
import React, { createContext, useContext, useState } from 'react';

// Create Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  const showToast = (message, type = 'success') => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 5000);  // Hide toast after 5 seconds
  };

  return (
    <ToastContext.Provider value={{ toast, toastType, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom Hook to use Toast Context
export const useToast = () => {
  return useContext(ToastContext);
};
