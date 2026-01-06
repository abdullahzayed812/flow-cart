import { Router } from 'express';
// import { ProductController } from '../controllers/ProductController';
import { CartController } from '../controllers/CartController';
import { OrderController } from '../controllers/OrderController';

// Auth middleware will be imported from auth service or shared
const authMiddleware = (req: any, res: any, next: any) => next(); // Placeholder

export function createEcommerceRoutes(
    // productController: ProductController,
    cartController: CartController,
    orderController: OrderController
): Router {
    const router = Router();

    // // Product routes
    // router.post('/products', authMiddleware, productController.createProduct);
    // router.get('/products', productController.getProducts);
    // router.get('/products/:id', productController.getProduct);
    // router.put('/products/:id', authMiddleware, productController.updateProduct);
    // router.delete('/products/:id', authMiddleware, productController.deleteProduct);

    // Cart routes
    router.post('/cart/add', authMiddleware, cartController.addToCart);
    router.get('/cart', authMiddleware, cartController.getCart);
    router.post('/cart/remove', authMiddleware, cartController.removeFromCart);
    router.post('/cart/clear', authMiddleware, cartController.clearCart);

    // Order routes
    router.post('/checkout', authMiddleware, orderController.checkout);
    router.get('/orders', authMiddleware, orderController.getOrders);
    router.get('/orders/:id', authMiddleware, orderController.getOrder);
    router.post('/orders/:id/cancel', authMiddleware, orderController.cancelOrder);

    return router;
}
