import axios from 'axios';
import 'dotenv/config';

export const mainAPI = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 3000,
});
