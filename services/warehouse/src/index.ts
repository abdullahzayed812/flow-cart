import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Database } from './infrastructure/database/Database';
import { InventoryRepository } from './infrastructure/repositories/InventoryRepository';
import { AddInventoryUseCase } from './application/usecases/AddInventoryUseCase';
import { ReserveStockUseCase } from './application/usecases/ReserveStockUseCase';

dotenv.config();

class WarehouseService {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '4003');
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
    }

    private setupRoutes(): void {
        const db = Database.getInstance();
        const inventoryRepository = new InventoryRepository(db);
        const addInventoryUseCase = new AddInventoryUseCase(inventoryRepository);
        const reserveStockUseCase = new ReserveStockUseCase(inventoryRepository);

        // Add inventory
        this.app.post('/warehouse/inventory/add', async (req, res) => {
            try {
                const inventory = await addInventoryUseCase.execute(req.body);
                res.status(201).json({ success: true, data: inventory });
            } catch (error: any) {
                res.status(400).json({ success: false, error: { message: error.message } });
            }
        });

        // Reserve stock
        this.app.post('/warehouse/inventory/reserve', async (req, res) => {
            try {
                await reserveStockUseCase.execute(req.body);
                res.status(200).json({ success: true, message: 'Stock reserved' });
            } catch (error: any) {
                res.status(400).json({ success: false, error: { message: error.message } });
            }
        });

        // Get inventory
        this.app.get('/warehouse/inventory/:productId', async (req, res) => {
            try {
                const { productId } = req.params;
                const { merchantId, variantId } = req.query;
                const inventory = await inventoryRepository.findByProduct(
                    productId,
                    merchantId as string,
                    variantId as string
                );
                res.status(200).json({ success: true, data: inventory });
            } catch (error: any) {
                res.status(500).json({ success: false, error: { message: error.message } });
            }
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok', service: 'warehouse' });
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`📦 Warehouse Service running on port ${this.port}`);
        });
    }
}

const warehouseService = new WarehouseService();
warehouseService.start();
