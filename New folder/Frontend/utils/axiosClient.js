import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000', // Use Vite env variables
  withCredentials: true, // ✅ CRITICAL: This ensures cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here
    return Promise.reject(error);
  }
);

export default axiosClient;