<template>
  <div class="product-form">
    <h3>{{ isEdit ? "Редактировать продукт" : "Добавить новый продукт" }}</h3>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">Артикул:</label>
        <input
          v-model="form.article"
          type="text"
          class="form-input"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Название:</label>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Бренд:</label>
        <input
          v-model="form.brand"
          type="text"
          class="form-input"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Цена:</label>
        <input
          v-model.number="form.price"
          type="number"
          min="0"
          step="0.01"
          class="form-input"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Цвет:</label>
        <input
          v-model="form.color"
          type="text"
          class="form-input"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Страна-изготовитель:</label>
        <input
          v-model="form.country"
          type="text"
          class="form-input"
          :disabled="loading"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Сохранение..." : isEdit ? "Обновить" : "Создать" }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn btn-secondary"
          :disabled="loading"
        >
          Отмена
        </button>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useProducts, useProduct } from "~/composables/useProducts";
import type { Product, CreateProductData, UpdateProductData } from "~/types";

interface Props {
  product?: Product | null;
  isEdit?: boolean;
}

interface Emits {
  (e: "success", product: Product): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  isEdit: false,
});

const emit = defineEmits<Emits>();

const { createProduct, updateProduct, loading, error } = useProducts();

const form = reactive<CreateProductData & { id?: number }>({
  name: "",
  brand: "",
  price: 0,
  color: "",
  country: "",
  article: "",
});

// Заполнить форму данными продукта для редактирования
watch(
  () => props.product,
  (product) => {
    if (product) {
      form.name = product.name;
      form.brand = product.brand;
      form.price = product.price;
      form.color = product.color || "";
      form.country = product.country || "";
      form.article = product.article || "";

      form.id = product.id;
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  let result: Product | null = null;

  if (props.isEdit && form.id) {
    // Обновление существующего продукта
    const updateData: UpdateProductData = {
      article: form.article || undefined,
      name: form.name,
      brand: form.brand,
      price: form.price,
      color: form.color || undefined,
      country: form.country || undefined,
    };
    result = await updateProduct(form.id, updateData);
  } else {
    // Создание нового продукта
    const createData: CreateProductData = {
      article: form.article || undefined,
      name: form.name,
      brand: form.brand,
      price: form.price,
      color: form.color || undefined,
      country: form.country || undefined,
    };
    result = await createProduct(createData);
  }

  if (result) {
    emit("success", result);
    // Очистить форму после успешного создания
    if (!props.isEdit) {
      Object.assign(form, {
        article: "",
        name: "",
        brand: "",
        price: 0,
        color: "",
        country: "",
      });
    }
  }
};
</script>

<style scoped>
.product-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.product-form h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-input:disabled,
.form-textarea:disabled {
  opacity: 0.6;
  background-color: #f8f9fa;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.alert-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}
</style>
