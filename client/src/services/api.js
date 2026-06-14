import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const urlService = {
  // Create a new short URL
  createShortUrl: async (originalUrl) => {
    try {
      const response = await api.post('/urls', { originalUrl });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create short URL' };
    }
  },

  // Get all URLs with pagination
  getAllUrls: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/urls?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch URLs' };
    }
  },

  // Get URL details by short code
  getUrlByShortCode: async (shortCode) => {
    try {
      const response = await api.get(`/urls/${shortCode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'URL not found' };
    }
  },

  // Get URL statistics
  getUrlStats: async (shortCode) => {
    try {
      const response = await api.get(`/urls/${shortCode}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch URL stats' };
    }
  },

  // Delete URL by short code
  deleteUrl: async (shortCode) => {
    try {
      const response = await api.delete(`/urls/${shortCode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete URL' };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Health check failed' };
    }
  }
};

export default api;
