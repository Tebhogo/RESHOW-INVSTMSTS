/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'reshow-red': '#ED1C24',
        'reshow-dark-red': '#8C1515',
        'reshow-dark': '#1A1A1A',
        'reshow-white': '#FFFFFF',
      },
      fontFamily: {
        'dinbek': ['Inter', 'sans-serif'], // Using Inter as closest to DINbek
        'dosis': ['Poppins', 'sans-serif'], // Using Poppins as closest to Dosis
      },
    },
  },
  plugins: [],
}
