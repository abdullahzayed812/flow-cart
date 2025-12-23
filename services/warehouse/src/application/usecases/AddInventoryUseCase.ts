import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory, InventoryLog, InventoryLogType } from '../../domain/entities/Inventory';
import { v4 as uuidv4 } from 'uuid';

export interface AddInventoryDTO {
    productId: string;
    merchantId: string;
    quantity: number;
    variantId?: string;
    warehouseLocation?: string;
}

export class AddInventoryUseCase {
    constructor(private inventoryRepository: IInventoryRepository) { }

    async execute(dto: AddInventoryDTO, userId?: string): Promise<Inventory> {
        // Check if inventory already exists
        const existing = await this.inventoryRepository.findByProduct(
            dto.productId,
            dto.merchantId,
            dto.variantId
        );

        if (existing) {
            // Add to existing inventory
            const previousQty = existing.quantity;
            existing.addStock(dto.quantity);
            await this.inventoryRepository.update(existing);

            // Log the addition
            const log = InventoryLog.create(
                uuidv4(),
                existing.id,
                InventoryLogType.ADD,
                dto.quantity,
                previousQty,
                existing.quantity,
                null,
                null,
                'Stock added',
                userId || null
            );
            await this.inventoryRepository.addLog(log);

            return existing;
        } else {
            // Create new inventory
            const inventory = Inventory.create(
                uuidv4(),
                dto.productId,
                dto.merchantId,
                dto.quantity,
                dto.variantId || null,
                10,
                50,
                dto.warehouseLocation || null
            );

            await this.inventoryRepository.create(inventory);

            // Log the creation
            const log = InventoryLog.create(
                uuidv4(),
                inventory.id,
                InventoryLogType.ADD,
                dto.quantity,
                0,
                inventory.quantity,
                null,
                null,
                'Initial stock',
                userId || null
            );
            await this.inventoryRepository.addLog(log);

            return inventory;
        }
    }
}
