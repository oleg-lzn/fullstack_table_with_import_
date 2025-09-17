import { GOOGLE_SHEETS_URL } from "../../../shared/constants";

export default function Home() {
  return (
    <div className="page">
      <main className="main-content">
        <h1 className="title">Fullstack Table Import API</h1>
        <p className="subtitle">
          Backend API для импорта данных из Google Sheets
        </p>

        <div className="card">
          <h2 className="section-title">Доступные API endpoints:</h2>
          <ul className="api-list">
            <li>
              <code>POST /api/import</code> - Импорт данных из Google Sheets
            </li>
            <li>
              <code>GET /api/products</code> - Получение списка продуктов с
              фильтрацией
            </li>
            <li>
              <code>GET /api/products/[id]</code> - Получение продукта по ID
            </li>
            <li>
              <code>PUT /api/products/[id]</code> - Обновление продукта
            </li>
            <li>
              <code>DELETE /api/products/[id]</code> - Удаление продукта
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
