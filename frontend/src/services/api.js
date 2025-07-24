import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Notes API functions
export const notesAPI = {
  /**
   * Get all notes
   * @returns {Promise} Array of notes
   */
  getAllNotes: async () => {
    try {
      const response = await api.get('/notes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notes');
    }
  },

  /**
   * Get note by ID
   * @param {string} noteId - Note ID
   * @returns {Promise} Note object
   */
  getNoteById: async (noteId) => {
    try {
      const response = await api.get(`/notes/${noteId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch note');
    }
  },

  /**
   * Create a new note
   * @param {Object} noteData - Note data {title, content}
   * @returns {Promise} Created note object
   */
  createNote: async (noteData) => {
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create note');
    }
  },

  /**
   * Update note by ID
   * @param {string} noteId - Note ID
   * @param {Object} updateData - Update data {title?, content?}
   * @returns {Promise} Updated note object
   */
  updateNote: async (noteId, updateData) => {
    try {
      const response = await api.put(`/notes/${noteId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update note');
    }
  },

  /**
   * Health check
   * @returns {Promise} Health status
   */
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is not responding');
    }
  },
};

export default api;
