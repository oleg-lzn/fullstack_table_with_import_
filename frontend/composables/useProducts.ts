import { ref, computed } from "vue";
import { apiService, ApiServiceError } from "~/services/api";
import type {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductFilters,
  ImportResult,
} from "~/types";

export const useProducts = () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Загрузить все продукты
  const fetchProducts = async (filters?: ProductFilters) => {
    loading.value = true;
    error.value = null;

    try {
      products.value = await apiService.getProducts(filters);
    } catch (err) {
      error.value =
        err instanceof ApiServiceError
          ? err.message
          : "Ошибка загрузки продуктов";
      console.error("Error fetching products:", err);
    } finally {
      loading.value = false;
    }
  };

  // Создать новый продукт
  const createProduct = async (
    data: CreateProductData
  ): Promise<Product | null> => {
    loading.value = true;
    error.value = null;

    try {
      const newProduct = await apiService.createProduct(data);
      products.value.push(newProduct);
      return newProduct;
    } catch (err) {
      error.value =
        err instanceof ApiServiceError
          ? err.message
          : "Ошибка создания продукта";
      console.error("Error creating product:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Обновить продукт
  const updateProduct = async (
    id: number,
    data: UpdateProductData
  ): Promise<Product | null> => {
    loading.value = true;
    error.value = null;

    try {
      const updatedProduct = await apiService.updateProduct(id, data);
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }
      return updatedProduct;
    } catch (err) {
      error.value =
        err instanceof ApiServiceError
          ? err.message
          : "Ошибка обновления продукта";
      console.error("Error updating product:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Удалить продукт
  const deleteProduct = async (id: number): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await apiService.deleteProduct(id);
      products.value = products.value.filter((p) => p.id !== id);
      return true;
    } catch (err) {
      error.value =
        err instanceof ApiServiceError
          ? err.message
          : "Ошибка удаления продукта";
      console.error("Error deleting product:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Импортировать продукты из Google Sheets
  const importFromGoogleSheets = async (
    url: string
  ): Promise<ImportResult | null> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await apiService.importFromGoogleSheets(url);
      // Перезагружаем продукты после импорта
      if (result.success) {
        await fetchProducts();
      }
      return result;
    } catch (err) {
      error.value =
        err instanceof ApiServiceError ? err.message : "Ошибка импорта данных";
      console.error("Error importing from Google Sheets:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    products: computed(() => products.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    importFromGoogleSheets,
  };
};

// Composable для работы с одним продуктом
export const useProduct = (id?: number) => {
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Загрузить продукт по ID
  const fetchProduct = async (productId?: number) => {
    const targetId = productId || id;
    if (!targetId) {
      error.value = "ID продукта не указан";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      product.value = await apiService.getProduct(targetId);
    } catch (err) {
      error.value =
        err instanceof ApiServiceError
          ? err.message
          : "Ошибка загрузки продукта";
      console.error("Error fetching product:", err);
    } finally {
      loading.value = false;
    }
  };

  // Обновить текущий продукт
  const updateCurrentProduct = async (
    data: UpdateProductData
  ): Promise<Product | null> => {
    if (!product.value?.id) {
      error.value = "Продукт не загружен";
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const updatedProduct = await apiService.updateProduct(
        product.value.id,
        data
      );
      product.value = updatedProduct;
      return updatedProduct;
    } catch (err) {
      error.value =
        err instanceof ApiServiceError
          ? err.message
          : "Ошибка обновления продукта";
      console.error("Error updating product:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Удалить текущий продукт
  const deleteCurrentProduct = async (): Promise<boolean> => {
    if (!product.value?.id) {
      error.value = "Продукт не загружен";
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      await apiService.deleteProduct(product.value.id);
      product.value = null;
      return true;
    } catch (err) {
      error.value =
        err instanceof ApiServiceError
          ? err.message
          : "Ошибка удаления продукта";
      console.error("Error deleting product:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    product: computed(() => product.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchProduct,
    updateCurrentProduct,
    deleteCurrentProduct,
  };
};
