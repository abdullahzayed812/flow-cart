import { OrderStatus, PaymentStatus } from '../../../../shared/types/enums';

export class Order {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly merchantId: string,
        public totalAmount: number,
        public status: OrderStatus,
        public paymentStatus: PaymentStatus,
        public shippingAddress: string,
        public billingAddress: string | null,
        public paymentMethod: string | null,
        public trackingNumber: string | null,
        public notes: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        userId: string,
        merchantId: string,
        totalAmount: number,
        shippingAddress: string,
        billingAddress: string | null = null
    ): Order {
        return new Order(
            id,
            userId,
            merchantId,
            totalAmount,
            OrderStatus.PENDING,
            PaymentStatus.PENDING,
            shippingAddress,
            billingAddress,
            null,
            null,
            null,
            new Date(),
            new Date()
        );
    }

    confirm(): void {
        this.status = OrderStatus.CONFIRMED;
        this.updatedAt = new Date();
    }

    markAsProcessing(): void {
        this.status = OrderStatus.PROCESSING;
        this.updatedAt = new Date();
    }

    ship(trackingNumber: string): void {
        this.status = OrderStatus.SHIPPED;
        this.trackingNumber = trackingNumber;
        this.updatedAt = new Date();
    }

    deliver(): void {
        this.status = OrderStatus.DELIVERED;
        this.updatedAt = new Date();
    }

    cancel(): void {
        if (this.status === OrderStatus.DELIVERED) {
            throw new Error('Cannot cancel delivered order');
        }
        this.status = OrderStatus.CANCELLED;
        this.updatedAt = new Date();
    }

    markPaymentCompleted(): void {
        this.paymentStatus = PaymentStatus.COMPLETED;
        this.updatedAt = new Date();
    }

    markPaymentFailed(): void {
        this.paymentStatus = PaymentStatus.FAILED;
        this.updatedAt = new Date();
    }

    refund(): void {
        this.status = OrderStatus.REFUNDED;
        this.paymentStatus = PaymentStatus.REFUNDED;
        this.updatedAt = new Date();
    }
}

export class OrderItem {
    constructor(
        public readonly id: string,
        public readonly orderId: string,
        public readonly productId: string,
        public readonly variantId: string | null,
        public readonly quantity: number,
        public readonly price: number,
        public readonly subtotal: number,
        public readonly createdAt: Date
    ) { }

    static create(
        id: string,
        orderId: string,
        productId: string,
        quantity: number,
        price: number,
        variantId: string | null = null
    ): OrderItem {
        const subtotal = price * quantity;
        return new OrderItem(
            id,
            orderId,
            productId,
            variantId,
            quantity,
            price,
            subtotal,
            new Date()
        );
    }
}
