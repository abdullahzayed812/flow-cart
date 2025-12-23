import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { Database } from '../database/Database';
import { RowDataPacket } from 'mysql2';

interface ProductRow extends RowDataPacket {
    id: string;
    merchant_id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}

export class ProductRepository implements IProductRepository {
    constructor(private db: Database) { }

    async create(product: Product): Promise<void> {
        const sql = `
      INSERT INTO products (id, merchant_id, name, description, price, category, sku, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await this.db.query(sql, [
            product.id,
            product.merchantId,
            product.name,
            product.description,
            product.price,
            product.category,
            product.sku,
            product.isActive ? 1 : 0,
            product.createdAt,
            product.updatedAt
        ]);
    }

    async findById(id: string): Promise<Product | null> {
        const sql = 'SELECT * FROM products WHERE id = ?';
        const rows = await this.db.query<ProductRow[]>(sql, [id]);
        return rows.length > 0 ? this.mapRowToProduct(rows[0]) : null;
    }

    async findByMerchant(merchantId: string): Promise<Product[]> {
        const sql = 'SELECT * FROM products WHERE merchant_id = ? ORDER BY created_at DESC';
        const rows = await this.db.query<ProductRow[]>(sql, [merchantId]);
        return rows.map(row => this.mapRowToProduct(row));
    }

    async findBySku(sku: string): Promise<Product | null> {
        const sql = 'SELECT * FROM products WHERE sku = ?';
        const rows = await this.db.query<ProductRow[]>(sql, [sku]);
        return rows.length > 0 ? this.mapRowToProduct(rows[0]) : null;
    }

    async findAll(limit: number = 50, offset: number = 0): Promise<Product[]> {
        const sql = 'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
        const rows = await this.db.query<ProductRow[]>(sql, [limit, offset]);
        return rows.map(row => this.mapRowToProduct(row));
    }

    async findByCategory(category: string, limit: number = 50, offset: number = 0): Promise<Product[]> {
        const sql = 'SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
        const rows = await this.db.query<ProductRow[]>(sql, [category, limit, offset]);
        return rows.map(row => this.mapRowToProduct(row));
    }

    async update(product: Product): Promise<void> {
        const sql = `
      UPDATE products 
      SET merchant_id = ?, name = ?, description = ?, price = ?, category = ?, 
          sku = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `;
        await this.db.query(sql, [
            product.merchantId,
            product.name,
            product.description,
            product.price,
            product.category,
            product.sku,
            product.isActive ? 1 : 0,
            product.updatedAt,
            product.id
        ]);
    }

    async delete(id: string): Promise<void> {
        const sql = 'DELETE FROM products WHERE id = ?';
        await this.db.query(sql, [id]);
    }

    async search(query: string, limit: number = 50, offset: number = 0): Promise<Product[]> {
        const sql = `
      SELECT * FROM products 
      WHERE (name LIKE ? OR description LIKE ? OR category LIKE ?) AND is_active = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
        const searchTerm = `%${query}%`;
        const rows = await this.db.query<ProductRow[]>(sql, [searchTerm, searchTerm, searchTerm, limit, offset]);
        return rows.map(row => this.mapRowToProduct(row));
    }

    private mapRowToProduct(row: ProductRow): Product {
        return new Product(
            row.id,
            row.merchant_id,
            row.name,
            row.description,
            Number(row.price),
            row.category,
            row.sku,
            row.is_active === 1,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }
}
