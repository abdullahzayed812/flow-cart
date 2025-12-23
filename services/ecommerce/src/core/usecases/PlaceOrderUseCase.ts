import { v4 as uuidv4 } from 'uuid';
import { MySQLOrderRepository, MySQLCartRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { IWarehouseService } from '../interfaces/IWarehouseService';
import { Order, OrderItem } from '../entities/Order';
import { AppError } from '@flow-cart/shared';

export class PlaceOrderUseCase {
    constructor(
        private orderRepo: MySQLOrderRepository,
        private cartRepo: MySQLCartRepository,
        private warehouseService: IWarehouseService
    ) { }

    async execute(userId: string): Promise<Order> {
        const cart = await this.cartRepo.getByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw new AppError('Cart is empty', 400);
        }

        let totalAmount = 0;
        const orderItems: OrderItem[] = [];

        for (const item of cart.items) {
            const stock = await this.warehouseService.checkStock(item.productId);
            if (stock < item.quantity) {
                throw new AppError(`Insufficient stock for product ${item.productId}`, 400);
            }

            // Reserve stock
            const reserved = await this.warehouseService.reserveStock(item.productId, item.quantity);
            if (!reserved) {
                throw new AppError('Failed to reserve stock', 500);
            }

            // Mock price fetching
            const price = 10.00;
            totalAmount += price * item.quantity;
            orderItems.push(new OrderItem(item.productId, item.quantity, price));
        }

        const order = new Order(
            uuidv4(),
            userId,
            totalAmount,
            'PENDING',
            orderItems,
            new Date()
        );

        await this.orderRepo.create(order);

        // TODO: Clear cart

        return order;
    }
}
