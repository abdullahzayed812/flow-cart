import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { Cart, CartItem } from '../../domain/entities/Cart';
import { Database } from '../database/Database';
import { RowDataPacket } from 'mysql2';

interface CartRow extends RowDataPacket {
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

interface CartItemRow extends RowDataPacket {
    id: string;
    cart_id: string;
    product_id: string;
    variant_id: string | null;
    quantity: number;
    price: number;
    created_at: Date;
    updated_at: Date;
}

export class CartRepository implements ICartRepository {
    constructor(private db: Database) { }

    async createCart(cart: Cart): Promise<void> {
        const sql = 'INSERT INTO carts (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)';
        await this.db.query(sql, [cart.id, cart.userId, cart.createdAt, cart.updatedAt]);
    }

    async findCartByUserId(userId: string): Promise<Cart | null> {
        const sql = 'SELECT * FROM carts WHERE user_id = ?';
        const rows = await this.db.query<CartRow[]>(sql, [userId]);
        return rows.length > 0 ? this.mapRowToCart(rows[0]) : null;
    }

    async addItem(item: CartItem): Promise<void> {
        const sql = `
      INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity, price, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await this.db.query(sql, [
            item.id,
            item.cartId,
            item.productId,
            item.variantId,
            item.quantity,
            item.price,
            item.createdAt,
            item.updatedAt
        ]);
    }

    async updateItem(item: CartItem): Promise<void> {
        const sql = 'UPDATE cart_items SET quantity = ?, updated_at = ? WHERE id = ?';
        await this.db.query(sql, [item.quantity, item.updatedAt, item.id]);
    }

    async removeItem(itemId: string): Promise<void> {
        const sql = 'DELETE FROM cart_items WHERE id = ?';
        await this.db.query(sql, [itemId]);
    }

    async getCartItems(cartId: string): Promise<CartItem[]> {
        const sql = 'SELECT * FROM cart_items WHERE cart_id = ?';
        const rows = await this.db.query<CartItemRow[]>(sql, [cartId]);
        return rows.map(row => this.mapRowToCartItem(row));
    }

    async clearCart(cartId: string): Promise<void> {
        const sql = 'DELETE FROM cart_items WHERE cart_id = ?';
        await this.db.query(sql, [cartId]);
    }

    async deleteCart(cartId: string): Promise<void> {
        await this.clearCart(cartId);
        const sql = 'DELETE FROM carts WHERE id = ?';
        await this.db.query(sql, [cartId]);
    }

    private mapRowToCart(row: CartRow): Cart {
        return new Cart(row.id, row.user_id, new Date(row.created_at), new Date(row.updated_at));
    }

    private mapRowToCartItem(row: CartItemRow): CartItem {
        return new CartItem(
            row.id,
            row.cart_id,
            row.product_id,
            row.variant_id,
            row.quantity,
            Number(row.price),
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }
}
