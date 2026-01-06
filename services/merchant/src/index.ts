import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Database } from './infrastructure/database/Database';
import { requestLogger } from '@flow-cart/shared';

dotenv.config();

class MerchantService {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '4005');
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(requestLogger);
        this.app.use(express.json());
    }

    private setupRoutes(): void {
        const db = Database.getInstance();

        // Store management endpoints
        this.app.post('/store', async (req, res) => {
            res.status(201).json({ success: true, message: 'Store created' });
        });

        this.app.get('/store', async (req, res) => {
            res.status(200).json({ success: true, data: {} });
        });

        this.app.put('/store', async (req, res) => {
            res.status(200).json({ success: true, message: 'Store updated' });
        });

        // Orders for merchant
        this.app.get('/orders', async (req, res) => {
            res.status(200).json({ success: true, data: [] });
        });

        // Products for merchant
        this.app.get('/products', async (req, res) => {
            res.status(200).json({ success: true, data: [] });
        });

        // Payout requests
        this.app.post('/payouts', async (req, res) => {
            res.status(201).json({ success: true, message: 'Payout requested' });
        });

        this.app.get('/payouts', async (req, res) => {
            res.status(200).json({ success: true, data: [] });
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok', service: 'merchant' });
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`🏪 Merchant Service running on port ${this.port}`);
        });
    }
}

const merchantService = new MerchantService();
merchantService.start();
