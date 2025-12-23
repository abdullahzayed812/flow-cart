import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

export function createAuthRoutes(authController: AuthController): Router {
    const router = Router();

    // Public routes
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.post('/refresh', authController.refresh);

    // Protected routes
    router.get('/me', authMiddleware, authController.getProfile);
    router.post('/merchant/apply', authMiddleware, authController.applyMerchant);

    return router;
}
