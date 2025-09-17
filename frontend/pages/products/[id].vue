<template>
  <div>
    <!-- Загрузка -->
    <div v-if="loading" class="card">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Загрузка продукта...</p>
      </div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="card">
      <div class="alert alert-error">
        <h3>Ошибка загрузки</h3>
        <p>{{ error }}</p>
        <NuxtLink to="/products" class="btn btn-primary">
          Вернуться к списку
        </NuxtLink>
      </div>
    </div>

    <!-- Продукт не найден -->
    <div v-else-if="!product" class="card">
      <div class="alert alert-error">
        <h3>Продукт не найден</h3>
        <p>Продукт с указанным ID не существует</p>
        <NuxtLink to="/products" class="btn btn-primary">
          Вернуться к списку
        </NuxtLink>
      </div>
    </div>

    <!-- Детали продукта -->
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
              <button
                @click="editProduct"
                class="btn btn-secondary"
                :disabled="loading"
              >
                Редактировать
              </button>
              <button
                @click="handleDeleteProduct"
                class="btn btn-danger"
                :disabled="loading"
              >
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
            <div class="detail-label">Цвет:</div>
            <div class="detail-value">
              {{ product.color || "Не указан" }}
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Страна-изготовитель:</div>
            <div class="detail-value">
              {{ product.country || "Не указана" }}
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Артикул:</div>
            <div class="detail-value">
              {{ product.article || "Не указан" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProduct } from "~/composables/useProducts";

const route = useRoute();
const router = useRouter();

const productId = parseInt(route.params.id as string);
const {
  product,
  loading,
  error,
  fetchProduct,
  updateCurrentProduct,
  deleteCurrentProduct,
} = useProduct(productId);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);
};

const editProduct = () => {
  if (product.value) {
    alert(`Редактирование продукта: ${product.value.name}`);
    // TODO: Здесь можно добавить модальное окно или переход на страницу редактирования
  }
};

const handleDeleteProduct = async () => {
  if (confirm("Вы уверены, что хотите удалить этот продукт?")) {
    const success = await deleteCurrentProduct();
    if (success) {
      alert("Продукт удален");
      router.push("/products");
    }
  }
};

onMounted(() => {
  if (productId) {
    fetchProduct(productId);
  }
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
  text-align: center;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
