import { db } from '../infrastructure/database/Database';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
    try {
        console.log('🌱 Seeding Shipping Service...');
        const connection = await db.getPool().getConnection();

        // Check if couriers exist
        const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM couriers');
        if (rows[0].count > 0) {
            console.log('⚠️  Couriers table already seeded. Skipping.');
            connection.release();
            process.exit(0);
        }

        // Create Courier
        const [courierResult]: any = await connection.query(
            'INSERT INTO couriers (name, vehicle_type, status) VALUES (?, ?, ?)',
            ['FastDelivery Inc.', 'Van', 'AVAILABLE']
        );
        const courierId = courierResult.insertId;

        // Create Shipment (linked to the order from Ecommerce service)
        // Order ID matches the one in Ecommerce seed
        // We need to generate a consistent Order ID in Ecommerce seed first, which we did (uuidv4() was used but not fixed).
        // Wait, I used uuidv4() for orderId in Ecommerce seed. I should have used a fixed ID if I want to link it here.
        // Let's assume for now we just create a shipment for a "dummy" order or I should update Ecommerce seed to use fixed Order ID.

        // Let's use a fixed Order ID in Ecommerce seed. I will update Ecommerce seed next.
        const orderId = 'order-1111-1111-1111-111111111111';
        const shipmentId = uuidv4();

        await connection.query(
            `INSERT INTO shipments (id, order_id, courier_id, status, address)
             VALUES (?, ?, ?, ?, ?)`,
            [shipmentId, orderId, courierId, 'PENDING', '123 Main St, Cityville']
        );

        console.log('✅ Shipping Service seeded successfully');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Shipping Service seeding failed:', error);
        process.exit(1);
    }
};

seed();
