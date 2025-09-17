import { NextRequest } from "next/server";
import { SimpleProductService } from "@/services/SimpleProductService";
import { createCorsResponse, createCorsOptionsResponse } from "@/utils/cors";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createCorsResponse(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const productService = new SimpleProductService();
    const product = await productService.getProductById(id);

    if (!product) {
      return createCorsResponse(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return createCorsResponse(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return createCorsResponse(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createCorsResponse(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const productService = new SimpleProductService();

    const product = await productService.updateProduct(id, body);

    if (!product) {
      return createCorsResponse(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return createCorsResponse(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return createCorsResponse(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createCorsResponse(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const productService = new SimpleProductService();
    const deleted = await productService.deleteProduct(id);

    if (!deleted) {
      return createCorsResponse(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return createCorsResponse({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return createCorsResponse(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return createCorsOptionsResponse();
}
