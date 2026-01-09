import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { WarehouseClient } from '../../infrastructure/clients/WarehouseClient';
import { Order, OrderItem } from '../../domain/entities/Order';
import { v4 as uuidv4 } from 'uuid';

export interface CheckoutDTO {
    userId: string;
    shippingAddress: string;
    billingAddress?: string;
    paymentMethod?: string;
}

interface MerchantOrder {
    merchantId: string;
    items: Array<{
        productId: string;
        variantId: string | null;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
}

export class CheckoutUseCase {
    constructor(
        private cartRepository: ICartRepository,
        private orderRepository: IOrderRepository,
        private warehouseClient: WarehouseClient
    ) { }

    async execute(dto: CheckoutDTO): Promise<Order[]> {
        // Get user's cart
        const cart = await this.cartRepository.findCartByUserId(dto.userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const cartItems = await this.cartRepository.getCartItems(cart.id);
        if (cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        // Group items by merchant
        const merchantOrders = await this.groupItemsByMerchant(cartItems);

        // Create orders for each merchant
        const orders: Order[] = [];
        for (const merchantOrder of merchantOrders) {
            const order = Order.create(
                uuidv4(),
                dto.userId,
                merchantOrder.merchantId,
                merchantOrder.totalAmount,
                dto.shippingAddress,
                dto.billingAddress || null
            );

            if (dto.paymentMethod) {
                order.paymentMethod = dto.paymentMethod;
            }

            await this.orderRepository.create(order);

            // Add order items
            for (const item of merchantOrder.items) {
                const orderItem = OrderItem.create(
                    uuidv4(),
                    order.id,
                    item.productId,
                    item.quantity,
                    item.price,
                    item.variantId
                );
                await this.orderRepository.addOrderItem(orderItem);
            }

            orders.push(order);
        }

        // Clear cart after successful checkout
        await this.cartRepository.clearCart(cart.id);

        return orders;
    }

    private async groupItemsByMerchant(cartItems: any[]): Promise<MerchantOrder[]> {
        const merchantMap = new Map<string, MerchantOrder>();

        for (const item of cartItems) {
            const product = await this.warehouseClient.getProduct(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (!product.isActive) {
                throw new Error(`Product ${product.name} is no longer available`);
            }

            const merchantId = product.merchantId;

            if (!merchantMap.has(merchantId)) {
                merchantMap.set(merchantId, {
                    merchantId,
                    items: [],
                    totalAmount: 0
                });
            }

            const merchantOrder = merchantMap.get(merchantId)!;
            merchantOrder.items.push({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price
            });
            merchantOrder.totalAmount += item.price * item.quantity;
        }

        return Array.from(merchantMap.values());
    }
}
