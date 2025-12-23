import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { OrderController } from '../controllers/OrderController';
import { MySQLCartRepository, MySQLOrderRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { pool } from '../../config/database';

const router = Router();

const cartRepo = new MySQLCartRepository(pool);
const orderRepo = new MySQLOrderRepository(pool);

const cartController = new CartController(cartRepo);
const orderController = new OrderController(orderRepo, cartRepo);

router.post('/cart', cartController.add);
router.post('/order', orderController.create);

export default router;
