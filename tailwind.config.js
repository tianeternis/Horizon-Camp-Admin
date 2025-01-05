/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        main: ["Nunito", "sans-serif"],
      },
      colors: {
        "main-bg": "#fafafa",
        main: "#ffae5b",
      },
    },
  },
  plugins: [],
};
