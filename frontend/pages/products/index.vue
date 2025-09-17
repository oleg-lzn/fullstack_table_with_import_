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
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Sony">Sony</option>
            </select>
          </div>

          <div class="filters-group">
            <button @click="clearFilters" class="btn btn-secondary">
              Очистить фильтры
            </button>
          </div>
        </div>
      </div>

      <!-- Таблица продуктов -->
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Бренд</th>
              <th>Цена</th>
              <th>Категория</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.brand }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>{{ product.category || "-" }}</td>
              <td>
                <NuxtLink
                  :to="`/products/${product.id}`"
                  class="btn btn-sm btn-primary"
                >
                  Просмотр
                </NuxtLink>
                <button
                  @click="editProduct(product)"
                  class="btn btn-sm btn-secondary"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="btn btn-sm btn-danger"
                >
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      selectedBrand: "",
      products: [
        {
          id: 1,
          name: "iPhone 15",
          brand: "Apple",
          price: 999,
          category: "Смартфоны",
        },
        {
          id: 2,
          name: "Galaxy S24",
          brand: "Samsung",
          price: 899,
          category: "Смартфоны",
        },
        {
          id: 3,
          name: "PlayStation 5",
          brand: "Sony",
          price: 499,
          category: "Игровые консоли",
        },
        {
          id: 4,
          name: "MacBook Pro",
          brand: "Apple",
          price: 1999,
          category: "Ноутбуки",
        },
        {
          id: 5,
          name: "AirPods Pro",
          brand: "Apple",
          price: 249,
          category: "Аудио",
        },
      ],
    };
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(price);
    },
    editProduct(product) {
      alert(`Редактирование продукта: ${product.name}`);
    },
    deleteProduct(id) {
      if (confirm("Вы уверены, что хотите удалить этот продукт?")) {
        this.products = this.products.filter((p) => p.id !== id);
      }
    },
    clearFilters() {
      this.searchQuery = "";
      this.selectedBrand = "";
    },
  },
};
</script>
