import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
    private static instance: Database;
    private pool: mysql.Pool;

    private constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'warehouse_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async query<T = any>(sql: string, params?: any[]): Promise<T> {
        const [rows] = await this.pool.execute(sql, params);
        return rows as T;
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}

export const db = Database.getInstance();
