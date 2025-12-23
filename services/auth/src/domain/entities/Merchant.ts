import { MerchantStatus } from '../../../../shared/types/enums';

export class Merchant {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public businessName: string,
        public businessEmail: string,
        public businessPhone: string,
        public businessAddress: string | null,
        public taxId: string | null,
        public status: MerchantStatus,
        public rejectionReason: string | null,
        public approvedAt: Date | null,
        public approvedBy: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        userId: string,
        businessName: string,
        businessEmail: string,
        businessPhone: string,
        businessAddress: string | null = null,
        taxId: string | null = null
    ): Merchant {
        return new Merchant(
            id,
            userId,
            businessName,
            businessEmail,
            businessPhone,
            businessAddress,
            taxId,
            MerchantStatus.PENDING,
            null,
            null,
            null,
            new Date(),
            new Date()
        );
    }

    approve(approvedBy: string): void {
        this.status = MerchantStatus.APPROVED;
        this.approvedAt = new Date();
        this.approvedBy = approvedBy;
        this.rejectionReason = null;
        this.updatedAt = new Date();
    }

    reject(reason: string): void {
        this.status = MerchantStatus.REJECTED;
        this.rejectionReason = reason;
        this.updatedAt = new Date();
    }

    suspend(): void {
        this.status = MerchantStatus.SUSPENDED;
        this.updatedAt = new Date();
    }

    reactivate(): void {
        this.status = MerchantStatus.APPROVED;
        this.updatedAt = new Date();
    }
}
