/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "form-shadow": "5px 5px 10px gray",
      },
    },
  },
  plugins: [],
};
