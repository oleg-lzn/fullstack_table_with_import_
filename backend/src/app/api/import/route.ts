import { NextRequest, NextResponse } from "next/server";
import { GoogleSheetsService } from "@/services/GoogleSheetsService";
import { SimpleProductService } from "@/services/SimpleProductService";
import { ImportResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, message: "Google Sheets URL is required" },
        { status: 400 }
      );
    }

    const googleSheetsService = new GoogleSheetsService();
    const productService = new SimpleProductService();

    // Extract spreadsheet ID from URL
    const spreadsheetId = googleSheetsService.extractSpreadsheetId(url);

    // Get data from Google Sheets
    const sheetData = await googleSheetsService.getSheetData(spreadsheetId);

    // Parse product data
    const products = googleSheetsService.parseProductData(sheetData.values);

    if (products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid products found in the spreadsheet",
        },
        { status: 400 }
      );
    }

    // Import products to database
    const result = await productService.importProducts(products);

    const response: ImportResult = {
      success: true,
      message: `Successfully imported ${result.imported} products`,
      importedCount: result.imported,
      errors: result.errors.length > 0 ? result.errors : undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Import error:", error);

    const response: ImportResult = {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      importedCount: 0,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
