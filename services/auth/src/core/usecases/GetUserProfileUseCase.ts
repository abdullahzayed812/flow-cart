import { IUserRepository } from '../../domain/repositories/IUserRepository';

export interface UserProfileDTO {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    emailVerified: boolean;
    createdAt: Date;
}

export class GetUserProfileUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<UserProfileDTO> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt
        };
    }
}
