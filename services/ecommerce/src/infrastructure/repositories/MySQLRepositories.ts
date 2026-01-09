import { Pool } from 'mysql2/promise';
import { Cart, CartItem } from '../../domain/entities/Cart';
import { Order, OrderItem } from '../../domain/entities/Order';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { ICartRepository } from '../../domain/repositories/ICartRepository';

export class MySQLCartRepository implements ICartRepository {
    constructor(private pool: Pool) { }

    async findCartByUserId(userId: string): Promise<Cart | null> {
        const [rows] = await this.pool.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
        const carts = rows as any[];
        if (carts.length === 0) return null;

        const cartId = carts[0].id;
        // Cart constructor: (id, userId, createdAt, updatedAt)
        return new Cart(cartId, userId, new Date(carts[0].created_at), new Date(carts[0].updated_at));
    }

    async createCart(cart: Cart): Promise<void> {
        await this.pool.execute('INSERT INTO carts (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)', [
            cart.id, cart.userId, cart.createdAt, cart.updatedAt
        ]);
    }

    async addItem(cartItem: CartItem): Promise<void> {
        await this.pool.execute('INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
            cartItem.id, cartItem.cartId, cartItem.productId, cartItem.variantId, cartItem.quantity, cartItem.price, cartItem.createdAt, cartItem.updatedAt
        ]);
    }

    async getCartItems(cartId: string): Promise<CartItem[]> {
        const [rows] = await this.pool.execute('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);
        return (rows as any[]).map(i => new CartItem(i.id, i.cart_id, i.product_id, i.variant_id, i.quantity, Number(i.price), new Date(i.created_at), new Date(i.updated_at)));
    }

    async updateItem(item: CartItem): Promise<void> {
        await this.pool.execute(
            'UPDATE cart_items SET quantity = ?, updated_at = ? WHERE id = ?',
            [item.quantity, item.updatedAt, item.id]
        );
    }

    async removeItem(itemId: string): Promise<void> {
        await this.pool.execute('DELETE FROM cart_items WHERE id = ?', [itemId]);
    }

    async clearCart(cartId: string): Promise<void> {
        await this.pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    }

    async deleteCart(cartId: string): Promise<void> {
        await this.pool.execute('DELETE FROM carts WHERE id = ?', [cartId]);
    }
}

export class MySQLOrderRepository implements IOrderRepository {
    constructor(private pool: Pool) { }

    async create(order: Order): Promise<void> {
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute(
                'INSERT INTO orders (id, user_id, merchant_id, total_amount, status, payment_status, shipping_address, billing_address, payment_method, tracking_number, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [order.id, order.userId, order.merchantId, order.totalAmount, order.status, order.paymentStatus, order.shippingAddress, order.billingAddress, order.paymentMethod, order.trackingNumber, order.notes, order.createdAt, order.updatedAt]
            );

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    async addOrderItem(item: OrderItem): Promise<void> {
        await this.pool.execute(
            'INSERT INTO order_items (id, order_id, product_id, variant_id, quantity, price, subtotal, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [item.id, item.orderId, item.productId, item.variantId, item.quantity, item.price, item.subtotal, item.createdAt]
        );
    }

    async findById(id: string): Promise<Order | null> {
        const [rows] = await this.pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
        const orders = rows as any[];
        if (orders.length === 0) return null;
        const o = orders[0];
        return new Order(o.id, o.user_id, o.merchant_id, Number(o.total_amount), o.status, o.payment_status, o.shipping_address, o.billing_address, o.payment_method, o.tracking_number, o.notes, new Date(o.created_at), new Date(o.updated_at));
    }

    async findByUserId(userId: string): Promise<Order[]> {
        const [rows] = await this.pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        const orders = rows as any[];
        return orders.map(o => new Order(o.id, o.user_id, o.merchant_id, Number(o.total_amount), o.status, o.payment_status, o.shipping_address, o.billing_address, o.payment_method, o.tracking_number, o.notes, new Date(o.created_at), new Date(o.updated_at)));
    }

    async findByMerchantId(merchantId: string): Promise<Order[]> {
        const [rows] = await this.pool.execute('SELECT * FROM orders WHERE merchant_id = ? ORDER BY created_at DESC', [merchantId]);
        const orders = rows as any[];
        return orders.map(o => new Order(o.id, o.user_id, o.merchant_id, Number(o.total_amount), o.status, o.payment_status, o.shipping_address, o.billing_address, o.payment_method, o.tracking_number, o.notes, new Date(o.created_at), new Date(o.updated_at)));
    }

    async getOrderItems(orderId: string): Promise<OrderItem[]> {
        const [rows] = await this.pool.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
        return (rows as any[]).map(i => new OrderItem(i.id, i.order_id, i.product_id, i.variant_id, i.quantity, Number(i.price), Number(i.subtotal), new Date(i.created_at)));
    }

    async update(order: Order): Promise<void> {
        await this.pool.execute(
            'UPDATE orders SET status = ?, payment_status = ?, tracking_number = ?, notes = ?, updated_at = ? WHERE id = ?',
            [order.status, order.paymentStatus, order.trackingNumber, order.notes, order.updatedAt, order.id]
        );
    }
}
