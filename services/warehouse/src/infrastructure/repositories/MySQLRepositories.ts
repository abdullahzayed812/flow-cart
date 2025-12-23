import { Pool } from 'mysql2/promise';
import { Product } from '../../core/entities/Product';
import { Stock } from '../../core/entities/Stock';

export class MySQLProductRepository {
    constructor(private pool: Pool) { }

    async create(product: Product): Promise<Product> {
        const query = `
      INSERT INTO products (id, category_id, name, description, price, sku, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await this.pool.execute(query, [
            product.id,
            product.categoryId,
            product.name,
            product.description,
            product.price,
            product.sku,
            product.createdAt,
            product.updatedAt
        ]);

        // Initialize stock
        await this.pool.execute('INSERT INTO stock (product_id, quantity) VALUES (?, 0)', [product.id]);

        return product;
    }

    async findAll(): Promise<Product[]> {
        const [rows] = await this.pool.execute('SELECT * FROM products');
        return (rows as any[]).map(r => new Product(r.id, r.category_id, r.name, r.description, parseFloat(r.price), r.sku, r.created_at, r.updated_at));
    }

    async findById(id: string): Promise<Product | null> {
        const [rows] = await this.pool.execute('SELECT * FROM products WHERE id = ?', [id]);
        const products = rows as any[];
        if (products.length === 0) return null;
        const r = products[0];
        return new Product(r.id, r.category_id, r.name, r.description, parseFloat(r.price), r.sku, r.created_at, r.updated_at);
    }
}

export class MySQLStockRepository {
    constructor(private pool: Pool) { }

    async getStock(productId: string): Promise<Stock | null> {
        const [rows] = await this.pool.execute('SELECT * FROM stock WHERE product_id = ?', [productId]);
        const stocks = rows as any[];
        if (stocks.length === 0) return null;
        const s = stocks[0];
        return new Stock(s.product_id, s.quantity, s.reserved, s.updated_at);
    }

    async updateStock(productId: string, quantity: number): Promise<void> {
        await this.pool.execute('UPDATE stock SET quantity = quantity + ? WHERE product_id = ?', [quantity, productId]);
        await this.pool.execute('INSERT INTO stock_movements (product_id, type, quantity, reason) VALUES (?, ?, ?, ?)', [
            productId,
            quantity > 0 ? 'IN' : 'OUT',
            Math.abs(quantity),
            'Manual Adjustment'
        ]);
    }
}
