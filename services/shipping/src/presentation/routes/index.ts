import { Router } from 'express';
import { ShipmentController } from '../controllers/ShipmentController';
import { MySQLShipmentRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { pool } from '../../config/database';

const router = Router();

const shipmentRepo = new MySQLShipmentRepository(pool);
const shipmentController = new ShipmentController(shipmentRepo);

router.post('/shipment', shipmentController.create);
router.put('/shipment/:id/status', shipmentController.updateStatus);

export default router;
