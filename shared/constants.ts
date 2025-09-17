export const GOOGLE_SHEETS_URL =
  "https://docs.google.com/spreadsheets/d/1JSxXiuWX9dJEeUKGYUY4EsQ5wJln7acNr7UEpA20Ys0/edit?usp=sharing";

export const API_ENDPOINTS = {
  IMPORT: "/api/import",
  PRODUCTS: "/api/products",
  PRODUCT_BY_ID: (id: number) => `/api/products/${id}`,
} as const;

export const PRODUCT_FIELDS = [
  "Артикул",
  "Название Товара",
  "Бренд",
  "Цнга",
  "Цвет",
  "Страна-изготовитель",
] as const;
