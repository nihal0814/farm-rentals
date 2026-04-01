import axios from 'axios';

// Create a configured Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Point this to your backend URL
});

// Intercept requests to include the JWT token if the user is logged in
API.interceptors.request.use(
  (config) => {
    // Look for the user data saved in the browser's local storage
    const userProfile = localStorage.getItem('userInfo');
    
    if (userProfile) {
      const { token } = JSON.parse(userProfile);
      // If a token exists, attach it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;