import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../infrastructure/services/JWTService';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'No token provided'
                }
            });
        }

        const token = authHeader.substring(7);

        try {
            const payload = JWTService.verifyAccessToken(token);
            req.user = payload;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired token'
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Internal server error'
            }
        });
    }
};
