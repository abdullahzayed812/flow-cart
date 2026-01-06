import { db } from '../infrastructure/database/Database';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('🌱 Seeding notifications service...');

    try {
        // Sample user IDs (matching what might be in auth service seed)
        const userIds = [
            '123e4567-e89b-12d3-a456-426614174000', // Admin/Merchant
            '123e4567-e89b-12d3-a456-426614174001', // Customer
            '123e4567-e89b-12d3-a456-426614174002'  // Another Customer
        ];

        // 1. Seed Subscriptions
        console.log('📱 Seeding subscriptions...');
        const subscriptions = [
            {
                id: uuidv4(),
                user_id: userIds[0],
                device_token: 'fcm_token_sample_1',
                device_type: 'web',
                is_active: true
            },
            {
                id: uuidv4(),
                user_id: userIds[1],
                device_token: 'fcm_token_sample_2',
                device_type: 'android',
                is_active: true
            },
            {
                id: uuidv4(),
                user_id: userIds[1],
                device_token: 'fcm_token_sample_3',
                device_type: 'ios',
                is_active: true
            }
        ];

        for (const sub of subscriptions) {
            await db.query(
                `INSERT INTO notification_subscriptions (id, user_id, device_token, device_type, is_active)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
                [sub.id, sub.user_id, sub.device_token, sub.device_type, sub.is_active]
            );
        }

        // 2. Seed Notifications
        console.log('🔔 Seeding notifications...');
        const notifications = [
            {
                id: uuidv4(),
                user_id: userIds[0],
                type: 'system',
                title: 'Welcome to Flow Cart',
                message: 'Your account has been successfully created.',
                data: JSON.stringify({ action: 'profile' }),
                is_read: true
            },
            {
                id: uuidv4(),
                user_id: userIds[0],
                type: 'new_payout',
                title: 'Payout Processed',
                message: 'Your payout of $1,250.00 has been processed.',
                data: JSON.stringify({ payoutId: 'pay_123' }),
                is_read: false
            },
            {
                id: uuidv4(),
                user_id: userIds[0],
                type: 'merchant_application',
                title: 'Application Approved',
                message: 'Your merchant application has been approved!',
                data: JSON.stringify({ applicationId: 'app_123' }),
                is_read: false
            },
            {
                id: uuidv4(),
                user_id: userIds[1],
                type: 'order_status',
                title: 'Order Shipped',
                message: 'Your order #ORD-123 has been shipped.',
                data: JSON.stringify({ orderId: 'ord_123', tracking: 'TRK123' }),
                is_read: false
            },
            {
                id: uuidv4(),
                user_id: userIds[1],
                type: 'low_stock',
                title: 'Item Back in Stock',
                message: 'The item you were watching is back in stock.',
                data: JSON.stringify({ productId: 'prod_123' }),
                is_read: true
            }
        ];

        for (const notif of notifications) {
            await db.query(
                `INSERT INTO notifications (id, user_id, type, title, message, data, is_read)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [notif.id, notif.user_id, notif.type, notif.title, notif.message, notif.data, notif.is_read]
            );
        }

        console.log('✅ Seeding completed successfully');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await db.close();
    }
}

seed();
