import axios from 'axios';
import { AuthResponse, Flower, Seller, Supplier, TopSeller, MatchingSupplier, Request } from '../types';
import { API_PATHS } from '../config';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});


const getApiUrl = (endpoint: string): string => {
  
  return `${endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`}`;
};


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


export const authAPI = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(getApiUrl(API_PATHS.AUTH.REGISTER), data);
    return response.data;
  },
  
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(getApiUrl(API_PATHS.AUTH.LOGIN), { email, password });
    return response.data;
  },
  
  getProfile: async (): Promise<{ user: any }> => {
    const response = await api.get<{ user: any }>(getApiUrl(API_PATHS.AUTH.ME));
    return response.data;
  },
};


export const flowersAPI = {
  getAllFlowers: async (): Promise<{ flowers: Flower[] }> => {
    const response = await api.get<{ flowers: Flower[] }>(getApiUrl(API_PATHS.FLOWERS.BASE));
    return response.data;
  },
  
  getFlowerById: async (id: number): Promise<{ flower: Flower }> => {
    const response = await api.get<{ flower: Flower }>(getApiUrl(API_PATHS.FLOWERS.BY_ID(id)));
    return response.data;
  },
  
  createFlower: async (flowerData: Partial<Flower>): Promise<{ message: string; flower: Flower }> => {
    const response = await api.post<{ message: string; flower: Flower }>(getApiUrl(API_PATHS.FLOWERS.BASE), flowerData);
    return response.data;
  },
  
  deleteFlower: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(getApiUrl(API_PATHS.FLOWERS.BY_ID(id)));
    return response.data;
  },
  
  searchBySeason: async (season: string): Promise<{ flowers: Flower[] }> => {
    const response = await api.get<{ flowers: Flower[] }>('/api/flowers/search/by-season', {
      params: { season },
    });
    return response.data;
  },
  
  searchByCountry: async (country: string): Promise<{ flowers: Flower[] }> => {
    const response = await api.get<{ flowers: Flower[] }>('/api/flowers/search/by-country', {
      params: { country },
    });
    return response.data;
  },
  
  searchByVariety: async (variety: string): Promise<{ flowers: Flower[] }> => {
    const response = await api.get<{ flowers: Flower[] }>(getApiUrl(API_PATHS.FLOWERS.SEARCH_BY_VARIETY(variety)));
    return response.data;
  },
};


export const suppliersAPI = {
  getAllSuppliers: async (): Promise<{ suppliers: Supplier[] }> => {
    const response = await api.get<{ suppliers: Supplier[] }>(getApiUrl(API_PATHS.SUPPLIERS.BASE));
    return response.data;
  },
  
  getSupplierById: async (id: number): Promise<{ supplier: Supplier }> => {
    const response = await api.get<{ supplier: Supplier }>(getApiUrl(API_PATHS.SUPPLIERS.BY_ID(id)));
    return response.data;
  },
  
  getSupplierFlowers: async (id: number): Promise<{ supplier: Supplier; flowers: Flower[] }> => {
    const response = await api.get<{ supplier: Supplier; flowers: Flower[] }>(getApiUrl(`${API_PATHS.SUPPLIERS.BY_ID(id)}/flowers`));
    return response.data;
  },
};


export const sellersAPI = {
  getAllSellers: async (): Promise<{ sellers: Seller[] }> => {
    const response = await api.get<{ sellers: Seller[] }>(getApiUrl(API_PATHS.SELLERS.BASE));
    return response.data;
  },
  
  getSellerById: async (id: number): Promise<{ seller: Seller }> => {
    const response = await api.get<{ seller: Seller }>(getApiUrl(API_PATHS.SELLERS.BY_ID(id)));
    return response.data;
  },
  
  getSellerFlowers: async (id: number): Promise<{ seller: Seller; flowers: Flower[] }> => {
    const response = await api.get<{ seller: Seller; flowers: Flower[] }>(getApiUrl(`${API_PATHS.SELLERS.BY_ID(id)}/flowers`));
    return response.data;
  },
  
  addFlowerToSeller: async (flowerId: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(getApiUrl(`${API_PATHS.SELLERS.BASE}/flowers`), { flowerId });
    return response.data;
  },
  
  removeFlowerFromSeller: async (flowerId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(getApiUrl(`${API_PATHS.SELLERS.BASE}/flowers/${flowerId}`));
    return response.data;
  },
  
  getTopExpensiveSellers: async (): Promise<{ sellers: TopSeller[] }> => {
    const response = await api.get<{ sellers: TopSeller[] }>(getApiUrl(API_PATHS.SELLERS.TOP_EXPENSIVE));
    return response.data;
  },
  
  getMatchingSuppliers: async (): Promise<{ matchingData: MatchingSupplier[] }> => {
    const response = await api.get<{ matchingData: MatchingSupplier[] }>(getApiUrl(API_PATHS.SELLERS.MATCHING_SUPPLIERS));
    return response.data;
  },
};


export const requestsAPI = {
  getAllRequests: async (
    filters?: { status?: string; search?: string; fromDate?: string; toDate?: string }
  ): Promise<{ requests: Request[] }> => {
    const response = await api.get<{ requests: Request[] }>(getApiUrl(`${API_PATHS.REQUESTS.BASE}/all`), {
      params: filters
    });
    return response.data;
  },
  
  getUserRequests: async (): Promise<{ requests: Request[] }> => {
    const response = await api.get<{ requests: Request[] }>(getApiUrl(`${API_PATHS.REQUESTS.BASE}/my`));
    return response.data;
  },
  
  getRequestById: async (id: number): Promise<{ request: Request }> => {
    const response = await api.get<{ request: Request }>(getApiUrl(API_PATHS.REQUESTS.BY_ID(id)));
    return response.data;
  },
  
  createRequest: async (requestData: Partial<Request>): Promise<{ message: string; request: Request }> => {
    const response = await api.post<{ message: string; request: Request }>(getApiUrl(API_PATHS.REQUESTS.BASE), requestData);
    return response.data;
  },
  
  updateRequestStatus: async (id: number, status: string): Promise<{ message: string; request: Request }> => {
    const response = await api.patch<{ message: string; request: Request }>(getApiUrl(`${API_PATHS.REQUESTS.BY_ID(id)}/status`), { status });
    return response.data;
  },
  
  deleteRequest: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(getApiUrl(API_PATHS.REQUESTS.BY_ID(id)));
    return response.data;
  }
}; 