<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">Список продуктов</h1>
        <p>Управление продуктами в системе</p>
      </div>

      <!-- Фильтры -->
      <div class="filters">
        <div class="filters-row">
          <div class="filters-group">
            <label class="form-label">Поиск:</label>
            <input
              v-model="searchQuery"
              type="text"
              class="form-input"
              placeholder="Введите название или бренд..."
            />
          </div>

          <div class="filters-group">
            <label class="form-label">Бренд:</label>
            <select v-model="selectedBrand" class="form-select">
              <option value="">Все бренды</option>
              <option
                v-for="brand in availableBrands"
                :key="brand"
                :value="brand"
              >
                {{ brand }}
              </option>
            </select>
          </div>

          <div class="filters-group">
            <label class="form-label">Цвет:</label>
            <select v-model="selectedColor" class="form-select">
              <option value="">Все цвета</option>
              <option
                v-for="color in availableColors"
                :key="color"
                :value="color"
              >
                {{ color }}
              </option>
            </select>
          </div>

          <div class="filters-group">
            <label class="form-label">Страна:</label>
            <select v-model="selectedCountry" class="form-select">
              <option value="">Все страны</option>
              <option
                v-for="country in availableCountries"
                :key="country"
                :value="country"
              >
                {{ country }}
              </option>
            </select>
          </div>

          <div class="filters-group">
            <button @click="clearFilters" class="btn btn-secondary">
              Очистить фильтры
            </button>
          </div>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Загрузка продуктов...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="alert alert-error">
        <h3>Ошибка загрузки</h3>
        <p>{{ error }}</p>
        <button @click="loadProducts" class="btn btn-primary">
          Попробовать снова
        </button>
      </div>

      <!-- Таблица продуктов -->
      <div v-else class="table-container">
        <div v-if="filteredProducts.length === 0" class="empty-state">
          <h3>Продукты не найдены</h3>
          <p v-if="hasActiveFilters">Попробуйте изменить фильтры поиска</p>
          <p v-else>В системе пока нет продуктов</p>
        </div>

        <table v-else class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Бренд</th>
              <th>Цена</th>
              <th>Цвет</th>
              <th>Страна-Изготовитель</th>
              <th>Артикул</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.brand }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>{{ product.color || "-" }}</td>
              <td>{{ product.country || "-" }}</td>
              <td>{{ product.article || "-" }}</td>
              <td>
                <div class="action-buttons">
                  <NuxtLink
                    :to="`/products/${product.id}`"
                    class="btn btn-sm btn-primary"
                  >
                    Просмотр
                  </NuxtLink>
                  <button
                    @click="editProduct(product)"
                    class="btn btn-sm btn-secondary"
                    :disabled="loading"
                  >
                    Редактировать
                  </button>
                  <button
                    @click="handleDeleteProduct(product.id)"
                    class="btn btn-sm btn-danger"
                    :disabled="loading"
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useProducts } from "~/composables/useProducts";
import type { Product } from "~/types";

const searchQuery = ref("");
const selectedBrand = ref("");
const selectedColor = ref("");
const selectedCountry = ref("");

const { products, loading, error, fetchProducts, deleteProduct } =
  useProducts();

// Вычисляемые свойства для фильтрации
const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        (product.color && product.color.toLowerCase().includes(query)) ||
        (product.country && product.country.toLowerCase().includes(query)) ||
        (product.article && product.article.toLowerCase().includes(query))
    );
  }

  if (selectedBrand.value) {
    filtered = filtered.filter(
      (product) => product.brand === selectedBrand.value
    );
  }

  if (selectedColor.value) {
    filtered = filtered.filter(
      (product) => product.color === selectedColor.value
    );
  }

  if (selectedCountry.value) {
    filtered = filtered.filter(
      (product) => product.country === selectedCountry.value
    );
  }

  return filtered;
});

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    selectedBrand.value ||
    selectedColor.value ||
    selectedCountry.value
  );
});

// Получить уникальные бренды для фильтра
const availableBrands = computed(() => {
  const brands = [...new Set(products.value.map((product) => product.brand))];
  return brands.sort();
});

// Получить уникальные цвета для фильтра
const availableColors = computed(() => {
  const colors = [
    ...new Set(products.value.map((product) => product.color).filter(Boolean)),
  ];
  return colors.sort();
});

// Получить уникальные страны для фильтра
const availableCountries = computed(() => {
  const countries = [
    ...new Set(
      products.value.map((product) => product.country).filter(Boolean)
    ),
  ];
  return countries.sort();
});

// Методы
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);
};

const editProduct = (product: Product) => {
  alert(`Редактирование продукта: ${product.name}`);
  // TODO: Здесь можно добавить модальное окно или переход на страницу редактирования
};

const handleDeleteProduct = async (id: number) => {
  if (confirm("Вы уверены, что хотите удалить этот продукт?")) {
    const success = await deleteProduct(id);
    if (success) {
      console.log("Продукт успешно удален");
    }
  }
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedBrand.value = "";
  selectedColor.value = "";
  selectedCountry.value = "";
};

const loadProducts = () => {
  fetchProducts();
};

// Загрузка продуктов при монтировании компонента
onMounted(() => {
  loadProducts();
});

// Автоматическая фильтрация при изменении фильтров
// Можно добавить debounce для оптимизации
watch([searchQuery, selectedBrand, selectedColor, selectedCountry], () => {
  // Фильтрация происходит автоматически через computed свойство
  // В будущем здесь можно добавить серверную фильтрацию
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.alert {
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.alert-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.alert p {
  margin: 0 0 1rem 0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.btn-primary {
  background: #007bff;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
}

.filters-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filters-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: end;
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filters-group {
    min-width: auto;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .table {
    font-size: 0.8rem;
  }
}
</style>
