const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const api = {
  login: `${API_BASE_URL}/api/v1/user/login`,
  register: `${API_BASE_URL}/api/v1/user/register`,
  verifyOtp: `${API_BASE_URL}/api/v1/user/otp-verification`,
  logout: `${API_BASE_URL}/api/v1/user/logout`,
  getUser: `${API_BASE_URL}/api/v1/user/me`,
  forgotPassword: `${API_BASE_URL}/api/v1/user/password/forget`,
  resetPassword: (token) => `${API_BASE_URL}/api/v1/user/password/reset/${token}`
};
