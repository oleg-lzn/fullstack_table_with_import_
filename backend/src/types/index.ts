export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  color?: string;
  country?: string;
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
  color?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
}
