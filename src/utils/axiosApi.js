import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../configs/config';

const axiosConfig = {
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const axiosApi = axios.create(axiosConfig);

