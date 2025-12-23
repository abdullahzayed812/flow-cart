export class Inventory {
    constructor(
        public readonly id: string,
        public readonly productId: string,
        public readonly merchantId: string,
        public readonly variantId: string | null,
        public quantity: number,
        public reservedQuantity: number,
        public reorderLevel: number,
        public reorderQuantity: number,
        public warehouseLocation: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        productId: string,
        merchantId: string,
        quantity: number,
        variantId: string | null = null,
        reorderLevel: number = 10,
        reorderQuantity: number = 50,
        warehouseLocation: string | null = null
    ): Inventory {
        return new Inventory(
            id,
            productId,
            merchantId,
            variantId,
            quantity,
            0,
            reorderLevel,
            reorderQuantity,
            warehouseLocation,
            new Date(),
            new Date()
        );
    }

    getAvailableQuantity(): number {
        return this.quantity - this.reservedQuantity;
    }

    addStock(amount: number): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        this.quantity += amount;
        this.updatedAt = new Date();
    }

    deductStock(amount: number): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (this.getAvailableQuantity() < amount) {
            throw new Error('Insufficient available stock');
        }
        this.quantity -= amount;
        this.updatedAt = new Date();
    }

    reserveStock(amount: number): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (this.getAvailableQuantity() < amount) {
            throw new Error('Insufficient available stock for reservation');
        }
        this.reservedQuantity += amount;
        this.updatedAt = new Date();
    }

    releaseStock(amount: number): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (this.reservedQuantity < amount) {
            throw new Error('Cannot release more than reserved');
        }
        this.reservedQuantity -= amount;
        this.updatedAt = new Date();
    }

    confirmReservation(amount: number): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (this.reservedQuantity < amount) {
            throw new Error('Cannot confirm more than reserved');
        }
        this.reservedQuantity -= amount;
        this.quantity -= amount;
        this.updatedAt = new Date();
    }

    needsReorder(): boolean {
        return this.getAvailableQuantity() <= this.reorderLevel;
    }
}

export enum InventoryLogType {
    ADD = 'add',
    DEDUCT = 'deduct',
    RESERVE = 'reserve',
    RELEASE = 'release',
    ADJUSTMENT = 'adjustment'
}

export class InventoryLog {
    constructor(
        public readonly id: string,
        public readonly inventoryId: string,
        public readonly type: InventoryLogType,
        public readonly quantity: number,
        public readonly previousQuantity: number,
        public readonly newQuantity: number,
        public readonly referenceId: string | null,
        public readonly referenceType: string | null,
        public readonly notes: string | null,
        public readonly createdBy: string | null,
        public readonly createdAt: Date
    ) { }

    static create(
        id: string,
        inventoryId: string,
        type: InventoryLogType,
        quantity: number,
        previousQuantity: number,
        newQuantity: number,
        referenceId: string | null = null,
        referenceType: string | null = null,
        notes: string | null = null,
        createdBy: string | null = null
    ): InventoryLog {
        return new InventoryLog(
            id,
            inventoryId,
            type,
            quantity,
            previousQuantity,
            newQuantity,
            referenceId,
            referenceType,
            notes,
            createdBy,
            new Date()
        );
    }
}
