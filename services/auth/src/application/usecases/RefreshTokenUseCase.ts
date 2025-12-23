import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { JWTService, TokenPair } from '../../infrastructure/services/JWTService';
import { Session } from '../../domain/entities/Session';
import { v4 as uuidv4 } from 'uuid';

export class RefreshTokenUseCase {
    constructor(
        private userRepository: IUserRepository,
        private sessionRepository: ISessionRepository
    ) { }

    async execute(refreshToken: string, ipAddress?: string, userAgent?: string): Promise<TokenPair> {
        // Verify refresh token
        let payload;
        try {
            payload = JWTService.verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }

        // Find session
        const session = await this.sessionRepository.findByRefreshToken(refreshToken);
        if (!session) {
            throw new Error('Session not found');
        }

        // Check if session is expired
        if (session.isExpired()) {
            await this.sessionRepository.delete(session.id);
            throw new Error('Session expired');
        }

        // Find user
        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Generate new tokens
        const tokens = JWTService.generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Delete old session
        await this.sessionRepository.delete(session.id);

        // Create new session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        const newSession = Session.create(
            uuidv4(),
            user.id,
            tokens.refreshToken,
            expiresAt,
            ipAddress,
            userAgent
        );

        await this.sessionRepository.create(newSession);

        return tokens;
    }
}
