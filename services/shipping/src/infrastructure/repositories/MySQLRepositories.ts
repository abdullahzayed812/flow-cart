import { Pool } from 'mysql2/promise';
import { Shipment } from '../../core/entities/Shipment';

export class MySQLShipmentRepository {
    constructor(private pool: Pool) { }

    async create(shipment: Shipment): Promise<void> {
        await this.pool.execute(
            'INSERT INTO shipments (id, order_id, address, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [shipment.id, shipment.orderId, shipment.address, shipment.status, shipment.createdAt, shipment.updatedAt]
        );
    }

    async updateStatus(id: string, status: string): Promise<void> {
        await this.pool.execute('UPDATE shipments SET status = ? WHERE id = ?', [status, id]);
        await this.pool.execute('INSERT INTO shipment_events (shipment_id, status) VALUES (?, ?)', [id, status]);
    }

    async findById(id: string): Promise<Shipment | null> {
        const [rows] = await this.pool.execute('SELECT * FROM shipments WHERE id = ?', [id]);
        const shipments = rows as any[];
        if (shipments.length === 0) return null;
        const s = shipments[0];
        return new Shipment(s.id, s.order_id, s.address, s.status, s.courier_id, s.created_at, s.updated_at);
    }
}
