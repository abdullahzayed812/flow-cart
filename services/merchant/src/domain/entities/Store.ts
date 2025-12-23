export class Store {
    constructor(
        public readonly id: string,
        public readonly merchantId: string,
        public storeName: string,
        public storeDescription: string | null,
        public storeLogo: string | null,
        public storeBanner: string | null,
        public contactEmail: string,
        public contactPhone: string,
        public address: string | null,
        public isActive: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        merchantId: string,
        storeName: string,
        contactEmail: string,
        contactPhone: string,
        storeDescription: string | null = null,
        address: string | null = null
    ): Store {
        return new Store(
            id,
            merchantId,
            storeName,
            storeDescription,
            null,
            null,
            contactEmail,
            contactPhone,
            address,
            true,
            new Date(),
            new Date()
        );
    }

    updateDetails(
        storeName: string,
        storeDescription: string | null,
        contactEmail: string,
        contactPhone: string,
        address: string | null
    ): void {
        this.storeName = storeName;
        this.storeDescription = storeDescription;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.address = address;
        this.updatedAt = new Date();
    }

    updateLogo(logoUrl: string): void {
        this.storeLogo = logoUrl;
        this.updatedAt = new Date();
    }

    updateBanner(bannerUrl: string): void {
        this.storeBanner = bannerUrl;
        this.updatedAt = new Date();
    }

    activate(): void {
        this.isActive = true;
        this.updatedAt = new Date();
    }

    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }
}

export enum PayoutStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export class Payout {
    constructor(
        public readonly id: string,
        public readonly merchantId: string,
        public amount: number,
        public status: PayoutStatus,
        public paymentMethod: string | null,
        public transactionId: string | null,
        public readonly requestedAt: Date,
        public processedAt: Date | null,
        public notes: string | null
    ) { }

    static create(id: string, merchantId: string, amount: number): Payout {
        return new Payout(
            id,
            merchantId,
            amount,
            PayoutStatus.PENDING,
            null,
            null,
            new Date(),
            null,
            null
        );
    }

    markAsProcessing(): void {
        this.status = PayoutStatus.PROCESSING;
    }

    complete(transactionId: string): void {
        this.status = PayoutStatus.COMPLETED;
        this.transactionId = transactionId;
        this.processedAt = new Date();
    }

    fail(reason: string): void {
        this.status = PayoutStatus.FAILED;
        this.notes = reason;
        this.processedAt = new Date();
    }
}
