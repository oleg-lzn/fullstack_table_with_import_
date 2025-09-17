import { NextRequest } from "next/server";
import { GoogleSheetsService } from "@/services/GoogleSheetsService";
import { SimpleProductService } from "@/services/SimpleProductService";
import { ImportResult } from "@/types";
import { createCorsResponse, createCorsOptionsResponse } from "@/utils/cors";

export async function importProductsFromGoogleSheets(request: NextRequest) {
  console.log("Starting Google Sheets import...");

  try {
    const body = await request.json();
    const { url } = body;

    console.log("Import URL:", url);

    if (!url) {
      console.error("No URL provided");
      return createCorsResponse(
        {
          success: false,
          message: "Google Sheets URL обязателен",
          importedCount: 0,
        },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!url.includes("docs.google.com/spreadsheets")) {
      console.error("Invalid URL format:", url);
      return createCorsResponse(
        {
          success: false,
          message: "Неверный формат URL. Используйте ссылку Google Sheets",
          importedCount: 0,
        },
        { status: 400 }
      );
    }

    const googleSheetsService = new GoogleSheetsService();
    const productService = new SimpleProductService();

    // Extract spreadsheet ID and GID from URL
    console.log("Extracting spreadsheet ID...");
    const spreadsheetId = googleSheetsService.extractSpreadsheetId(url);
    const gid = googleSheetsService.extractGid(url);

    console.log(`Spreadsheet ID: ${spreadsheetId}, GID: ${gid}`);

    // Get data from Google Sheets
    console.log("Fetching data from Google Sheets...");
    const sheetData = await googleSheetsService.getSheetData(
      spreadsheetId,
      gid
    );

    if (!sheetData.values || sheetData.values.length === 0) {
      console.error("No data received from Google Sheets");
      return createCorsResponse(
        {
          success: false,
          message: "Таблица пуста или недоступна",
          importedCount: 0,
        },
        { status: 400 }
      );
    }

    console.log(`Received ${sheetData.values.length} rows from Google Sheets`);

    // Parse product data
    console.log("Parsing product data...");
    console.log("First few rows:", sheetData.values.slice(0, 3));
    const products = googleSheetsService.parseProductData(sheetData.values);
    console.log("Parsed products sample:", products.slice(0, 2));

    if (products.length === 0) {
      console.error("No valid products found after parsing");
      return createCorsResponse(
        {
          success: false,
          message:
            "В таблице не найдено валидных продуктов. Убедитесь, что есть колонки: название, бренд, цена",
          importedCount: 0,
        },
        { status: 400 }
      );
    }

    console.log(`Found ${products.length} valid products to import`);

    // Import products to database
    console.log("Importing products to database...");
    const result = await productService.importProducts(products);

    console.log(
      `Import completed. Imported: ${result.imported}, Errors: ${result.errors.length}`
    );

    const response: ImportResult = {
      success: true,
      message: `Успешно импортировано ${result.imported} продуктов`,
      importedCount: result.imported,
      errors: result.errors.length > 0 ? result.errors : undefined,
    };

    return createCorsResponse(response);
  } catch (error) {
    console.error("Import error:", error);

    let errorMessage = "Произошла неизвестная ошибка";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // Determine appropriate status code based on error type
      if (
        errorMessage.includes("Неверный URL") ||
        errorMessage.includes("Invalid URL") ||
        errorMessage.includes("Нет данных") ||
        errorMessage.includes("пуста")
      ) {
        statusCode = 400;
      } else if (
        errorMessage.includes("недоступна") ||
        errorMessage.includes("Ошибка загрузки") ||
        errorMessage.includes("403") ||
        errorMessage.includes("404")
      ) {
        statusCode = 403;
      }
    }

    const response: ImportResult = {
      success: false,
      message: errorMessage,
      importedCount: 0,
    };

    return createCorsResponse(response, { status: statusCode });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return createCorsOptionsResponse();
}

export { importProductsFromGoogleSheets as POST };
