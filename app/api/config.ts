import axios from 'axios';

export const mainAPI = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 3000,
});
