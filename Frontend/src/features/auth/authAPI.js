import axios from 'axios';

const API_URL = '/api/auth';

export const registerAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginAPI = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const sendOtpAPI = async (email) => {
  const response = await axios.post(`${API_URL}/email-verification`, { email });
  return response.data;
};

export const forgotPasswordAPI = async (userEmail) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { userEmail });
  return response.data;
};

export const verifyResetOtpAPI = async (otp) => {
  const response = await axios.post(`${API_URL}/verify-reset-otp`, { otp });
  return response.data;
};

export const resetPasswordAPI = async (email, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, { email, newPassword });
  return response.data;
};
