import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => API.post('/register', userData),
  login: (credentials) => API.post('/login', credentials),
  getProfile: () => API.get('/profile'),
  updateProfile: (userData) => API.put('/profile', userData),
};

export const tasksAPI = {
  getTasks: (params) => API.get('/tasks', { params }),
  getTaskById: (id) => API.get(`/tasks/${id}`),
  createTask: (taskData) => API.post('/tasks', taskData),
  updateTask: (id, taskData) => API.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  markComplete: (id) => API.patch(`/tasks/${id}/complete`),
};

export default API;
