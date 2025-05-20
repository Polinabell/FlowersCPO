import axios from 'axios';
import { Flower } from '../types';
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
    
    // Избегаем возможных undefined при логировании
    const baseURL = config.baseURL || '';
    const url = config.url || '';
    console.log('Запрос к:', baseURL + url);
    
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => {
    console.log('Успешный ответ от:', response.config.url, 'Статус:', response.status);
    return response;
  },
  (error) => {
    console.error('Ошибка запроса к:', error.config?.url, 'Статус:', error.response?.status);
    return Promise.reject(error);
  }
);

interface FlowersResponse {
  flowers?: Flower[];
  data?: Flower[];
  message?: string;
}

export const flowersAPI = {
  
  async getAll() {
    try {
      console.log('Запрос цветов по URL:', API_PATHS.FLOWERS.BASE);
      const response = await api.get<FlowersResponse>(API_PATHS.FLOWERS.BASE);
      
      return response.data.flowers || [];
    } catch (error) {
      console.error('Error fetching flowers:', error);
      throw error;
    }
  },

  async getAllFlowers() {
    try {
      const response = await api.get<{ flowers: Flower[] }>(API_PATHS.FLOWERS.BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching all flowers:', error);
      throw error;
    }
  },

  
  async getById(id: number) {
    try {
      const response = await api.get<{ flower: Flower }>(API_PATHS.FLOWERS.BY_ID(id));
      return response.data.flower;
    } catch (error) {
      console.error(`Error fetching flower with id ${id}:`, error);
      throw error;
    }
  },

  
  async getByType(type: string) {
    try {
      const response = await api.get<FlowersResponse>(API_PATHS.FLOWERS.BY_TYPE(type));
      return response.data.flowers || [];
    } catch (error) {
      console.error(`Error fetching flowers of type ${type}:`, error);
      throw error;
    }
  },

  
  async getBySupplier(supplierId: number) {
    try {
      const response = await api.get<FlowersResponse>(API_PATHS.FLOWERS.BY_SUPPLIER(supplierId));
      return response.data.flowers || [];
    } catch (error) {
      console.error(`Error fetching flowers from supplier ${supplierId}:`, error);
      throw error;
    }
  },

  
  async create(flower: {
    name: string;
    type: string;
    season: string;
    country: string;
    variety: string;
    price: number;
    imageUrl: string;
    inStock: number;
    description?: string;
  }, token: string) {
    try {
      const response = await api.post<{ flower: Flower; message: string }>(
        API_PATHS.FLOWERS.BASE,
        flower,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.flower;
    } catch (error) {
      console.error('Error creating flower:', error);
      throw error;
    }
  },

  
  async update(id: number, flower: Partial<Flower>, token: string) {
    try {
      const response = await api.put<{ flower: Flower; message: string }>(
        API_PATHS.FLOWERS.BY_ID(id),
        flower,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.flower;
    } catch (error) {
      console.error(`Error updating flower with id ${id}:`, error);
      throw error;
    }
  },

  
  async delete(id: number, token: string) {
    try {
      await api.delete(API_PATHS.FLOWERS.BY_ID(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error(`Error deleting flower with id ${id}:`, error);
      throw error;
    }
  },
}; 