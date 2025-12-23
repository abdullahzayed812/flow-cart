import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { UserRole } from '../../../../shared/types/enums';

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        if (!allowedRoles.includes(req.user.role as UserRole)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions'
                }
            });
        }

        next();
    };
};
