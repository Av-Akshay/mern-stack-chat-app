/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "form-shadow": "5px 5px 10px gray",
      },
      borderRadius: {
        sendMessage: "10px 10px 0px 10px",
        receiveMessage: "10px 10px 10px 0px",
      },
    },
  },
  plugins: [],
};
