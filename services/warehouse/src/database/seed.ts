import { db } from '../infrastructure/database/Database';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
    try {
        console.log('🌱 Seeding Warehouse Service...');
        const connection = await db.getPool().getConnection();

        // Check if products exist
        const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM products');
        if (rows[0].count > 0) {
            console.log('⚠️  Products table already seeded. Skipping.');
            connection.release();
            process.exit(0);
        }

        // Create Category
        const [catResult]: any = await connection.query(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            ['Electronics', 'Gadgets and devices']
        );
        const categoryId = catResult.insertId;

        const productId = 'prod-1111-1111-1111-111111111111';

        // Create Product
        await connection.query(
            `INSERT INTO products (id, category_id, name, description, price, sku)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [productId, categoryId, 'FlowPhone X', 'The latest smartphone', 999.99, 'FP-X-001']
        );

        // Create Stock
        await connection.query(
            `INSERT INTO stock (product_id, quantity, reserved)
             VALUES (?, ?, ?)`,
            [productId, 100, 0]
        );

        // Create Stock Movement
        await connection.query(
            `INSERT INTO stock_movements (product_id, type, quantity, reason)
             VALUES (?, ?, ?, ?)`,
            [productId, 'IN', 100, 'Initial stock']
        );

        console.log('✅ Warehouse Service seeded successfully');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Warehouse Service seeding failed:', error);
        process.exit(1);
    }
};

seed();
