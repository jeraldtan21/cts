// Toast.js
import React, { useEffect, useState } from 'react';
import { useToast } from './ToastContext';

const Toast = () => {
  const { toast, toastType } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Hide toast after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-5 right-5 py-2 px-4 rounded-md shadow transition-all duration-500 ${
        toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white transform ${
        isVisible ? 'animate-enter-toast' : 'animate-leave-toast'
      }`}
    >
      {toast}
    </div>
  );
};

export default Toast;
