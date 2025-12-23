export class Cart {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(id: string, userId: string): Cart {
        return new Cart(id, userId, new Date(), new Date());
    }
}

export class CartItem {
    constructor(
        public readonly id: string,
        public readonly cartId: string,
        public productId: string,
        public variantId: string | null,
        public quantity: number,
        public price: number,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        cartId: string,
        productId: string,
        price: number,
        quantity: number = 1,
        variantId: string | null = null
    ): CartItem {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        return new CartItem(
            id,
            cartId,
            productId,
            variantId,
            quantity,
            price,
            new Date(),
            new Date()
        );
    }

    updateQuantity(newQuantity: number): void {
        if (newQuantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        this.quantity = newQuantity;
        this.updatedAt = new Date();
    }

    getSubtotal(): number {
        return this.price * this.quantity;
    }
}
