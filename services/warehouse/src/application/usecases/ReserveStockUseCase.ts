import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { InventoryLog, InventoryLogType } from '../../domain/entities/Inventory';
import { v4 as uuidv4 } from 'uuid';

export interface ReserveStockDTO {
    productId: string;
    merchantId: string;
    quantity: number;
    orderId: string;
    variantId?: string;
}

export class ReserveStockUseCase {
    constructor(private inventoryRepository: IInventoryRepository) { }

    async execute(dto: ReserveStockDTO): Promise<void> {
        const inventory = await this.inventoryRepository.findByProduct(
            dto.productId,
            dto.merchantId,
            dto.variantId
        );

        if (!inventory) {
            throw new Error('Inventory not found');
        }

        const previousReserved = inventory.reservedQuantity;
        inventory.reserveStock(dto.quantity);
        await this.inventoryRepository.update(inventory);

        // Log the reservation
        const log = InventoryLog.create(
            uuidv4(),
            inventory.id,
            InventoryLogType.RESERVE,
            dto.quantity,
            previousReserved,
            inventory.reservedQuantity,
            dto.orderId,
            'order',
            `Reserved for order ${dto.orderId}`,
            null
        );
        await this.inventoryRepository.addLog(log);
    }
}
