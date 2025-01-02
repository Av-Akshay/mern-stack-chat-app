import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    // Modify request config before sending, like adding auth token
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Example token

    if (userInfo) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (optional)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, like redirecting to login
      // e.g., logoutUser();
    }
    return Promise.reject(error);
  }
);

export default instance;
