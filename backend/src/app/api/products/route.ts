import { NextRequest, NextResponse } from "next/server";
import { SimpleProductService } from "@/services/SimpleProductService";
import { ProductFilters } from "@/types";

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

    if (searchParams.get("category")) {
      filters.category = searchParams.get("category")!;
    }

    if (searchParams.get("minPrice")) {
      filters.minPrice = parseFloat(searchParams.get("minPrice")!);
    }

    if (searchParams.get("maxPrice")) {
      filters.maxPrice = parseFloat(searchParams.get("maxPrice")!);
    }

    const productService = new SimpleProductService();
    const products = await productService.getAllProducts(filters);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
