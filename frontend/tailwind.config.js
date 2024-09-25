/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1E1E1E',
        },
        secondary: {
          dark: '#8C929C',
        },
        purple: {
          dark: "#783FE0"
        }
      },
    },
  },
  plugins: [],
}

