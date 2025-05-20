export type UserRole = 'user' | 'supplier' | 'seller' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'seller' | 'supplier';
  supplier?: Supplier;
  seller?: Seller;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Supplier {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  userId: number;
  user?: User;
}

export interface Seller {
  id: number;
  name: string;
  location: string;
  phone: string;
  email: string;
  userId: number;
  user?: User;
}

export interface Flower {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  type: string;
  imageUrl?: string;
  inStock: number;
  supplierId: number;
  supplierName?: string;
  sellers?: Seller[];
  season: string;
  country: string;
  variety: string;
}

export interface FlowerSeller {
  id: number;
  flowerId: number;
  sellerId: number;
  quantity: number;
  price: number;
}

export interface TopSeller {
  id: number;
  fullName: string;
  address: string;
  max_price: number;
  flower_count: number;
}

export interface MatchingSupplier {
  seller_name: string;
  supplier_name: string;
  flower_count: number;
}

export interface Request {
  id: number;
  title: string;
  description: string;
  status: 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  userId: number;
  userName?: string;
  flowerType?: string;
  quantity?: number;
  deadline?: string;
  contactPhone?: string;
  contactEmail?: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
} 