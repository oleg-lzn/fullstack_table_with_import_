export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors?: string[];
}

export interface GoogleSheetsData {
  values: string[][];
  range: string;
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ImportFormData {
  googleSheetsUrl?: string;
  file?: File;
}
