import { Database } from '../Database';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
    try {
        console.log('🌱 Seeding Notifications Service...');
        const db = Database.getInstance();

        // Check if notifications exist
        const rows: any = await db.query('SELECT COUNT(*) as count FROM notifications');
        if (rows[0].count > 0) {
            console.log('⚠️  Notifications table already seeded. Skipping.');
            process.exit(0);
        }

        const userId = '33333333-3333-3333-3333-333333333333'; // Matches Auth Service Customer ID

        await db.query(
            `INSERT INTO notifications (id, user_id, type, title, message, is_read) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [uuidv4(), userId, 'ORDER_CONFIRMED', 'Order Confirmed', 'Your order has been confirmed and is being processed.', false]
        );

        console.log('✅ Notifications Service seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Notifications Service seeding failed:', error);
        process.exit(1);
    }
};

seed();
