import { NextRequest } from "next/server";
import { SimpleProductService } from "@/services/SimpleProductService";
import { ProductFilters } from "@/types";
import { createCorsResponse, createCorsOptionsResponse } from "@/utils/cors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const filters: ProductFilters = {};

    if (searchParams.get("search")) {
      filters.search = searchParams.get("search")!;
    }

    if (searchParams.get("brand")) {
      filters.brand = searchParams.get("brand")!;
    }

    if (searchParams.get("color")) {
      filters.color = searchParams.get("color")!;
    }

    if (searchParams.get("country")) {
      filters.country = searchParams.get("country")!;
    }

    if (searchParams.get("minPrice")) {
      filters.minPrice = parseFloat(searchParams.get("minPrice")!);
    }

    if (searchParams.get("maxPrice")) {
      filters.maxPrice = parseFloat(searchParams.get("maxPrice")!);
    }

    const productService = new SimpleProductService();
    const products = await productService.getAllProducts(filters);

    return createCorsResponse(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return createCorsResponse(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productService = new SimpleProductService();

    const product = await productService.createProduct(body);

    return createCorsResponse(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return createCorsResponse(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return createCorsOptionsResponse();
}
