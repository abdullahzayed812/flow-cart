import fs from 'fs';
import path from 'path';
import { Database } from '../Database';

async function init() {
    try {
        const db = Database.getInstance();
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
            console.log('⚠️  No schema.sql found. Skipping.');
            process.exit(0);
        }
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema.split(';').filter(s => s.trim());

        for (const statement of statements) {
            await db.query(statement);
        }
        console.log('✅ Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

init();
