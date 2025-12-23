import { Request, Response } from 'express';
import { AddToCartUseCase } from '../../application/usecases/AddToCartUseCase';
import { ICartRepository } from '../../domain/repositories/ICartRepository';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export class CartController {
    constructor(
        private addToCartUseCase: AddToCartUseCase,
        private cartRepository: ICartRepository
    ) { }

    addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const { productId, quantity, variantId } = req.body;

            if (!productId || !quantity) {
                res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Product ID and quantity are required' } });
                return;
            }

            const cartItem = await this.addToCartUseCase.execute({
                userId: req.user.userId,
                productId,
                quantity: parseInt(quantity),
                variantId
            });

            res.status(200).json({ success: true, data: cartItem });
        } catch (error: any) {
            res.status(400).json({ success: false, error: { code: 'ADD_TO_CART_FAILED', message: error.message } });
        }
    };

    getCart = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const cart = await this.cartRepository.findCartByUserId(req.user.userId);
            if (!cart) {
                res.status(200).json({ success: true, data: { items: [], total: 0 } });
                return;
            }

            const items = await this.cartRepository.getCartItems(cart.id);
            const total = items.reduce((sum, item) => sum + item.getSubtotal(), 0);

            res.status(200).json({ success: true, data: { items, total } });
        } catch (error: any) {
            res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
        }
    };

    removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const { itemId } = req.body;

            if (!itemId) {
                res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Item ID is required' } });
                return;
            }

            await this.cartRepository.removeItem(itemId);
            res.status(200).json({ success: true, message: 'Item removed from cart' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: { code: 'REMOVE_FAILED', message: error.message } });
        }
    };

    clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const cart = await this.cartRepository.findCartByUserId(req.user.userId);
            if (cart) {
                await this.cartRepository.clearCart(cart.id);
            }

            res.status(200).json({ success: true, message: 'Cart cleared' });
        } catch (error: any) {
            res.status(500).json({ success: false, error: { code: 'CLEAR_FAILED', message: error.message } });
        }
    };
}
