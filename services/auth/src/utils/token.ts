import jwt from 'jsonwebtoken';

export class TokenService {
    static generateAccess(userId: string, role: string): string {
        return jwt.sign(
            { userId, role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '15m' }
        );
    }

    static generateRefresh(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET || 'refresh_secret',
            { expiresIn: '7d' }
        );
    }
}
