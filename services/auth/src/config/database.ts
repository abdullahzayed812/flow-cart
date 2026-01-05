import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'abdo',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'auth_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

export const pool = mysql.createPool(dbConfig);

export const checkDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
