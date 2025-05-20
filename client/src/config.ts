
export const API_URL = '';


export const APP_NAME = 'Цветы';


export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';


export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  FLOWERS: {
    BASE: '/api/flowers',
    BY_ID: (id: number) => `/api/flowers/${id}`,
    BY_TYPE: (type: string) => `/api/flowers/type/${type}`,
    BY_SUPPLIER: (supplierId: number) => `/api/flowers/by-supplier/${supplierId}`,
    SEARCH_BY_VARIETY: (variety: string) => `/api/flowers/search/by-variety?variety=${variety}`,
  },
  SUPPLIERS: {
    BASE: '/api/suppliers',
    BY_ID: (id: number) => `/api/suppliers/${id}`,
    ME: '/api/suppliers/me',
  },
  SELLERS: {
    BASE: '/api/sellers',
    BY_ID: (id: number) => `/api/sellers/${id}`,
    ME: '/api/sellers/me',
    TOP_EXPENSIVE: '/api/sellers/top/expensive',
    MATCHING_SUPPLIERS: '/api/sellers/matching-suppliers',
  },
  REQUESTS: {
    BASE: '/api/requests',
    BY_ID: (id: number) => `/api/requests/${id}`,
    APPROVE: (id: number) => `/api/requests/${id}/approve`,
    REJECT: (id: number) => `/api/requests/${id}/reject`,
    COMPLETE: (id: number) => `/api/requests/${id}/complete`,
  },
}; 