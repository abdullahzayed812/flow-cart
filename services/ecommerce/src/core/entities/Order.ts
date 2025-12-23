export class Order {
    constructor(
        public id: string,
        public userId: string,
        public totalAmount: number,
        public status: string,
        public items: OrderItem[],
        public createdAt: Date
    ) { }
}

export class OrderItem {
    constructor(
        public productId: string,
        public quantity: number,
        public priceAtPurchase: number
    ) { }
}
