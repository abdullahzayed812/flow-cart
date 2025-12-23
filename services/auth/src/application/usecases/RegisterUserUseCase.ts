import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { User } from '../../domain/entities/User';
import { Session } from '../../domain/entities/Session';
import { PasswordService } from '../../infrastructure/services/PasswordService';
import { JWTService, TokenPair } from '../../infrastructure/services/JWTService';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export class RegisterUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private sessionRepository: ISessionRepository
    ) { }

    async execute(dto: RegisterUserDTO, ipAddress?: string, userAgent?: string): Promise<TokenPair> {
        // Validate password
        const passwordValidation = PasswordService.validate(dto.password);
        if (!passwordValidation.valid) {
            throw new Error(passwordValidation.errors.join(', '));
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const passwordHash = await PasswordService.hash(dto.password);

        // Create user
        const user = User.create(
            uuidv4(),
            dto.email,
            passwordHash,
            dto.firstName,
            dto.lastName,
            dto.phone || null
        );

        await this.userRepository.create(user);

        // Generate tokens
        const tokens = JWTService.generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Create session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        const session = Session.create(
            uuidv4(),
            user.id,
            tokens.refreshToken,
            expiresAt,
            ipAddress,
            userAgent
        );

        await this.sessionRepository.create(session);

        return tokens;
    }
}
