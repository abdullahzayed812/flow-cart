import { Pool } from 'mysql2/promise';
import { Cart, CartItem } from '../../core/entities/Cart';
import { Order, OrderItem } from '../../core/entities/Order';

export class MySQLCartRepository {
    constructor(private pool: Pool) { }

    async getByUserId(userId: string): Promise<Cart | null> {
        const [rows] = await this.pool.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
        const carts = rows as any[];
        if (carts.length === 0) return null;

        const cartId = carts[0].id;
        const [items] = await this.pool.execute('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);

        const cartItems = (items as any[]).map(i => new CartItem(i.product_id, i.quantity));
        return new Cart(cartId, userId, cartItems);
    }

    async create(cart: Cart): Promise<void> {
        await this.pool.execute('INSERT INTO carts (id, user_id) VALUES (?, ?)', [cart.id, cart.userId]);
    }

    async addItem(cartId: string, item: CartItem): Promise<void> {
        await this.pool.execute('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [
            cartId, item.productId, item.quantity
        ]);
    }
}

export class MySQLOrderRepository {
    constructor(private pool: Pool) { }

    async create(order: Order): Promise<void> {
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute(
                'INSERT INTO orders (id, user_id, total_amount, status, created_at) VALUES (?, ?, ?, ?, ?)',
                [order.id, order.userId, order.totalAmount, order.status, order.createdAt]
            );

            for (const item of order.items) {
                await conn.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                    [order.id, item.productId, item.quantity, item.priceAtPurchase]
                );
            }

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}
