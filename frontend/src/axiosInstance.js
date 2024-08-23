import axios from "axios";

const { token } = JSON.parse(localStorage.getItem("userInfo"));
const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default instance;
