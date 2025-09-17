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

    <form style="margin-bottom: 20px">
      <div style="margin-bottom: 20px">
        <label style="display: block; margin-bottom: 8px; font-weight: 500">
          Ссылка на Google Sheets:
        </label>
        <input
          v-model="googleSheetsUrl"
          type="url"
          style="
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          "
          placeholder="https://docs.google.com/spreadsheets/d/..."
        />
        <small style="color: #666; font-size: 14px">
          Пример:
          https://docs.google.com/spreadsheets/d/1JSxXiuWX9dJEeUKGYUY4EsQ5wJln7acNr7UEpA20Ys0/edit?usp=sharing
        </small>
      </div>

      <button
        type="button"
        @click="handleImport"
        style="
          background: #007bff;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        "
      >
        Импортировать
      </button>
    </form>

    <div
      v-if="message"
      style="
        margin-top: 20px;
        padding: 15px;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        color: #155724;
      "
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      googleSheetsUrl:
        "https://docs.google.com/spreadsheets/d/1JSxXiuWX9dJEeUKGYUY4EsQ5wJln7acNr7UEpA20Ys0/edit?usp=sharing",
      message: "",
    };
  },
  methods: {
    handleImport() {
      this.message = "Импорт данных выполнен! (демо версия)";
      setTimeout(() => {
        this.message = "";
      }, 3000);
    },
  },
};
</script>
