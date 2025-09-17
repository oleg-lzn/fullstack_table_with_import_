import { Client } from "pg";
import { ProductFilters, Product } from "@/types";

export class SimpleProductService {
  private async getClient(): Promise<Client> {
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
    return client;
  }

  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    const client = await this.getClient();
    try {
      let query = "SELECT * FROM product";
      const conditions: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (filters?.search) {
        conditions.push(
          `(name ILIKE $${paramCount} OR brand ILIKE $${paramCount} OR color ILIKE $${paramCount} OR country ILIKE $${paramCount})`
        );
        values.push(`%${filters.search}%`);
        paramCount++;
      }

      if (filters?.brand) {
        conditions.push(`brand = $${paramCount}`);
        values.push(filters.brand);
        paramCount++;
      }

      if (filters?.color) {
        conditions.push(`color = $${paramCount}`);
        values.push(filters.color);
        paramCount++;
      }

      if (filters?.country) {
        conditions.push(`country = $${paramCount}`);
        values.push(filters.country);
        paramCount++;
      }

      if (filters?.minPrice !== undefined) {
        conditions.push(`price >= $${paramCount}`);
        values.push(filters.minPrice);
        paramCount++;
      }

      if (filters?.maxPrice !== undefined) {
        conditions.push(`price <= $${paramCount}`);
        values.push(filters.maxPrice);
        paramCount++;
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY created_at DESC";

      const result = await client.query(query, values);
      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        brand: row.brand,
        price: parseFloat(row.price),
        color: row.color,
        country: row.country,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } finally {
      await client.end();
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    const client = await this.getClient();
    try {
      const result = await client.query("SELECT * FROM product WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        brand: row.brand,
        price: parseFloat(row.price),
        color: row.color,
        country: row.country,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } finally {
      await client.end();
    }
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const client = await this.getClient();
    try {
      const { name, brand, price, color, country } = productData;
      const result = await client.query(
        "INSERT INTO product (name, brand, price, color, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, brand, price, color, country]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        brand: row.brand,
        price: parseFloat(row.price),
        color: row.color,
        country: row.country,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } finally {
      await client.end();
    }
  }

  async updateProduct(
    id: number,
    productData: Partial<Product>
  ): Promise<Product | null> {
    const client = await this.getClient();
    try {
      const { name, brand, price, color, country } = productData;
      const result = await client.query(
        "UPDATE product SET name = $1, brand = $2, price = $3, color = $4, country = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
        [name, brand, price, color, country, id]
      );

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        brand: row.brand,
        price: parseFloat(row.price),
        color: row.color,
        country: row.country,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } finally {
      await client.end();
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    const client = await this.getClient();
    try {
      const result = await client.query("DELETE FROM product WHERE id = $1", [
        id,
      ]);
      return result.rowCount !== 0;
    } finally {
      await client.end();
    }
  }

  async importProducts(
    products: Partial<Product>[]
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;

    for (const productData of products) {
      try {
        await this.createProduct(productData);
        imported++;
      } catch (error) {
        errors.push(`Failed to import product "${productData.name}": ${error}`);
      }
    }

    return { imported, errors };
  }
}
