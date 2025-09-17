export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  color?: string;
  country?: string;
  article?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  brand: string;
  price: number;
  color?: string;
  country?: string;
  article?: string;
}

export interface UpdateProductData {
  name?: string;
  brand?: string;
  price?: number;
  color?: string;
  country?: string;
  article?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors?: string[];
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  color?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  article?: string;
}

export interface ApiError {
  error: string;
}
