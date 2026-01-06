import { db } from '../infrastructure/database/Database';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
    try {
        console.log('🌱 Seeding Ecommerce Service...');
        const connection = await db.getPool().getConnection();

        // Check if orders exist
        const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM orders');
        if (rows[0].count > 0) {
            console.log('⚠️  Orders table already seeded. Skipping.');
            connection.release();
            process.exit(0);
        }

        const userId = '33333333-3333-3333-3333-333333333333'; // Matches Auth Service Customer ID
        const productId = 'prod-1111-1111-1111-111111111111'; // Matches Warehouse Service Product ID
        const orderId = uuidv4();

        // Create Order
        await connection.query(
            `INSERT INTO orders (id, user_id, total_amount, status)
             VALUES (?, ?, ?, ?)`,
            [orderId, userId, 999.99, 'CONFIRMED']
        );

        // Create Order Item
        await connection.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
             VALUES (?, ?, ?, ?)`,
            [orderId, productId, 1, 999.99]
        );

        // Create Cart
        const cartId = uuidv4();
        await connection.query(
            `INSERT INTO carts (id, user_id)
             VALUES (?, ?)`,
            [cartId, userId]
        );

        // Create Cart Item
        await connection.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
             VALUES (?, ?, ?)`,
            [cartId, productId, 2]
        );

        console.log('✅ Ecommerce Service seeded successfully');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Ecommerce Service seeding failed:', error);
        process.exit(1);
    }
};

seed();
