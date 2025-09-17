<template>
  <div>
    <div v-if="!product" class="card">
      <div class="alert alert-error">
        <h3>Продукт не найден</h3>
        <p>Продукт с указанным ID не существует</p>
        <NuxtLink to="/products" class="btn btn-primary">
          Вернуться к списку
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <!-- Навигация -->
      <div class="breadcrumb">
        <NuxtLink to="/products" class="breadcrumb-link">Продукты</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ product.name }}</span>
      </div>

      <!-- Детали продукта -->
      <div class="card">
        <div class="card-header">
          <div class="product-header">
            <h1 class="card-title">{{ product.name }}</h1>
            <div class="product-actions">
              <button @click="editProduct" class="btn btn-secondary">
                Редактировать
              </button>
              <button @click="deleteProduct" class="btn btn-danger">
                Удалить
              </button>
            </div>
          </div>
        </div>

        <div class="product-details">
          <div class="detail-row">
            <div class="detail-label">ID:</div>
            <div class="detail-value">{{ product.id }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Название:</div>
            <div class="detail-value">{{ product.name }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Бренд:</div>
            <div class="detail-value">{{ product.brand }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Цена:</div>
            <div class="detail-value price">
              {{ formatPrice(product.price) }}
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Категория:</div>
            <div class="detail-value">
              {{ product.category || "Не указана" }}
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Описание:</div>
            <div class="detail-value">
              {{ product.description || "Описание отсутствует" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null,
    };
  },
  mounted() {
    this.loadProduct();
  },
  methods: {
    loadProduct() {
      const id = this.$route.params.id;
      // Имитируем загрузку продукта
      const products = [
        {
          id: 1,
          name: "iPhone 15",
          brand: "Apple",
          price: 999,
          category: "Смартфоны",
          description: "Новейший iPhone с улучшенной камерой",
        },
        {
          id: 2,
          name: "Galaxy S24",
          brand: "Samsung",
          price: 899,
          category: "Смартфоны",
          description: "Флагманский смартфон Samsung",
        },
        {
          id: 3,
          name: "PlayStation 5",
          brand: "Sony",
          price: 499,
          category: "Игровые консоли",
          description: "Игровая консоль нового поколения",
        },
        {
          id: 4,
          name: "MacBook Pro",
          brand: "Apple",
          price: 1999,
          category: "Ноутбуки",
          description: "Профессиональный ноутбук для работы",
        },
        {
          id: 5,
          name: "AirPods Pro",
          brand: "Apple",
          price: 249,
          category: "Аудио",
          description: "Беспроводные наушники с шумоподавлением",
        },
      ];

      this.product = products.find((p) => p.id == id) || null;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(price);
    },
    editProduct() {
      alert(`Редактирование продукта: ${this.product.name}`);
    },
    deleteProduct() {
      if (confirm("Вы уверены, что хотите удалить этот продукт?")) {
        alert("Продукт удален");
        this.$router.push("/products");
      }
    },
  },
};
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #666;
}

.breadcrumb-current {
  color: #333;
  font-weight: 500;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.product-details {
  display: grid;
  gap: 1rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #666;
}

.detail-value {
  color: #333;
}

.detail-value.price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #28a745;
}

@media (max-width: 768px) {
  .product-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .detail-label {
    font-size: 0.9rem;
  }
}
</style>
