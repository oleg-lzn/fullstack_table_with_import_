<template>
  <div
    style="
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    "
  >
    <h1 style="color: #333; margin-bottom: 20px">Импорт данных</h1>
    <p style="margin-bottom: 30px; color: #666">
      Импортируйте данные продуктов из Google Sheets
    </p>

    <form @submit.prevent="handleImport" style="margin-bottom: 20px">
      <div style="margin-bottom: 20px">
        <label style="display: block; margin-bottom: 8px; font-weight: 500">
          Ссылка на Google Sheets:
        </label>
        <input
          v-model="googleSheetsUrl"
          type="url"
          required
          :disabled="loading"
          style="
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          "
          :style="{ opacity: loading ? 0.6 : 1 }"
          placeholder="https://docs.google.com/spreadsheets/d/..."
        />
        <small style="color: #666; font-size: 14px">
          Пример:
          https://docs.google.com/spreadsheets/d/1JSxXiuWX9dJEeUKGYUY4EsQ5wJln7acNr7UEpA20Ys0/edit?usp=sharing
        </small>
      </div>

      <button
        type="submit"
        :disabled="loading || !googleSheetsUrl"
        style="
          background: #007bff;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        "
        :style="{
          opacity: loading || !googleSheetsUrl ? 0.6 : 1,
          cursor: loading || !googleSheetsUrl ? 'not-allowed' : 'pointer',
        }"
      >
        {{ loading ? "Импортирование..." : "Импортировать" }}
      </button>
    </form>

    <!-- Сообщение об успехе -->
    <div
      v-if="successMessage"
      style="
        margin-top: 20px;
        padding: 15px;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        color: #155724;
      "
    >
      {{ successMessage }}
      <div v-if="importedCount > 0" style="margin-top: 8px; font-weight: 500">
        Импортировано продуктов: {{ importedCount }}
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div
      v-if="error"
      style="
        margin-top: 20px;
        padding: 15px;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        color: #721c24;
      "
    >
      {{ error }}
    </div>

    <!-- Ошибки импорта -->
    <div
      v-if="importErrors && importErrors.length > 0"
      style="
        margin-top: 20px;
        padding: 15px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 4px;
        color: #856404;
      "
    >
      <h4 style="margin: 0 0 10px 0">Предупреждения при импорте:</h4>
      <ul style="margin: 0; padding-left: 20px">
        <li v-for="(error, index) in importErrors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Ссылка на просмотр продуктов -->
    <div v-if="successMessage" style="margin-top: 20px">
      <NuxtLink
        to="/products"
        style="
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
        "
      >
        Просмотреть все продукты
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProducts } from "~/composables/useProducts";
import { GOOGLE_SHEETS_URL } from "../../shared/constants";

const googleSheetsUrl = ref(GOOGLE_SHEETS_URL);

const successMessage = ref("");
const importedCount = ref(0);
const importErrors = ref<string[]>([]);

const { loading, error, importFromGoogleSheets } = useProducts();

const clearMessages = () => {
  successMessage.value = "";
  importedCount.value = 0;
  importErrors.value = [];
};

const handleImport = async () => {
  if (!googleSheetsUrl.value.trim()) {
    return;
  }

  clearMessages();

  try {
    const result = await importFromGoogleSheets(googleSheetsUrl.value);

    if (result) {
      if (result.success) {
        successMessage.value = result.message;
        importedCount.value = result.importedCount;
        importErrors.value = result.errors || [];
      } else {
        // Ошибка уже установлена в composable через error.value
      }
    }
  } catch (err) {
    console.error("Import error:", err);
  }
};
</script>
