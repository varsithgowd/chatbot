import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for attaching auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supportsense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('supportsense_token');
        localStorage.removeItem('supportsense_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public APIs
export const getHealth = () => api.get('/health').then(r => r.data);
export const getArticles = (params) => api.get('/articles', { params }).then(r => r.data);
export const getArticle = (id) => api.get(`/articles/${id}`).then(r => r.data);
export const searchArticles = (params) => api.get('/search', { params }).then(r => r.data);
export const sendChatMessage = (data) => api.post('/chat', data).then(r => r.data);
export const submitFeedback = (data) => api.post('/feedback', data).then(r => r.data);

// Admin Auth APIs
export const adminLogin = (data) => api.post('/admin/login', data).then(r => r.data);
export const getAdminMe = () => api.get('/admin/me').then(r => r.data);

// Admin Management APIs
export const getAdminDashboard = () => api.get('/admin/dashboard').then(r => r.data);
export const getAdminArticles = (params) => api.get('/admin/articles', { params }).then(r => r.data);
export const getAdminArticle = (id) => api.get(`/admin/articles/${id}`).then(r => r.data);
export const createAdminArticle = (data) => api.post('/admin/articles', data).then(r => r.data);
export const updateAdminArticle = (id, data) => api.patch(`/admin/articles/${id}`, data).then(r => r.data);
export const publishAdminArticle = (id) => api.patch(`/admin/articles/${id}/publish`).then(r => r.data);
export const archiveAdminArticle = (id) => api.patch(`/admin/articles/${id}/archive`).then(r => r.data);

// Admin Queues APIs
export const getAdminQuestions = (params) => api.get('/admin/questions', { params }).then(r => r.data);
export const getAdminUnanswered = (params) => api.get('/admin/unanswered', { params }).then(r => r.data);
export const getAdminFeedback = (params) => api.get('/admin/feedback', { params }).then(r => r.data);

export default api;

