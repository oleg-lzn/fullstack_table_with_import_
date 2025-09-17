import { Client } from "pg";
import { createCorsResponse, createCorsOptionsResponse } from "@/utils/cors";

export async function GET() {
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_HOST?.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : false,
    });

    await client.connect();

    const result = await client.query("SELECT COUNT(*) FROM product");
    await client.end();

    return createCorsResponse({
      message: "Database connection successful",
      productCount: result.rows[0].count,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return createCorsResponse(
      {
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return createCorsOptionsResponse();
}
