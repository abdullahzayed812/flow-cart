import { Inventory, InventoryLog } from '../entities/Inventory';

export interface IInventoryRepository {
    create(inventory: Inventory): Promise<void>;
    findById(id: string): Promise<Inventory | null>;
    findByProduct(productId: string, merchantId: string, variantId?: string): Promise<Inventory | null>;
    findByMerchant(merchantId: string): Promise<Inventory[]>;
    findLowStock(merchantId: string): Promise<Inventory[]>;
    update(inventory: Inventory): Promise<void>;
    addLog(log: InventoryLog): Promise<void>;
    getLogs(inventoryId: string): Promise<InventoryLog[]>;
}
