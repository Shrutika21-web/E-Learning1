import api from './axios';

// POST /auth/login -> { success, message, token, user: { userId, email, role } }
export function login(email, password) {
  return api.post('/auth/login', { email, password }).then((res) => res.data);
}

export function register({ fullName, email, password, confirmPassword }) {
  return api.post('/auth/register', { fullName, email, password, confirmPassword }).then((res) => res.data);
}
