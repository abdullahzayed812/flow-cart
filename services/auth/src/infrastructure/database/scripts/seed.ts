import { db } from '../Database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('🌱 Seeding Auth Service...');

        // Check if users exist
        const rows: any = await db.query('SELECT COUNT(*) as count FROM users');
        if (rows[0].count > 0) {
            console.log('⚠️  Users table already seeded. Skipping.');
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash('password123', 10);

        const users = [
            {
                id: '11111111-1111-1111-1111-111111111111',
                email: 'admin@flowcart.com',
                password_hash: passwordHash,
                role: 'admin'
            },
            {
                id: '22222222-2222-2222-2222-222222222222',
                email: 'merchant@flowcart.com',
                password_hash: passwordHash,
                role: 'merchant'
            },
            {
                id: '33333333-3333-3333-3333-333333333333',
                email: 'customer@flowcart.com',
                password_hash: passwordHash,
                role: 'customer'
            }
        ];

        for (const user of users) {
            await db.query(
                'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [user.id, user.email, user.password_hash, user.role]
            );
        }

        console.log('✅ Auth Service seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Auth Service seeding failed:', error);
        process.exit(1);
    }
};

seed();
