import axios from 'axios';

export const fetchDashboardAPI = async () => {
  const response = await axios.get('/api/dashboard');
  return response.data;
};
