/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E91E63',
        secondary: '#FF6B35',
        accent: '#FFA500',
      }
    },
  },
  plugins: [],
}
