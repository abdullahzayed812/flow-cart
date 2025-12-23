import { Request, Response } from 'express';
import { CheckoutUseCase } from '../../application/usecases/CheckoutUseCase';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export class OrderController {
    constructor(
        private checkoutUseCase: CheckoutUseCase,
        private orderRepository: IOrderRepository
    ) { }

    checkout = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const { shippingAddress, billingAddress, paymentMethod } = req.body;

            if (!shippingAddress) {
                res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Shipping address is required' } });
                return;
            }

            const orders = await this.checkoutUseCase.execute({
                userId: req.user.userId,
                shippingAddress,
                billingAddress,
                paymentMethod
            });

            res.status(201).json({ success: true, data: orders, message: `Created ${orders.length} order(s)` });
        } catch (error: any) {
            res.status(400).json({ success: false, error: { code: 'CHECKOUT_FAILED', message: error.message } });
        }
    };

    getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const orders = await this.orderRepository.findByUserId(req.user.userId);
            res.status(200).json({ success: true, data: orders });
        } catch (error: any) {
            res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
        }
    };

    getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const { id } = req.params;
            const order = await this.orderRepository.findById(id);

            if (!order) {
                res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
                return;
            }

            if (order.userId !== req.user.userId && req.user.role !== 'admin' && req.user.role !== 'merchant') {
                res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to view this order' } });
                return;
            }

            const items = await this.orderRepository.getOrderItems(id);
            res.status(200).json({ success: true, data: { ...order, items } });
        } catch (error: any) {
            res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
        }
    };

    cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
                return;
            }

            const { id } = req.params;
            const order = await this.orderRepository.findById(id);

            if (!order) {
                res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
                return;
            }

            if (order.userId !== req.user.userId) {
                res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to cancel this order' } });
                return;
            }

            order.cancel();
            await this.orderRepository.update(order);

            res.status(200).json({ success: true, data: order, message: 'Order cancelled successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: { code: 'CANCEL_FAILED', message: error.message } });
        }
    };
}
