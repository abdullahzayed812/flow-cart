import fs from 'fs';
import path from 'path';
import { db } from '../infrastructure/database/Database';

const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to get individual statements
        const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

        const connection = await db.getPool().getConnection();

        for (const stmt of statements) {
            await connection.query(stmt);
        }

        console.log('✅ Database initialized successfully');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initDb();
