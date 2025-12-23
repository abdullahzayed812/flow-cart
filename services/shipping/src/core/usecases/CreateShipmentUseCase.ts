import { v4 as uuidv4 } from 'uuid';
import { MySQLShipmentRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { Shipment } from '../entities/Shipment';

export class CreateShipmentUseCase {
    constructor(private shipmentRepo: MySQLShipmentRepository) { }

    async execute(orderId: string, address: string): Promise<Shipment> {
        const shipment = new Shipment(
            uuidv4(),
            orderId,
            address,
            'PENDING',
            null,
            new Date(),
            new Date()
        );
        await this.shipmentRepo.create(shipment);
        return shipment;
    }
}
