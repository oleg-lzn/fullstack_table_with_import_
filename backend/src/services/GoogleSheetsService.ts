import { GoogleSheetsData, Product } from "@/types";
import Papa from "papaparse";

export class GoogleSheetsService {
  async getSheetData(
    spreadsheetId: string,
    range: string = "Sheet1!A:E"
  ): Promise<GoogleSheetsData> {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0&range=${range}`;

    if (!csvUrl) {
      throw new Error("Неверный URL Google Sheets");
    }

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
      range,
    };
  }

  extractSpreadsheetId(url: string): string {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) throw new Error("Неверный URL Google Sheets");
    return match[1];
  }

  parseProductData(values: string[][]): Partial<Product>[] {
    if (!values?.length || values.length < 2) {
      throw new Error("Нет данных в таблице");
    }

    const [headers, ...dataRows] = values;
    const fieldMap = this.createFieldMapping(headers);

    return dataRows
      .filter((row) => row.length && row[0]?.trim())
      .map((row) => this.mapRowToProduct(row, fieldMap))
      .filter((product) => this.isValidProduct(product));
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
      brand: "brand",
      бренд: "brand",
      price: "price",
      цена: "price",
      description: "description",
      описание: "description",
      category: "category",
      категория: "category",
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
          product[field] = parseFloat(value) || 0;
        } else if (
          field === "name" ||
          field === "brand" ||
          field === "description" ||
          field === "category"
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
