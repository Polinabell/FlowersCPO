import axios from 'axios';
import { Supplier } from '../types';
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

export const suppliersAPI = {
  
  async getAll() {
    try {
      const response = await api.get<Supplier[]>(API_PATHS.SUPPLIERS.BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  
  async getById(id: number) {
    try {
      const response = await api.get<Supplier>(API_PATHS.SUPPLIERS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier with id ${id}:`, error);
      throw error;
    }
  },

  
  async getCurrent(token: string) {
    try {
      const response = await api.get<Supplier>(API_PATHS.SUPPLIERS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current supplier:', error);
      throw error;
    }
  },

  
  async update(id: number, supplier: Partial<Supplier>, token: string) {
    try {
      const response = await api.put<Supplier>(
        API_PATHS.SUPPLIERS.BY_ID(id),
        supplier,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier with id ${id}:`, error);
      throw error;
    }
  },

  
  async delete(id: number, token: string) {
    try {
      await api.delete(API_PATHS.SUPPLIERS.BY_ID(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error(`Error deleting supplier with id ${id}:`, error);
      throw error;
    }
  },
}; 