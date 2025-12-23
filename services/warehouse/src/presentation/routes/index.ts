import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { StockController } from '../controllers/StockController';
import { MySQLProductRepository, MySQLStockRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { pool } from '../../config/database';

const router = Router();

const productRepo = new MySQLProductRepository(pool);
const stockRepo = new MySQLStockRepository(pool);

const productController = new ProductController(productRepo);
const stockController = new StockController(stockRepo);

router.post('/products', productController.create);
router.get('/products', productController.getAll);
router.post('/stock/update', stockController.update);

export default router;
