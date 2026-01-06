import fs from 'fs';
import path from 'path';
import { db } from '../infrastructure/database/Database';

const initDb = async () => {
    try {
        // Path to the migration file
        // Go up from src/database -> src -> root -> database -> migrations
        const schemaPath = path.join(__dirname, '../../database/migrations/001_create_notifications_tables.sql');

        if (!fs.existsSync(schemaPath)) {
            console.error(`❌ Schema file not found at: ${schemaPath}`);
            process.exit(1);
        }

        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to get individual statements
        const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

        for (const stmt of statements) {
            await db.query(stmt);
        }

        console.log('✅ Notifications Database initialized successfully');
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Notifications Database initialization failed:', error);
        process.exit(1);
    }
};

initDb();
