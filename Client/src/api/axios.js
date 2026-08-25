import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const onLoginPage = window.location.pathname === '/login';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!onLoginPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * The backend always replies with { success, message, errors? }.
 * This pulls a clean, user-facing message out of any Axios error,
 * whether it's a validation failure, an AppError, or a network error.
 */
export function extractErrorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message === 'Network Error') return 'Could not reach the server. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

/**
 * Validation failures (HTTP 400) return errors: [{ field, message }].
 * This turns that into a { field: message } map for inline form errors.
 */
export function extractFieldErrors(err) {
  const list = err.response?.data?.errors;
  if (!Array.isArray(list)) return {};
  const map = {};
  for (const item of list) {
    if (item.field && item.message && !map[item.field]) map[item.field] = item.message;
  }
  return map;
}

export default api;
