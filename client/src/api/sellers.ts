import axios from 'axios';
import { Seller } from '../types';
import { API_PATHS } from '../config';


const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const sellersAPI = {
  
  async getAll() {
    try {
      const response = await api.get<Seller[]>(API_PATHS.SELLERS.BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },

  
  async getById(id: number) {
    try {
      const response = await api.get<Seller>(API_PATHS.SELLERS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching seller with id ${id}:`, error);
      throw error;
    }
  },

  
  async getCurrent(token: string) {
    try {
      const response = await api.get<Seller>(API_PATHS.SELLERS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current seller:', error);
      throw error;
    }
  },

  
  async update(id: number, seller: Partial<Seller>, token: string) {
    try {
      const response = await api.put<Seller>(
        API_PATHS.SELLERS.BY_ID(id),
        seller,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating seller with id ${id}:`, error);
      throw error;
    }
  },

  
  async delete(id: number, token: string) {
    try {
      await api.delete(API_PATHS.SELLERS.BY_ID(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error(`Error deleting seller with id ${id}:`, error);
      throw error;
    }
  },
}; 