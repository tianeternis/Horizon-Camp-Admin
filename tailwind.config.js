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
        main: "#ff8c16",
      },
      fontSize: {
        "10px": ["0.625rem", "0.625rem"],
        "11px": ["0.6875rem", "0.875rem"],
        "13px": ["0.8125rem", "1.125rem"],
        "15px": ["0.9375rem", "1.375rem"],
      },
      width: {
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
        "10/10": "100%",
      },
    },
  },
  plugins: [],
};
