import { IInventoryRepository } from '../../domain/repositories/IInventoryRepository';
import { Inventory, InventoryLog, InventoryLogType } from '../../domain/entities/Inventory';
import { Database } from '../database/Database';
import { RowDataPacket } from 'mysql2';

interface InventoryRow extends RowDataPacket {
    id: string;
    product_id: string;
    merchant_id: string;
    variant_id: string | null;
    quantity: number;
    reserved_quantity: number;
    reorder_level: number;
    reorder_quantity: number;
    warehouse_location: string | null;
    created_at: Date;
    updated_at: Date;
}

interface InventoryLogRow extends RowDataPacket {
    id: string;
    inventory_id: string;
    type: string;
    quantity: number;
    previous_quantity: number;
    new_quantity: number;
    reference_id: string | null;
    reference_type: string | null;
    notes: string | null;
    created_by: string | null;
    created_at: Date;
}

export class InventoryRepository implements IInventoryRepository {
    constructor(private db: Database) { }

    async create(inventory: Inventory): Promise<void> {
        const sql = `
      INSERT INTO inventory (id, product_id, merchant_id, variant_id, quantity, reserved_quantity,
                            reorder_level, reorder_quantity, warehouse_location, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await this.db.query(sql, [
            inventory.id,
            inventory.productId,
            inventory.merchantId,
            inventory.variantId,
            inventory.quantity,
            inventory.reservedQuantity,
            inventory.reorderLevel,
            inventory.reorderQuantity,
            inventory.warehouseLocation,
            inventory.createdAt,
            inventory.updatedAt
        ]);
    }

    async findById(id: string): Promise<Inventory | null> {
        const sql = 'SELECT * FROM inventory WHERE id = ?';
        const rows = await this.db.query<InventoryRow[]>(sql, [id]);
        return rows.length > 0 ? this.mapRowToInventory(rows[0]) : null;
    }

    async findByProduct(productId: string, merchantId: string, variantId?: string): Promise<Inventory | null> {
        const sql = 'SELECT * FROM inventory WHERE product_id = ? AND merchant_id = ? AND variant_id <=> ?';
        const rows = await this.db.query<InventoryRow[]>(sql, [productId, merchantId, variantId || null]);
        return rows.length > 0 ? this.mapRowToInventory(rows[0]) : null;
    }

    async findByMerchant(merchantId: string): Promise<Inventory[]> {
        const sql = 'SELECT * FROM inventory WHERE merchant_id = ?';
        const rows = await this.db.query<InventoryRow[]>(sql, [merchantId]);
        return rows.map(row => this.mapRowToInventory(row));
    }

    async findLowStock(merchantId: string): Promise<Inventory[]> {
        const sql = 'SELECT * FROM inventory WHERE merchant_id = ? AND available_quantity <= reorder_level';
        const rows = await this.db.query<InventoryRow[]>(sql, [merchantId]);
        return rows.map(row => this.mapRowToInventory(row));
    }

    async update(inventory: Inventory): Promise<void> {
        const sql = `
      UPDATE inventory 
      SET quantity = ?, reserved_quantity = ?, reorder_level = ?, reorder_quantity = ?,
          warehouse_location = ?, updated_at = ?
      WHERE id = ?
    `;
        await this.db.query(sql, [
            inventory.quantity,
            inventory.reservedQuantity,
            inventory.reorderLevel,
            inventory.reorderQuantity,
            inventory.warehouseLocation,
            inventory.updatedAt,
            inventory.id
        ]);
    }

    async addLog(log: InventoryLog): Promise<void> {
        const sql = `
      INSERT INTO inventory_logs (id, inventory_id, type, quantity, previous_quantity, new_quantity,
                                  reference_id, reference_type, notes, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await this.db.query(sql, [
            log.id,
            log.inventoryId,
            log.type,
            log.quantity,
            log.previousQuantity,
            log.newQuantity,
            log.referenceId,
            log.referenceType,
            log.notes,
            log.createdBy,
            log.createdAt
        ]);
    }

    async getLogs(inventoryId: string): Promise<InventoryLog[]> {
        const sql = 'SELECT * FROM inventory_logs WHERE inventory_id = ? ORDER BY created_at DESC';
        const rows = await this.db.query<InventoryLogRow[]>(sql, [inventoryId]);
        return rows.map(row => this.mapRowToInventoryLog(row));
    }

    private mapRowToInventory(row: InventoryRow): Inventory {
        return new Inventory(
            row.id,
            row.product_id,
            row.merchant_id,
            row.variant_id,
            row.quantity,
            row.reserved_quantity,
            row.reorder_level,
            row.reorder_quantity,
            row.warehouse_location,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    private mapRowToInventoryLog(row: InventoryLogRow): InventoryLog {
        return new InventoryLog(
            row.id,
            row.inventory_id,
            row.type as InventoryLogType,
            row.quantity,
            row.previous_quantity,
            row.new_quantity,
            row.reference_id,
            row.reference_type,
            row.notes,
            row.created_by,
            new Date(row.created_at)
        );
    }
}
