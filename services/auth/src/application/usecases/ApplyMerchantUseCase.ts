import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { Merchant } from '../../domain/entities/Merchant';
import { UserRole } from '../../../../shared/types/enums';
import { v4 as uuidv4 } from 'uuid';

export interface ApplyMerchantDTO {
    userId: string;
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress?: string;
    taxId?: string;
}

export class ApplyMerchantUseCase {
    constructor(
        private userRepository: IUserRepository,
        private merchantRepository: IMerchantRepository
    ) { }

    async execute(dto: ApplyMerchantDTO): Promise<Merchant> {
        // Check if user exists
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if user is already a merchant
        const existingMerchant = await this.merchantRepository.findByUserId(dto.userId);
        if (existingMerchant) {
            throw new Error('User already has a merchant account');
        }

        // Create merchant
        const merchant = Merchant.create(
            uuidv4(),
            dto.userId,
            dto.businessName,
            dto.businessEmail,
            dto.businessPhone,
            dto.businessAddress || null,
            dto.taxId || null
        );

        await this.merchantRepository.create(merchant);

        // Update user role to merchant (pending approval)
        user.role = UserRole.MERCHANT;
        await this.userRepository.update(user);

        return merchant;
    }
}
