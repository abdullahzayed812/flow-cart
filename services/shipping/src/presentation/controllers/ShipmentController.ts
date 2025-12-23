import { Request, Response, NextFunction } from 'express';
import { CreateShipmentUseCase } from '../../core/usecases/CreateShipmentUseCase';
import { UpdateShipmentStatusUseCase } from '../../core/usecases/UpdateShipmentStatusUseCase';
import { MySQLShipmentRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { ApiResponse } from '@flow-cart/shared';

export class ShipmentController {
    private createShipmentUseCase: CreateShipmentUseCase;
    private updateStatusUseCase: UpdateShipmentStatusUseCase;

    constructor(shipmentRepo: MySQLShipmentRepository) {
        this.createShipmentUseCase = new CreateShipmentUseCase(shipmentRepo);
        this.updateStatusUseCase = new UpdateShipmentStatusUseCase(shipmentRepo);
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderId, address } = req.body;
            const shipment = await this.createShipmentUseCase.execute(orderId, address);
            res.status(201).json(ApiResponse.success(shipment, 'Shipment created'));
        } catch (error) {
            next(error);
        }
    };

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await this.updateStatusUseCase.execute(id, status);
            res.status(200).json(ApiResponse.success(null, 'Shipment status updated'));
        } catch (error) {
            next(error);
        }
    };
}
