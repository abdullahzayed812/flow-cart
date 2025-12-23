import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Database } from './infrastructure/database/Database';
import { ProductRepository } from './infrastructure/repositories/ProductRepository';
import { CartRepository } from './infrastructure/repositories/CartRepository';
import { OrderRepository } from './infrastructure/repositories/OrderRepository';
import { CreateProductUseCase } from './application/usecases/CreateProductUseCase';
import { AddToCartUseCase } from './application/usecases/AddToCartUseCase';
import { CheckoutUseCase } from './application/usecases/CheckoutUseCase';
import { ProductController } from './presentation/controllers/ProductController';
import { CartController } from './presentation/controllers/CartController';
import { OrderController } from './presentation/controllers/OrderController';
import { createEcommerceRoutes } from './presentation/routes/ecommerceRoutes';

dotenv.config();

class EcommerceService {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '4002');
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        const db = Database.getInstance();

        // Initialize repositories
        const productRepository = new ProductRepository(db);
        const cartRepository = new CartRepository(db);
        const orderRepository = new OrderRepository(db);

        // Initialize use cases
        const createProductUseCase = new CreateProductUseCase(productRepository);
        const addToCartUseCase = new AddToCartUseCase(cartRepository, productRepository);
        const checkoutUseCase = new CheckoutUseCase(cartRepository, orderRepository, productRepository);

        // Initialize controllers
        const productController = new ProductController(createProductUseCase, productRepository);
        const cartController = new CartController(addToCartUseCase, cartRepository);
        const orderController = new OrderController(checkoutUseCase, orderRepository);

        // Setup routes
        this.app.use('/store', createEcommerceRoutes(productController, cartController, orderController));

        // Health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok', service: 'ecommerce' });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Route not found' }
            });
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`🛍️  E-Commerce Service running on port ${this.port}`);
        });
    }
}

const ecommerceService = new EcommerceService();
ecommerceService.start();
