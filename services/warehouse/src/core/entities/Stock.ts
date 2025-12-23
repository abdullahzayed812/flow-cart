export class Stock {
    constructor(
        public productId: string,
        public quantity: number,
        public reserved: number,
        public updatedAt: Date
    ) {
        if (quantity < 0) throw new Error('Stock quantity cannot be negative');
        if (reserved < 0) throw new Error('Reserved stock cannot be negative');
    }

    get available(): number {
        return this.quantity - this.reserved;
    }
}
