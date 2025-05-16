import axios from 'axios';

const BASE_URL = '/api/dashboard';

export const fetchDashboardData = async () => {
  return axios.get(BASE_URL);
};