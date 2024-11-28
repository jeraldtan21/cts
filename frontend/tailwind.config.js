// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Make sure to include your JSX/TSX files
  ],
  theme: {
    extend: {
      fontFamily: {
        "monfont" : ["Montserrat", 'sans-serif']
       },
      animation: {
        'enter-toast': 'enterToast 0.5s ease-out',  // Animation for toast entering
        'leave-toast': 'leaveToast 0.5s ease-in',   // Animation for toast leaving
      },
      keyframes: {
        enterToast: {
          '0%': { opacity: '0', transform: 'translateX(20px)' }, // Start off-screen to the right
          '100%': { opacity: '1', transform: 'translateX(0)' },  // End in the original position
        },
        leaveToast: {
          '0%': { opacity: '1', transform: 'translateX(0)' },    // Start visible
          '100%': { opacity: '0', transform: 'translateX(20px)' }, // End off-screen to the right
        },
      },
    },
  },
  plugins: [],
};
