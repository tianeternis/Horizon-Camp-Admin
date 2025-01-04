/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        main: ["Roboto", "sans-serif"],
      },
      colors: {
        "main-bg": "#fafafa4d",
      },
    },
  },
  plugins: [],
};
