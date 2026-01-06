import { Router } from 'express';
import { ShipmentController } from '../controllers/ShipmentController';
import { MySQLShipmentRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { db } from '../../infrastructure/database/Database';

const router = Router();

const shipmentRepo = new MySQLShipmentRepository(db.getPool());
const shipmentController = new ShipmentController(shipmentRepo);

router.post('/shipment', shipmentController.create);
router.put('/shipment/:id/status', shipmentController.updateStatus);

export default router;
