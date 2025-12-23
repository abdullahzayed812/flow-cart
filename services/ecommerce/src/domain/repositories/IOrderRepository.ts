import { Order, OrderItem } from '../entities/Order';

export interface IOrderRepository {
    create(order: Order): Promise<void>;
    addOrderItem(item: OrderItem): Promise<void>;
    findById(id: string): Promise<Order | null>;
    findByUserId(userId: string): Promise<Order[]>;
    findByMerchantId(merchantId: string): Promise<Order[]>;
    getOrderItems(orderId: string): Promise<OrderItem[]>;
    update(order: Order): Promise<void>;
}
