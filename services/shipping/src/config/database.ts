import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'shipping_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

export const pool = mysql.createPool(dbConfig);

export const checkDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Shipping DB connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Shipping DB connection failed:', error);
        process.exit(1);
    }
};
