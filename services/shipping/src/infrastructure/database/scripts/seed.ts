import { db } from '../Database';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
    try {
        console.log('🌱 Seeding Shipping Service...');

        // Check if couriers exist
        const rows: any = await db.query('SELECT COUNT(*) as count FROM couriers');
        if (rows[0].count > 0) {
            console.log('⚠️  Couriers table already seeded. Skipping.');
            process.exit(0);
        }

        // Create Courier
        const courierResult: any = await db.query(
            'INSERT INTO couriers (name, vehicle_type, status) VALUES (?, ?, ?)',
            ['FastDelivery Inc.', 'Van', 'AVAILABLE']
        );
        const courierId = courierResult.insertId;

        // Create Shipment (linked to the order from Ecommerce service)
        const orderId = 'order-1111-1111-1111-111111111111';
        const shipmentId = uuidv4();

        await db.query(
            `INSERT INTO shipments (id, order_id, courier_id, status, address)
             VALUES (?, ?, ?, ?, ?)`,
            [shipmentId, orderId, courierId, 'PENDING', '123 Main St, Cityville']
        );

        console.log('✅ Shipping Service seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Shipping Service seeding failed:', error);
        process.exit(1);
    }
};

seed();
