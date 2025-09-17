import type {
  Product,
  CreateProductData,
  UpdateProductData,
  ImportResult,
  ProductFilters,
} from "~/types";

const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBase || "http://localhost:3005/api";

export class ApiServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiServiceError";
  }
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new ApiServiceError(
        response.status,
        errorData.error || `HTTP ${response.status}`
      );
    }

    return response.json();
  }

  // Получить все продукты с фильтрами
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const searchParams = new URLSearchParams();

    if (filters?.search) searchParams.append("search", filters.search);
    if (filters?.brand) searchParams.append("brand", filters.brand);
    if (filters?.color) searchParams.append("color", filters.color);
    if (filters?.country) searchParams.append("country", filters.country);
    if (filters?.article) searchParams.append("article", filters.article);
    if (filters?.minPrice !== undefined)
      searchParams.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      searchParams.append("maxPrice", filters.maxPrice.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : "/products";

    return this.request<Product[]>(endpoint);
  }

  // Получить продукт по ID
  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  // Создать новый продукт
  async createProduct(data: CreateProductData): Promise<Product> {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Обновить продукт
  async updateProduct(id: number, data: UpdateProductData): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Удалить продукт
  async deleteProduct(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Импортировать продукты из Google Sheets
  async importFromGoogleSheets(url: string): Promise<ImportResult> {
    console.log(`Importing from Google Sheets: ${url}`);
    return this.request<ImportResult>("/import", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }
}

export const apiService = new ApiService();
