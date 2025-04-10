import axios from 'axios';

axios.defaults.withCredentials = true;

export const getCurrentUser = async () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await axios.get(`${apiBaseUrl}/auth/me`);
  return response.data;
};
