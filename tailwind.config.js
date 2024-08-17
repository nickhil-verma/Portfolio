/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundColor: {
        light: '#F3F1EC',  // Light theme background color
        dark: '#2B2F36',
        yellow: '#FFC727',
        lessdark: '#1C2028',   // Dark theme background color
      },
      textColor: {
        light: '#2B2F36',  // Dark text color for light theme
        dark: '#F3F1EC',
        yellow: '#FFC727',   // Light text color for dark theme
      }
    },
  },
  plugins: [],
}
