import { db } from '../Database';
import fs from 'fs';
import path from 'path';

async function reset() {
    try {
        // Get all tables
        const rows = await db.query('SHOW TABLES');
        const tables = rows.map((row: any) => Object.values(row)[0]);

        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        for (const table of tables) {
            await db.query(`DROP TABLE IF EXISTS ${table}`);
        }
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ Database reset successfully');

        // Re-initialize
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            const statements = schema.split(';').filter(s => s.trim());

            for (const statement of statements) {
                await db.query(statement);
            }
            console.log('✅ Database re-initialized successfully');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Database reset failed:', error);
        process.exit(1);
    }
}

reset();
