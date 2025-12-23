import { MySQLShipmentRepository } from '../../infrastructure/repositories/MySQLRepositories';

export class UpdateShipmentStatusUseCase {
    constructor(private shipmentRepo: MySQLShipmentRepository) { }

    async execute(id: string, status: string): Promise<void> {
        await this.shipmentRepo.updateStatus(id, status);
    }
}
