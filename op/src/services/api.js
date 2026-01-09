import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://ngo-t3ob.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.message);
    throw error;
  }
);

export const volunteerAPI = {
  // Create volunteer
  createVolunteer: async (formData) => {
    try {
      const response = await api.post('/volunteers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Create volunteer error:', error.message);
      throw error;
    }
  },

  // Get all volunteers
  getAllVolunteers: async () => {
    try {
      const response = await api.get('/volunteers');
      return response;
    } catch (error) {
      console.error('Get volunteers error:', error.message);
      throw error;
    }
  },

  // Get single volunteer
  getVolunteerById: async (id) => {
    try {
      const response = await api.get(`/volunteers/${id}`);
      return response;
    } catch (error) {
      console.error('Get volunteer error:', error.message);
      throw error;
    }
  },

  // Delete volunteer
  deleteVolunteer: async (id) => {
    try {
      const response = await api.delete(`/volunteers/${id}`);
      return response;
    } catch (error) {
      console.error('Delete volunteer error:', error.message);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('Health check error:', error.message);
      throw error;
    }
  },

  // Test API
  testAPI: async () => {
    try {
      const response = await api.get('/test');
      return response;
    } catch (error) {
      console.log('API test failed');
      return null;
    }
  }
};

export default api;