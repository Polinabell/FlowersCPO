import axios from 'axios';
import { API_PATHS } from '../config';
import { Request } from '../types';

const API_URL = 'http://localhost:3001';

export const requestsAPI = {
  getAll: async (token: string) => {
    if (!token) {
      console.error('Token is required for getAll requests');
      throw new Error('Требуется авторизация');
    }

    try {
      console.log('Выполняем запрос к:', `${API_URL}${API_PATHS.REQUESTS.BASE}/all`);
      
      const response = await axios.get(`${API_URL}${API_PATHS.REQUESTS.BASE}/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Ответ API (статус):', response.status);
      console.log('Тип данных ответа:', typeof response.data);
      
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching requests (API error):', 
          error.response?.status, 
          error.response?.data || error.message
        );
        
        // Проверяем доступность API
        if (!error.response) {
          throw new Error('Сервер недоступен. Проверьте подключение к интернету.');
        }
        
        // Обрабатываем распространенные ошибки
        if (error.response.status === 401) {
          throw new Error('Ошибка авторизации. Пожалуйста, войдите снова.');
        } else if (error.response.status === 403) {
          throw new Error('У вас нет прав для просмотра запросов.');
        } else if (error.response.status === 404) {
          throw new Error('Ресурс не найден.');
        } 
        
        // Если сервер вернул сообщение об ошибке, используем его
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      console.error('Error fetching requests (generic):', error);
      throw error;
    }
  },

  getById: async (id: number, token: string) => {
    try {
      const { data } = await axios.get(`${API_URL}${API_PATHS.REQUESTS.BY_ID(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (error) {
      console.error(`Error fetching request with id ${id}:`, error);
      throw error;
    }
  },

  create: async (request: Omit<Request, 'id' | 'status' | 'createdAt' | 'updatedAt'>, token: string) => {
    try {
      const { data } = await axios.post(`${API_URL}${API_PATHS.REQUESTS.BASE}`, request, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return data;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  update: async (id: number, request: Partial<Request>, token: string) => {
    try {
      const { data } = await axios.put(`${API_URL}${API_PATHS.REQUESTS.BY_ID(id)}`, request, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return data;
    } catch (error) {
      console.error(`Error updating request with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number, token: string) => {
    try {
      const { data } = await axios.delete(`${API_URL}${API_PATHS.REQUESTS.BY_ID(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (error) {
      console.error(`Error deleting request with id ${id}:`, error);
      throw error;
    }
  },

  approve: async (id: number, token: string) => {
    try {
      const { data } = await axios.post(`${API_URL}${API_PATHS.REQUESTS.APPROVE(id)}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return data;
    } catch (error) {
      console.error(`Error approving request with id ${id}:`, error);
      throw error;
    }
  },

  reject: async (id: number, reason: string, token: string) => {
    try {
      const { data } = await axios.post(`${API_URL}${API_PATHS.REQUESTS.REJECT(id)}`, 
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return data;
    } catch (error) {
      console.error(`Error rejecting request with id ${id}:`, error);
      throw error;
    }
  },

  complete: async (id: number, token: string) => {
    try {
      const { data } = await axios.post(`${API_URL}${API_PATHS.REQUESTS.COMPLETE(id)}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return data;
    } catch (error) {
      console.error(`Error completing request with id ${id}:`, error);
      throw error;
    }
  }
}; 