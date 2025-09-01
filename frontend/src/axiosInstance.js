import axios from "axios";
import store from "./store/store";

// Create an Axios instance with default configuration
const instance = axios.create({
  baseURL: "https://talk-a-tive-1zgp.onrender.com/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  // Add longer timeout for slower connections
  timeout: 10000,
});

// Request interceptor - runs before each request
instance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    
    // Add auth token from Redux store if available
    const state = store.getState();
    const user = state.chatStore?.user;
    
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log("Added auth token to request");
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
instance.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error.message);
    console.log("Response error status:", error.response?.status);
    console.log("Response error data:", error.response?.data);
    
    // Handle auth errors
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access detected");
      // Optionally clear storage or redirect
    }
    
    return Promise.reject(error);
  }
);

export default instance;
