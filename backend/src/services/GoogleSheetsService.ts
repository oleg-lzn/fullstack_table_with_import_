import { GoogleSheetsData, Product } from "@/types";
import Papa from "papaparse";

export class GoogleSheetsService {
  async getSheetData(
    spreadsheetId: string,
    gid: string = "0"
  ): Promise<GoogleSheetsData> {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const csvText = await response.text();
    const parsed = Papa.parse(csvText, {
      skipEmptyLines: true,
      transform: (value) => value.trim(),
    });

    if (parsed.errors.length > 0) {
      console.warn("Ошибки парсинга CSV:", parsed.errors);
    }

    return {
      values: parsed.data as string[][],
      range: `Sheet${gid}!A:Z`, // Формируем range на основе gid
    };
  }

  extractSpreadsheetId(url: string): string {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) throw new Error("Неверный URL Google Sheets");
    return match[1];
  }

  extractGid(url: string): string {
    // Извлекаем gid из URL (например, #gid=123456 или &gid=123456)
    const gidMatch = url.match(/[#&]gid=([0-9]+)/);
    return gidMatch ? gidMatch[1] : "0"; // По умолчанию первый лист имеет gid=0
  }

  parseProductData(values: string[][]): Partial<Product>[] {
    if (!values?.length || values.length < 2) {
      throw new Error("Нет данных в таблице");
    }

    const [headers, ...dataRows] = values;
    console.log("Headers:", headers);

    const fieldMap = this.createFieldMapping(headers);
    console.log("Field mapping:", fieldMap);

    const filteredRows = dataRows.filter((row) => row.length && row[0]?.trim());
    console.log(
      `Filtered ${filteredRows.length} rows from ${dataRows.length} total rows`
    );

    const mappedProducts = filteredRows.map((row) =>
      this.mapRowToProduct(row, fieldMap)
    );
    console.log("Sample mapped product:", mappedProducts[0]);

    const validProducts = mappedProducts.filter((product) =>
      this.isValidProduct(product)
    );
    console.log(
      `Valid products: ${validProducts.length} from ${mappedProducts.length} mapped products`
    );

    return validProducts;
  }

  private createFieldMapping(headers: string[]): Record<number, keyof Product> {
    const mapping: Record<number, keyof Product> = {};

    headers.forEach((header, index) => {
      const normalized = header.toLowerCase().trim();
      const field = this.getFieldByHeader(normalized);
      if (field) mapping[index] = field;
    });

    return mapping;
  }

  private getFieldByHeader(header: string): keyof Product | null {
    const fieldMappings: Record<string, keyof Product> = {
      name: "name",
      "product name": "name",
      название: "name",
      "название товара": "name",
      brand: "brand",
      бренд: "brand",
      price: "price",
      цена: "price",
      "цена, руб.*": "price",
      "цена руб": "price",
      "цена, руб": "price",
      color: "color",
      цвет: "color",
      country: "country",
      "страна-изготовитель": "country",
      "страна изготовитель": "country",
      страна: "country",
      артикул: "article", // Артикул как строка
    };

    return fieldMappings[header] || null;
  }

  private mapRowToProduct(
    row: string[],
    fieldMap: Record<number, keyof Product>
  ): Partial<Product> {
    const product: Partial<Product> = {};

    Object.entries(fieldMap).forEach(([index, field]) => {
      const value = row[+index];
      if (value) {
        if (field === "price") {
          // Очищаем цену от лишних символов и парсим
          const cleanPrice = value.replace(/[^\d.,]/g, "").replace(",", ".");
          product[field] = parseFloat(cleanPrice) || 0;
        } else if (
          field === "name" ||
          field === "brand" ||
          field === "color" ||
          field === "country" ||
          field === "article"
        ) {
          product[field] = value;
        }
      }
    });

    return product;
  }

  private isValidProduct(product: Partial<Product>): boolean {
    return !!(product.name && product.brand && product.price !== undefined);
  }
}
