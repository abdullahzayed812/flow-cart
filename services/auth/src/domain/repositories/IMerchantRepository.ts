import { Merchant } from '../entities/Merchant';

export interface IMerchantRepository {
    create(merchant: Merchant): Promise<void>;
    findById(id: string): Promise<Merchant | null>;
    findByUserId(userId: string): Promise<Merchant | null>;
    update(merchant: Merchant): Promise<void>;
    findPending(): Promise<Merchant[]>;
}
