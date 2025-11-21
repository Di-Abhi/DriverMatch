import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export function setAuthToken(token: string) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken() {
  delete apiClient.defaults.headers.common['Authorization'];
}

export function getClient() {
  return apiClient;
}

export default {
  setAuthToken,
  clearAuthToken,
  getClient,
};