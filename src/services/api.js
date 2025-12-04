import axios from 'axios';

const API_BASE_URL = 'https://timelinebackend.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData)
};

// Target API
export const targetAPI = {
    getAll: () => api.get('/targets'),
    create: (data) => api.post('/targets', data),
    toggle: (id) => api.patch(`/targets/${id}/toggle`),
    delete: (id) => api.delete(`/targets/${id}`)
};

// Timetable API
export const timetableAPI = {
    getAll: () => api.get('/timetable'),
    getToday: () => api.get('/timetable/today'),
    getWeek: () => api.get('/timetable/week'),
    create: (data) => api.post('/timetable', data),
    update: (id, data) => api.put(`/timetable/${id}`, data),
    delete: (id) => api.delete(`/timetable/${id}`)
};

// Tracking API
export const trackingAPI = {
    mark: (data) => api.post('/tracking/mark', data),
    getDaily: (date) => api.get(`/tracking/daily/${date}`),
    getWeekly: (startDate) => api.get(`/tracking/weekly/${startDate}`),
    getMonthly: (year, month) => api.get(`/tracking/monthly/${year}/${month}`),
    getHistory: (timetableId) => api.get(`/tracking/history/${timetableId}`)
};

export default api;
