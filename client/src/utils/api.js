import axios from 'axios';

// Get API URL from environment variable or use default
let API_URL = process.env.REACT_APP_API_URL;

// If not set or empty, use default
if (!API_URL || API_URL.trim() === '') {
  // Try to detect server port, default to 3000 but fallback to 5000
  API_URL = 'http://localhost:3000/api';
} else {
  // Clean up the URL
  API_URL = API_URL.trim();
  
  // Fix common issues
  if (API_URL.startsWith(':')) {
    // If it starts with :, add localhost
    API_URL = `http://localhost${API_URL}`;
  } else if (!API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
    // If no protocol, add http://
    if (API_URL.startsWith('//')) {
      API_URL = `http:${API_URL}`;
    } else {
      API_URL = `http://${API_URL}`;
    }
  }
  
  // Ensure it ends with /api
  if (!API_URL.endsWith('/api')) {
    API_URL = API_URL.replace(/\/?$/, '') + '/api';
  }
}

// Debug log to help troubleshoot
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL configured as:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    // Check sessionStorage first for admin tokens, then localStorage as fallback
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If sending FormData, remove Content-Type header so axios can set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if:
    // 1. It's a 401 error (unauthorized)
    // 2. User is on an admin page (to avoid redirect loops on public pages)
    // 3. Not already on the login page
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAdminPage = currentPath.startsWith('/admin');
      const isLoginPage = currentPath === '/admin/login';
      
      // Only redirect if on admin page and not already on login page
      if (isAdminPage && !isLoginPage) {
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      } else {
        // For public pages, just clear the token silently
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to construct full image URL from relative path
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/placeholder.jpg';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a static image path, return as is
  if (imagePath.startsWith('/images')) {
    return imagePath;
  }
  
  // If it's an uploaded image (/uploads), construct full URL
  if (imagePath.startsWith('/uploads')) {
    const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
    const serverBaseUrl = apiBaseUrl.replace('/api', '');
    return `${serverBaseUrl}${imagePath}`;
  }
  
  // For any other relative path, also construct full URL
  const apiBaseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
  const serverBaseUrl = apiBaseUrl.replace('/api', '');
  return `${serverBaseUrl}${imagePath}`;
};

export default api;

