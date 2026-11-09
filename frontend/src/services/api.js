import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { token } = response.data;

        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API service methods
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

export const users = {
  getMe: () => api.get('/users/me'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePreferences: (data) => api.put('/users/preferences', data),
  changePassword: (data) => api.put('/users/change-password', data),
  deleteAccount: () => api.delete('/users/account'),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
  getHealthSummary: () => api.get('/users/health-summary'),
};

export const doctors = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getProfile: () => api.get('/doctors/profile'),
  updateProfile: (data) => api.put('/doctors/profile', data),
  getPatients: () => api.get('/doctors/patients'),
  getPatientDetails: (id) => api.get(`/doctors/patients/${id}`),
  getAppointments: (params) => api.get('/doctors/appointments', { params }),
  updateAppointment: (id, data) => api.put(`/doctors/appointments/${id}`, data),
  getStats: () => api.get('/doctors/stats'),
};

export const appointments = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  book: (data) => api.post('/appointments', data),
  cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  reschedule: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
  getAvailableSlots: (doctorId, date) => api.get(`/appointments/available-slots/${doctorId}`, { params: { date } }),
};

export const medications = {
  getAll: (params) => api.get('/medications', { params }),
  getById: (id) => api.get(`/medications/${id}`),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put(`/medications/${id}`, data),
  delete: (id) => api.delete(`/medications/${id}`),
  markAsTaken: (id, data) => api.post(`/medications/${id}/take`, data),
  getAdherence: () => api.get('/medications/adherence'),
};

export const reports = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  upload: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'file') {
        formData.append('file', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/reports/${id}`),
  share: (id, data) => api.post(`/reports/${id}/share`, data),
  review: (id, data) => api.put(`/reports/${id}/review`, data),
};

export const healthLogs = {
  getAll: (params) => api.get('/health-logs', { params }),
  getById: (id) => api.get(`/health-logs/${id}`),
  create: (data) => api.post('/health-logs', data),
  update: (id, data) => api.put(`/health-logs/${id}`, data),
  delete: (id) => api.delete(`/health-logs/${id}`),
  getTrends: (params) => api.get('/health-logs/trends', { params }),
};

export const notifications = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.put(`/notifications/${id}`, { read: true }),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export const admin = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getDoctors: (params) => api.get('/admin/doctors', { params }),
  getAppointments: (params) => api.get('/admin/appointments', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

export default api;