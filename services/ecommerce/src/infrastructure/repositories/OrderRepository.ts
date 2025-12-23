import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order, OrderItem } from '../../domain/entities/Order';
import { Database } from '../database/Database';
import { OrderStatus, PaymentStatus } from '../../../../shared/types/enums';
import { RowDataPacket } from 'mysql2';

interface OrderRow extends RowDataPacket {
    id: string;
    user_id: string;
    merchant_id: string;
    total_amount: number;
    status: string;
    payment_status: string;
    shipping_address: string;
    billing_address: string | null;
    payment_method: string | null;
    tracking_number: string | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

interface OrderItemRow extends RowDataPacket {
    id: string;
    order_id: string;
    product_id: string;
    variant_id: string | null;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: Date;
}

export class OrderRepository implements IOrderRepository {
    constructor(private db: Database) { }

    async create(order: Order): Promise<void> {
        const sql = `
      INSERT INTO orders (id, user_id, merchant_id, total_amount, status, payment_status, 
                         shipping_address, billing_address, payment_method, tracking_number, 
                         notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await this.db.query(sql, [
            order.id,
            order.userId,
            order.merchantId,
            order.totalAmount,
            order.status,
            order.paymentStatus,
            order.shippingAddress,
            order.billingAddress,
            order.paymentMethod,
            order.trackingNumber,
            order.notes,
            order.createdAt,
            order.updatedAt
        ]);
    }

    async addOrderItem(item: OrderItem): Promise<void> {
        const sql = `
      INSERT INTO order_items (id, order_id, product_id, variant_id, quantity, price, subtotal, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await this.db.query(sql, [
            item.id,
            item.orderId,
            item.productId,
            item.variantId,
            item.quantity,
            item.price,
            item.subtotal,
            item.createdAt
        ]);
    }

    async findById(id: string): Promise<Order | null> {
        const sql = 'SELECT * FROM orders WHERE id = ?';
        const rows = await this.db.query<OrderRow[]>(sql, [id]);
        return rows.length > 0 ? this.mapRowToOrder(rows[0]) : null;
    }

    async findByUserId(userId: string): Promise<Order[]> {
        const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
        const rows = await this.db.query<OrderRow[]>(sql, [userId]);
        return rows.map(row => this.mapRowToOrder(row));
    }

    async findByMerchantId(merchantId: string): Promise<Order[]> {
        const sql = 'SELECT * FROM orders WHERE merchant_id = ? ORDER BY created_at DESC';
        const rows = await this.db.query<OrderRow[]>(sql, [merchantId]);
        return rows.map(row => this.mapRowToOrder(row));
    }

    async getOrderItems(orderId: string): Promise<OrderItem[]> {
        const sql = 'SELECT * FROM order_items WHERE order_id = ?';
        const rows = await this.db.query<OrderItemRow[]>(sql, [orderId]);
        return rows.map(row => this.mapRowToOrderItem(row));
    }

    async update(order: Order): Promise<void> {
        const sql = `
      UPDATE orders 
      SET status = ?, payment_status = ?, tracking_number = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `;
        await this.db.query(sql, [
            order.status,
            order.paymentStatus,
            order.trackingNumber,
            order.notes,
            order.updatedAt,
            order.id
        ]);
    }

    private mapRowToOrder(row: OrderRow): Order {
        return new Order(
            row.id,
            row.user_id,
            row.merchant_id,
            Number(row.total_amount),
            row.status as OrderStatus,
            row.payment_status as PaymentStatus,
            row.shipping_address,
            row.billing_address,
            row.payment_method,
            row.tracking_number,
            row.notes,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    private mapRowToOrderItem(row: OrderItemRow): OrderItem {
        return new OrderItem(
            row.id,
            row.order_id,
            row.product_id,
            row.variant_id,
            row.quantity,
            Number(row.price),
            Number(row.subtotal),
            new Date(row.created_at)
        );
    }
}
